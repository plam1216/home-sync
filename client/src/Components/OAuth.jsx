import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            // get user's Google info
            const googleUser = await signInWithPopup(auth, provider)

            // console.log("Google User", googleUser)

            // store User's info
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: googleUser.user.displayName, email: googleUser.user.email, photo: googleUser.user.photoURL }),
            })

            const data = await res.json()

            dispatch(signInSuccess(data))
            navigate('/')
        } catch (err) {
            console.log('Failed to sign in with Google', err)
        }
    }
    return (
        <button
            onClick={handleGoogleClick}
            type='button'
            className='bg-red-700 text-white p-3 rounded-lg uppercase hover hover:opacity-90'
        >
            Login with Google
        </button>
    )
}

export default OAuth