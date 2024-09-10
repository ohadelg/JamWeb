// Create register page with first name, last name, email, password, and confirm password fields.
export default function Register() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
                <form>
                <div className="mb-4">
                    <label htmlFor="firstName" className="label-text-input">
                    First Name:
                    </label>
                    <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    className="text-input" 
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
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button 
                    type="submit" 
                    className="primary-btn"
                    >
                    Register
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}

// Create a form with the following fields: first name, last name, email, password, and confirm password.


// Create a submit button.


// Create a function to handle form submission.
