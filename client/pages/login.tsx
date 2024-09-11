import CreateLoginForm from '@/components/LoginForm'

export default function Login() {
    return (
        // create a form with input fields for first name, last name, email, password, and confirm password
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <CreateLoginForm></CreateLoginForm>
        </div>
    )
}