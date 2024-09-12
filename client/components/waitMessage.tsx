import React, { useState, useEffect } from 'react';
import { socket } from '../pages/main';

export default function WaitComponent() {
  const [message, setMessage] = useState("Welcome to JaMoveo rehearsal sesion.\nWe are waiting for the admin to start the session...\n");
  const [theName, setTheName] = useState<string | null>(""); 

  useEffect(() => {
    // Retrieve name from localStorage once when the component mounts
    const name = localStorage.getItem('name');
    if (name != null && name != 'undefined') {
    setTheName(name);}; 

    // Listen for 'play' event from Socket.IO
    const handlePlay = () => {
      setMessage("Session started! Let's play...");
    };
    socket.on('play', handlePlay);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('play', handlePlay);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-gray-300 border border-gray-900 text-black-900 px-4 py-3 rounded relative" role="info">
            <p className="font-bold">
              Hi {theName}, <br />
              {message}
              </p>
        </div>
    </div>
  );
}