'use client'

import { useRouter } from 'next/router'
// import { useEffect } from 'react'

export default function LogoutButton() {
    const router = useRouter()
    const handleLogout = () => {
        fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(() => router.push('/login'))
        .catch((error) => console.error(error))
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