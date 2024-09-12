import CreateLoginForm from '@/components/LoginForm'
// import { io } from 'socket.io-client';
// import { useRouter } from 'next/router';
// import { ServerToClientEvents, ClientToServerEvents } from "../../typing"
// const io = require('socket.io-client');
// export const socket = io(); // Add URL to connect the server

export default function Login() {
    return (
        // create a form with input fields for first name, last name, email, password, and confirm password
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <CreateLoginForm></CreateLoginForm>
        </div>
    )
}