'use client'

// import { useRouter } from 'next/router'
// import { URL_BEGIN } from '@/actions/constant'
import { socket } from '@/app/main'

export default function quitButton() {
    // const router = useRouter()
    const handleQuit = () => {
        socket.emit('quit');
    }

    return (
            <div className="flex items-center mt-4 justify-center rounded-2xl"> {/* Grow to fill the space */}
                <button onClick={handleQuit} className="primary-btn  rounded-2xl w-full">
                Quit Session
                </button>
            </div>
    )
}