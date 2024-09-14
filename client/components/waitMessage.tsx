import React, { useState, useEffect } from 'react';
import { socket } from '../pages/main';
import { SONGS } from '@/actions/constant';
import QuitButton from './quitButton';

export default function WaitComponent() {
  const [message, setMessage] = useState("Hey,\nWelcome to JaMoveo rehearsal sesion.\nWe are waiting for the admin to start the session...\n");
  const [messageLines, setMessageLines]  = useState<string[]>([]);
  // const [theName, setTheName] = useState<string | null>(""); 
  const [songName, setSongName] = useState("");
  const [text_dir, setText_dir] = useState("ltr");
  const isAdmin = localStorage.getItem('level') == '1';
  // setMessageLines(message.split('\n'));

  useEffect(() => {
    // Retrieve name from localStorage once when the component mounts
    // const name = localStorage.getItem('name');
    // if (name != null && name != 'undefined') {setTheName(name);}; 

    // Listen for 'play' event from Socket.IO
    const handlePlay = (data: {song: string, dir: string, display: string }) => {
      const display = data.display;
      const value = data.song.split(': ')[1];
      setSongName(SONGS.find(s => s.value == value)?.name || "");

      setText_dir(data.dir);
      console.log('Song name is: ', songName);
      console.log('The data: ', value);
      setMessage(SONGS.find(s => s.value == value)?.name +"\n" + SONGS.find(s => s.value == value)?.artist +"\n"+ display);
    };

    socket.on('play', (data) => {
        console.log('Got play event');
        handlePlay(data);
      });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('play', handlePlay);
    };
  }, []);

  // Only when the message changes, it will split the message into lines and update the display
  useEffect(() => {
    setMessageLines(message.split('\n'));
  }, [message]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-gray-300 border border-gray-900 text-black-900 px-4 py-3 rounded relative" role="info">
            <p className="font-bold white-space-pre-wrap text-2xl flex items-center justify-center">
              <h1>
              {messageLines[0]}<br />
              </h1>
            </p>
            <p className="font-bold white-space-pre-wrap text-xl flex items-center justify-center">
                {messageLines.length > 0 && messageLines[1]}<br />
            </p>

            <br />
            <p className="font-bold white-space-pre-wrap" dir={text_dir}>
              {messageLines.slice(2).map((line, index) => (
                <React.Fragment key={index}>
                {line.replace(/ /g, '\u00A0\u00A0')}<br />
                </React.Fragment>
              ))}
            </p>
        <div className="mt-auto">
          {isAdmin && <QuitButton />}
        </div>
        </div>
    </div>
  );
}