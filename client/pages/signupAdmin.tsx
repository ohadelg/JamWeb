import CreateRegestryForm from '../components/RegistryForm';

// Create register page with first name, last name, email, password, and confirm password fields.
export default function Signup() {
    return (
        // create a form with input fields for first name, last name, email, password, and confirm password
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <CreateRegestryForm reqType="signupA"></CreateRegestryForm>
        </div>
    );
}