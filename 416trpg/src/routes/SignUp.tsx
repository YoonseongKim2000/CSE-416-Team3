import './SignUp.css'
import { generateHash } from '../utilities/hashutils'
import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function SignUp() {
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        //get form info
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        if (!email || !password || !confirmPassword) { //confirm all fields are not empty
            toast.error("Please fill in all fields.");
            return;
        }

        if (password != confirmPassword) { //check passwords match
            toast.error("Error, passwords do not match.");
            return;
        }

        const hashedPw = generateHash(email, password);

        const signupData = {email: email, password: hashedPw};
        console.log(signupData);

        try {
            const response = await fetch(apiUrl + "user/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            console.log(response);
            // const result = await response.json();
            // console.log(result);

            if (response.ok && response.status == 201) { //response shows account was made
                toast.success("Account registered successfully! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2500);
            } else {
                if (response.status >= 400 || response.status < 500) { //user issue
                    toast.error("Entered information is invalid.")
                } else {
                    toast.error(response.statusText || "An error occurred during registration.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(""+(error));
        }
    }

    return (
        <div className='container signup-container d-flex justify-content-center align-items-center'>
            <div className='card medium-card shadow-lg signup-card d-flex align-items-center p-4'>
                <h1 className='fw-bold text-center title-style'>Sign Up</h1>
                <form onSubmit={handleSubmit} className='signup-form'>
                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label signup-label'>
                            Email:
                        </label>
                        <input 
                            type="email" 
                            name='email' 
                            className='form-control'
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label signup-label'>
                            Password:
                        </label>
                        <input 
                            type="password" 
                            name='password' 
                            className='form-control'
                            placeholder='Enter your password'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="confirmPassword" className='form-label signup-label'>
                            Confirm Password:
                        </label>
                        <input 
                            type="password" 
                            name='confirmPassword' 
                            className='form-control'
                            placeholder='Confirm your password'
                        />
                    </div>
                    <p className='mt-5'>By signing up you agree to our Terms and Conditions</p>
                    <button type='submit' className='btn submit-button mt-4 w-75 mb-4'>Sign Up</button>
                </form>
            </div>
            {/* Toast container */}
            <ToastContainer position="top-center" autoClose={2500} theme="colored" />
        </div>
    )
}

export default SignUp