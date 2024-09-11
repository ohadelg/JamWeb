import React, { useState, useEffect } from 'react';

export default function WaitComponent() {
  const [message, setMessage] = useState("Waiting for the admin to start the session...");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data === 'start') {
        setMessage("Session started! Let's play...");
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-gray-300 border border-gray-900 text-black-900 px-4 py-3 rounded relative" role="info">
            <p className="font-bold">{message}</p>
        </div>
    </div>
  );
}