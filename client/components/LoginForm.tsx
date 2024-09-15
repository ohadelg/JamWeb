"use client"

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { WEB_PROTOCOL, ADDRESS, PORT } from '../actions/constant'

// import { validatePassword } from '../utils/validatePassword'

export default function CreateLoginForm() {
    // Create a router object
    const router = useRouter()
    
    interface FormData {
        email: string;
        password: string;
    }
    
    const [formData, setFormData] = useState<FormData>({  
        email: '',
        password: ''
    });

    // create error state variables for each form field
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showErrors, setShowErrors] = useState(false);

    // create a function to handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    // useEffect(() =>
    useEffect(() => {
        // Clear *errors* if password or confirmPassword fields are empty
        if (!formData.password) {
          setErrors({});
          setShowErrors(false);
          return;
        }
    
        validatePassword(); 
        }, [formData.password]);
    
    const validatePassword = () => {
        const newErrors: { [key: string]: string } = {}; 
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
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
            const response = await fetch(URL_BEGIN + '/api/login', {
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
                console.log('response.ok:', response);
                const data = await response.json();
                console.log('Data:', data);

                // if the server response is 'Connected'
                localStorage.setItem('token', data.token);
                localStorage.setItem('level', data.level);
                localStorage.setItem('name', data.firstName);


                // store token in local storage
                if (data.level == true) {
                    console.log('Admin Loged in');
                    router.push('/mainAdmin');
                }
                else if (data.message == 'Connected') {
                    console.log('Connected');
                    // redirect to the login page
                    router.push('/main');
                }
            }
            // if there are errors, set the errors state variable 
            else {
                const data = await response.json();
                setErrors(data.errors || { general: 'Login Failed.' }); 
            }
        } catch (error) {
            console.error('An unexpected error happened:', error);
        }
        // log form data
        // console.log(formData);
    }

// return part
return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
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
                onChange={handleChange}
                required
                />
            </div>

            <div className="flex flex-col items-center justify-center space-y-4"> {/* Changed to flex-col and added space-y-4 */}
                <div className="w-full"> {/* Make the Sign in button full width */}
                    <button 
                    type="submit" 
                    className="primary-btn w-full">
                    Sign in
                    </button>
                </div>
                <div className="flex items-center justify-center space-x-4 w-full"> {/* Make the container full width */}
                    <button
                    type="submit"
                    className="primary-btn w-1/2 h-1/2" // Half width for Register button
                    onClick={() => router.push('/signup')} // Redirect to /signup on click
                    >
                    signup
                    </button>

                    <button
                    type="button" // Change to type="button" to prevent form submission
                    className="secondary-btn w-1/2 h-1/2 opacity-50 cursor-not-allowed" // Half width, disabled appearance
                    disabled // Actually disable the button
                    >
                    Forgot password 
                    </button>
                </div>
                </div>
        </form>
    </div>
)}

