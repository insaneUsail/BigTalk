import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
    // Fixed: was "Sign up" (lowercase u) but compared to "Sign Up" everywhere — now consistent
    const [currState, setCurrState] = useState("Sign Up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login } = useContext(AuthContext);

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // If signing up and bio not yet submitted, show bio step
        if (currState === "Sign Up" && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        // Fixed: map currState correctly to API endpoint
        login(currState === "Sign Up" ? "signup" : "login", {
            fullName,
            email,
            password,
            bio,
        });
    };

    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
            {/* Left logo */}
            <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

            <form
                onSubmit={onSubmitHandler}
                className='border-2 bg-white/5 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
            >
                <h2 className="font-medium text-2xl flex justify-center items-center gap-2">
                    {currState}
                    <img src={assets.arrow_icon} alt="" className='w-5' />
                </h2>

                {/* Full name — only on Sign Up step 1 */}
                {currState === "Sign Up" && !isDataSubmitted && (
                    <input
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        type="text"
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder="Full Name"
                        required
                    />
                )}

                {/* Email and password — shown on step 1 */}
                {!isDataSubmitted && (
                    <>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder='Email Address'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder='Password'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </>
                )}

                {/* Bio — only on Sign Up step 2 */}
                {currState === "Sign Up" && isDataSubmitted && (
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        rows={4}
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Provide a short bio...'
                        required
                    />
                )}

                <button
                    type='submit'
                    className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
                >
                    {currState === "Sign Up" ? "Create Account" : "Login Now"}
                </button>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" required />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>

                <div className='flex flex-col gap-2'>
                    {currState === "Sign Up" ? (
                        <p className='text-sm text-gray-400'>
                            Already have an account?{" "}
                            <span
                                onClick={() => { setCurrState("Login"); setIsDataSubmitted(false); }}
                                className='font-medium text-violet-500 cursor-pointer'
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className='text-sm text-gray-400'>
                            Don't have an account?{" "}
                            <span
                                onClick={() => { setCurrState("Sign Up"); setIsDataSubmitted(false); }}
                                className='font-medium text-violet-500 cursor-pointer'
                            >
                                Create one
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPage;