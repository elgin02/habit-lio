import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    // user is logged in or out
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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
                    .then((result) => {
                        console.log("Logged in:", result.user.email);
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

    return (
        <div className="card">
            <h1>Habit-lio</h1>
            {user ? (
                <div>
                    <p>Welcome, <strong>{user.email}</strong>!</p>
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
