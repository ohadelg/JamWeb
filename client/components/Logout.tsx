'use client'

import { useRouter } from 'next/router'
import { URL_BEGIN } from '@/actions/constant'
import handlers from '@actions/handlers'
import { socket } from '@/pages/main'

export default function LogoutButton() {
    const router = useRouter()
    const handleLogout = () => {
        
        // fetch('URL_BEGIN+/api/logout', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: 'disconnect'
        // })
        // .then(() => router.push('/login'))
        // .catch((error) => console.error(error))
        socket.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('level')
        console.log('Disconnected Socket')
        router.push('/login')
    }

    // useEffect(() => {
    //     fetch('/api/logout', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         credentials: 'include'
    //     })
    //     .then(() => router.push('/'))
    //     .catch((error) => console.error(error))
    // }, [])

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