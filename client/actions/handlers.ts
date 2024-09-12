import React, {useEffect} from 'react';
import { io } from 'socket.io-client';


export function useSocket() {
  useEffect(() => {
    // set socket.io-client to connect to the server
    const socket = io('http://localhost:3000', {
      transports: ['websocket']
    }); 

    // listen for connection
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // listen for disconnected
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('message', (data) => {
        console.log("Got Message, data:", data);
    });

    // loged in successfully
    socket.on('logged in', (data) => {
      console.log('Logged in successfully', data);
    });

    // listen for 
    socket.on('registered', (data) => {
        console.log('Registered successfully', data);
    });

    // listen for player joined
    socket.on('player joined', (data) => {
        console.log('Player joined', data);
    });

    // 'else' disconnect from the server
    return () => {
        console.log('Disconnecting from server');
      socket.disconnect();
    };
  }, []);
}







