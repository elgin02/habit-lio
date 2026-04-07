const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Calculates streak from completion history
const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  const sortedDates = [...completions].sort((a, b) => new Date(b) - new Date(a));
  const today = getTodayDate();
  const mostRecent = sortedDates[0];
  const daysSinceLast = Math.floor(
    (new Date(today) - new Date(mostRecent)) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLast > 1) return 0;

  let streak = 1;
  let prevDate = new Date(mostRecent);
  prevDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);

    const expectedPrev = new Date(prevDate);
    expectedPrev.setDate(expectedPrev.getDate() - 1);

    if (current.getTime() === expectedPrev.getTime()) {
      streak++;
      prevDate = current;
    } else {
      break;
    }
  }

  return streak;
};

// Triggered on every habit write - recalculates streak server-side
exports.onHabitUpdate = functions.firestore
  .document("users/{userId}/habits/{habitId}")
  .onWrite(async (change, context) => {
    const { userId, habitId } = context.params;
    const habitData = change.after.data();

    if (!habitData) return null;

    const completions = habitData.completions || [];
    const newStreak = calculateStreak(completions);

    let lastCompletedDate = null;
    if (completions.length > 0) {
      const sortedDates = [...completions].sort((a, b) => new Date(b) - new Date(a));
      lastCompletedDate = sortedDates[0];
    }

    const currentStreak = habitData.streak ?? 0;
    const currentLastCompletedDate = habitData.lastCompletedDate ?? null;

    // Avoid self-trigger loops: only write when derived fields actually change.
    if (
      currentStreak === newStreak &&
      currentLastCompletedDate === lastCompletedDate
    ) {
      return null;
    }

    return db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .doc(habitId)
      .update({
        streak: newStreak,
        lastCompletedDate: lastCompletedDate,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((error) => {
        console.error("Error updating streak:", error);
      });
  });

// Callable function - returns completion percentage over N days
exports.getCompletionRate = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { habitId, days = 30 } = data;
  const uid = context.auth.uid;

  try {
    const habitRef = db.collection("users").doc(uid).collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Habit not found");
    }

    const completions = habitDoc.data().completions || [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const completionsInWindow = completions.filter(
      (date) => date >= startDateStr
    );

    const completionRate =
      days > 0 ? (completionsInWindow.length / days) * 100 : 0;

    return {
      completionRate: Math.round(completionRate),
      completionsCount: completionsInWindow.length,
      totalDays: days,
    };
  } catch (error) {
    console.error("Error calculating completion rate:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error calculating completion rate"
    );
  }
});
