import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { socket } from '../pages/mainAdmin';
import { SONGS } from '@/actions/constant';

export default function WaitComponent() {
    const router = useRouter();
    const [song, setSong] = useState<string>("hey_jude");
    // const [title, setTitle] = useState<string>("Choose a song");
    const [tokenID, setTokenID] = useState<string | null>("");
    
    useEffect(() => {
    if (typeof window !== 'undefined') {
        setTokenID(localStorage.getItem('token'));
    }}, []);

    const SongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSong(e.target.value);
    };

    const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit('chooseSong', {token: tokenID, song: song, dir: SONGS.find(s => s.value === song)?.dir});
        router.push('/main');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-gray-300 border border-gray-900 text-black-900 px-4 py-3 rounded relative" role="info">
                {/* <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1> */}
                <form onSubmit={Submit}>
                    <div className="mb-4">
                        <label className = 'label-text-input' htmlFor="song">Songs:</label>
                        <select
                        id="song"
                        name="song"
                        className="text-input"
                        onChange={SongChange}
                        required
                        >
                            {SONGS.map((song) => (
                                <option dir ={song.dir} key={song.value} value={song.value}>{song.name}</option>
                            ))}
                            {/* <option key='Hey Jude' value="hey_jude">Hey Jude</option>
                            <option dir='rtl' key="ואיך שלא" value="veech_shelo">ואיך שלא</option> */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <button
                        type="submit"
                        className="primary-btn w-full text-center"
                        >
                        Choose Song
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};