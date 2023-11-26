// SignIn.js
import { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';

// Desc: Sign In page
export default function SignIn() {
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [signInPage, setSignInPage] = useState(true);

    const navigationHistory = useNavigate();


    function handleChange(event) {
        setUserData((userData) => ({ ...userData, [event.target.name]: event.target.value }));
    }

    function handleSignInPage() {
        setSignInPage(!signInPage);
    }

    function handleSignIn(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((data) => {
                console.log("-----------------------------------------");
                console.log(data, "authData");

                navigationHistory('/game');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert(errorCode);
                // ..
            });
    }

    function handleSignUp(e) {
        e.preventDefault();

        if (userData.userName.length > 6) {
            alert("username can't be above 6 characters");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            alert("passwords don't match");
            return;
        }

        if (userData.password.length < 6) {
            alert("passwords must be at least 6 characters");
            return;
        }

        createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then((data) => {
                updateProfile(auth.currentUser, {
                    displayName: userData.userName,
                }).then(() => {
                    // Profile updated!
                    console.log("userName updated seccessfull");
                }).catch((error) => {
                    // An error occurred
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    // ...
                });

                console.log("-----------------------------------------");
                console.log(data, "authData");
                navigationHistory('/game');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert(errorCode);
                setSignInPage(true);
                // ..
            });
    }

    return (
        <>
            <div className='bg-gradient-to-r from-cyan-400 to-blue-400 p-8 text-center w-screen h-screen flex justify-center items-center sm:w-full'>
                {
                    signInPage ?
                        <div className='sm:w-full w-1/4'>
                            {/* {console.log(userData)} */}
                            <h1 className='font-bold text-indigo-800 text-2xl drop-shadow-md'>Scramble Game</h1>
                            <h3 className='mb-5 font-medium'>Welcome back!!! 😎</h3>
                            <div>
                                <form onSubmit={handleSignIn}>
                                    <div className='flex flex-col  '>
                                        <Input
                                            type='text'
                                            placeholder='📧 Email'
                                            onChange={handleChange}
                                            name='email'
                                            value={userData.email}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Input
                                            type='password'
                                            placeholder='🔐 Password'
                                            onChange={handleChange}
                                            name='password'
                                            value={userData.password}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Button type='submit' raduis="sm" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 drop-shadow'>
                                            Sign In
                                        </Button>
                                    </div>
                                </form>
                                <div className=''>
                                    <p className='font-medium text-white'>
                                        Don&apos;t have an account?
                                        <span onClick={handleSignInPage} className='ml-1 text-blue-700 font-bold cursor-pointer'>
                                            Sign Up
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div> :

                        <div className='sm:w-full w-1/4'>
                            {/* {console.log(userData)} */}
                            <h1 className='font-bold text-indigo-800 text-2xl drop-shadow-md'>Scramble Game</h1>
                            <h3 className='mb-5'>SignUP to play 😎</h3>
                            <div>
                                <form onSubmit={handleSignUp}>
                                    <div className='flex flex-col '>
                                        <Input
                                            type='text'
                                            placeholder='🙍‍♂️ Username'
                                            onChange={handleChange}
                                            name='userName'
                                            value={userData.userName}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Input
                                            type='text'
                                            placeholder='📧 Email'
                                            onChange={handleChange}
                                            name='email'
                                            value={userData.email}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Input
                                            type='password'
                                            placeholder='🔐 Password'
                                            onChange={handleChange}
                                            name='confirmPassword'
                                            value={userData.confirmPassword}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Input
                                            type='password'
                                            placeholder='🔏 Confirm password'
                                            onChange={handleChange}
                                            name='password'
                                            value={userData.password}
                                            className='mb-2 drop-shadow'
                                            isRequired={true}
                                        />
                                        <Button type='submit' raduis="sm" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 drop-shadow'>
                                            Sign Up
                                        </Button>
                                    </div>
                                </form>
                                <div className=''>
                                    <p className='text-white font-medium'>
                                        You have an account?
                                        <span onClick={handleSignInPage} className='ml-1 text-blue-700 font-bold cursor-pointer'>
                                            Sign In
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                }
            </div>
        </>
    );
}

// Remove the unnecessary prop types
// SignIn.propTypes = {};
