import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, listHabits, createHabit, deleteHabit, exportHabits } from "./firestore";
import './App.css';
import Menu from "./Menu";

function App() {
    const [user, setUser] = useState(null);
    const [habits, setHabits] = useState([]);
    const [newHabitTitle, setNewHabitTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const loadHabits = async (uid) => {
        try {
            const userHabits = await listHabits(uid);
            setHabits(userHabits);
        } catch (error) {
            console.error("Error loading habits:", error);
        }
    };

    // user is logged in or out
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadHabits(currentUser.uid);
            } else {
                setHabits([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = () => {
        chrome.identity.clearAllCachedAuthTokens(() => { // cleared cache tokens because of errors without it
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError || !token) {
                    console.error("Sign-in failed", chrome.runtime.lastError);
                    return;
                }

                const credential = GoogleAuthProvider.credential(null, token);

                signInWithCredential(auth, credential)
                    .then(async (result) => {
                        console.log("Logged in:", result.user.email);
                        try {
                            await createUserProfile(result.user.uid, {
                                email: result.user.email,
                                displayName: result.user.displayName
                            });
                        } catch (error) {
                            console.error("Error creating user profile:", error);
                        }
                    })
                    .catch((err) => {
                        console.error("Firebase Auth Error:", err);
                    });
            });
        });
    };

    const handleSignOut = () => {
        auth.signOut().then(() => {
            // Optional: Also revoke the Chrome token if you want a total logout
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (token) {
                    chrome.identity.removeCachedAuthToken({ token }, () => {});
                }
            });
        });
    };

    const handleAddHabit = async () => {
        if (!newHabitTitle.trim() || !user) return;

        setLoading(true);
        try {
            await createHabit(user.uid, { title: newHabitTitle });
            setNewHabitTitle("");
            await loadHabits(user.uid);
        } catch (error) {
            console.error("Error creating habit:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHabit = async (habitId) => {
        if (!user) return;

        try {
            await deleteHabit(user.uid, habitId);
            await loadHabits(user.uid);
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    };

    const handleExportHabits = async () => {
        if (!user) return;
        try {
            console.log("Attempted export");
            await exportHabits(user.uid);
        } catch (error) {
            console.error("Error exporting habits:", error);
        }
    };

    return (
        <div className="card">
            <h1>Habit-lio</h1>
            {user ? (
                <div>
                    <Menu />
                    <p>Welcome, <strong>{user.email}</strong>!</p>
                    
                    <div>
                        <h2>Your Habits</h2>
                        
                        <div>
                            <input
                                type="text"
                                value={newHabitTitle}
                                onChange={(e) => setNewHabitTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                                placeholder="Enter a new habit..."
                                disabled={loading}
                            />
                            <button onClick={handleAddHabit} disabled={loading}>
                                {loading ? "Adding..." : "Add Habit"}
                            </button>
                        </div>

                        <ul>
                            {habits.map((habit) => (
                                <li key={habit.id}>
                                    <div>
                                        <h3>{habit.title}</h3>
                                        {habit.description && <p>{habit.description}</p>}
                                        <span>{habit.frequency}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteHabit(habit.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <button onClick={() => handleExportHabits()}>Export Habits to CSV</button>
                        </div>
                        {habits.length === 0 && <p>No habits yet. Create one to get started!</p>}
                    </div>

                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <div>
                    <p>Track your habits!</p>
                    <button onClick={handleSignIn}>Sign in with Google</button>
                </div>
            )}
        </div>
    );
}

export default App;


//import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App
