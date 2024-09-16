"use client"

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { INSTRUMENTS } from '../actions/constant'
import { URL_BEGIN } from '../actions/constant'
// import { WEB_PROTOCOL, ADDRESS, PORT } from '../actions/constant'

export default function CreateRegistryForm({reqType='signup'}) {
    // Create a router object
    const router = useRouter()
    const admin = reqType === 'signupA';
    
    interface FormData {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        instrument: string;
        level: boolean;
    }
    
    const [formData, setFormData] = useState<FormData>({  
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        instrument: '',
        level: admin
    });

    // create error state variables for each form field
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showErrors, setShowErrors] = useState(false);

    // create a function to handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    // create a function to handle form select field changes
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    // useEffect(() =>
    useEffect(() => {
        // Clear *errors* if password or confirmPassword fields are empty
        if (!formData.password || !formData.confirmPassword) {
          setErrors({});
          setShowErrors(false);
          return;
        }
    
        validatePassword(); 
        }, [formData.password, formData.confirmPassword]);
    
    const validatePassword = () => {
        const newErrors: { [key: string]: string } = {}; 
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
    
        setShowErrors(Object.keys(newErrors).length > 0); // Show errors if there are any
      }

    // create a function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // prevent default form submission
        e.preventDefault();

        // if there are errors, return
        if (Object.keys(errors).length > 0) {
            return;
        }

        // if there is no error, Send data to the server
        try {
            console.log('send Post');
            // wait for server response and store it in a variable
            const response = await fetch(URL_BEGIN + '/api/'+ reqType, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // log response - for debugging purposes
            console.log('response:', response, " <!>");
            
            
            // if got response 'ok' then redirect to login page
            if (response.ok) {
                // pop message to user that registration was successful
                // alert('Registration successful! Please login to continue.');

                // redirect to the login page
                router.push('/login');
            }
            // if there are errors, set the errors state variable 
            else {
                const data = await response.json();
                setErrors(data.errors || { general: 'An error occurred during registration' }); 
            }
        } catch (error) {
            console.error('An unexpected error happened:', error);
        }
        // log form data
        console.log(formData);
    }

// return part
return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit}>
            {showErrors && (
                // 
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> 
                        Please check the following:
                    </span>
                    <ul className="list-disc list-inside mt-2">
                        {Object.keys(errors).map((key) => (
                            <li key={key}>
                                    {errors[key]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="firstName" className="label-text-input">
                    First Name:
                </label>
                <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                className="text-input" 
                required={true}
                onChange={handleChange}
                autoComplete='given-name'
                />
            </div>

            <div className="mb-4">
                <label htmlFor="lastName" className="label-text-input">
                    Last Name:
                </label>
                <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                className="text-input" 
                required={true}
                onChange={handleChange}
                autoComplete='family-name'
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="label-text-input">
                    Email:
                </label>
                <input 
                type="email" 
                id="email" 
                name="email" 
                className="text-input"
                required
                onChange={handleChange} 
                autoComplete='email'
                />
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="label-text-input">
                    Password:
                </label>
                <input 
                type="password" 
                id="password" 
                name="password" 
                className="pass-input" 
                value={formData.password}
                required
                onChange={handleChange}
                />
            </div>

            <div className="mb-6">
                <label htmlFor="confirmPassword" className="label-text-input">
                    Confirm Password:
                </label>
                <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                className="pass-input"  // add a class to style the password input
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                />
            </div>

            <div className="mb-4">
            <label htmlFor="instrument" className="label-text-input">Instrument:</label>
            <select 
                id="instrument" 
                name="instrument"
                className='text-input'
                value={formData.instrument}
                onChange={handleSelectChange}
                required>
                {INSTRUMENTS.map((instrument) => (
                    <option key={instrument} value={instrument}>{instrument}</option>
                ))}
            </select>
            </div>

            <div className="flex flex-row items-center justify-center">
                <button 
                type="submit" 
                className="primary-btn w-1/2">
                Sign-up
                </button>
            </div>
            
            <div className="flex flex-row items-center justify-center mt-4">
                <button 
                type="button" 
                className="primary-btn color-secondary w-1/2" 
                onClick={() => router.push('/login')}>
                Login
                </button>
            </div>
        </form>
    </div>
)}
