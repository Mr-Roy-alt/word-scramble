import { useState, useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebaseConfig.js';
import { useNavigate, Outlet } from 'react-router-dom'
// import propTypes from 'prop-types'

export default function AuthRequired() {
    const [authUser, setAuthUser] = useState(null);

    const navigationHistory = useNavigate();

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is signed in");
                setAuthUser(user);
                // ...
            } else {
                console.log("user is signed out");
                setAuthUser(false)
            }
        });

        return () => {
            listen();
        }
    }, [authUser]);

    return (
        <>
            {
                authUser ? <Outlet /> : navigationHistory('/')
            }
        </>
    )
}



