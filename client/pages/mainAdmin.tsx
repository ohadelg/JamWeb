import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/chooseSong";
import { checkAuth } from "@/actions/checkAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { URL_BEGIN } from "../actions/constant";
import { emit } from "process";
import exp from "constants";

export let name: string | null = null;
export let tokenID: string | null = null;

// make sure that the window object is defined
if (typeof window !== 'undefined') {
    name = localStorage.getItem('name');
    tokenID = localStorage.getItem('token');
    console.log("Got token: ", tokenID);
}

export const socket = io('http://localhost:8080', {
    auth: {'token': tokenID},
    transports: ['websocket', 'polling', 'webtransport']
});



export default function Main() {
    socket.connect();

    // create a router object
    const router = useRouter();

    useEffect(() => {
        // in case of get start message from the server
        socket.on('error', (errorData)=> {
            console.log('Error: ', errorData);
            socket.disconnect();
        });

        // socket.on('songRecieved', data => {
        //     console.log('Server ack for recieveing song: ');
        //     router.push('/main');
        // })

        // in case of get message from the server
        socket.on("message", data => {
            console.log("Got 'message', The data: ", data);
        })
    });

    return (
        <div>
            <WaitComponent />
            <LogoutButton />
        </div>
    );
}