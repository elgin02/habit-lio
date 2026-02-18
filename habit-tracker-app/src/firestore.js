import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc
} from "firebase/firestore";

import { db } from "./firebase";

export const createUserProfile = async (uid, { email, displayName }) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      email: email || null,
      displayName: displayName || null,
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return userRef;
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const createHabit = async (uid, habit) => {
  const habitsRef = collection(db, "users", uid, "habits");
  const habitDoc = {
    title: habit.title,
    description: habit.description || "",
    frequency: habit.frequency || "daily",
    isActive: habit.isActive ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(habitsRef, habitDoc);
  return docRef;
};

export const listHabits = async (uid) => {
  const habitsRef = collection(db, "users", uid, "habits");
  const habitsQuery = query(habitsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(habitsQuery);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
};

export const updateHabit = async (uid, habitId, updates) => {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  await updateDoc(habitRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteHabit = async (uid, habitId) => {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  await deleteDoc(habitRef);
};
