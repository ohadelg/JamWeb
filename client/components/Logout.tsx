'use client'

import { useRouter } from 'next/router'
// import { URL_BEGIN } from '@/actions/constant'
import { socket } from '@/pages/main'

export default function LogoutButton() {
    const router = useRouter()
    const handleLogout = () => {

        socket.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('level')
        console.log('Disconnected Socket')
        router.push('/login')
    }

    return (
        <div className="absolute top-0 right-0 mt-5 mr-5"> {/* Align to the left */}
            <div className="mt-4"> {/* Grow to fill the space */}
                <button onClick={handleLogout} className="absolute top-0 right-0 mt-5 mr-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
                </button>
            </div>
        </div>
    )
}