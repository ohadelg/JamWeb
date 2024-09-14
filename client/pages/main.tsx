import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/waitMessage";
// import { checkAuth } from "@/actions/checkAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { io } from "socket.io-client";
// import { URL_BEGIN } from "../actions/constant";
// import { emit } from "process";
// import exp from "constants";

export let name: string | null = null;
export let tokenID: string | null = null;

// make sure that the window object is defined
if (typeof window !== 'undefined') {
    name = localStorage.getItem('name');
    tokenID = localStorage.getItem('token');
    console.log("Got token: ", tokenID);
}

// // import from the local storage the token and the name
// export const name = localStorage.getItem('name');
// const tokenID = localStorage.getItem('token');

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
        });

        // in case of get message from the server
        socket.on("message", data => {
            console.log("Got 'message', The data: ", data);
        })

        socket.on('quit', () => {
            if (localStorage.getItem('level') == '1'){
                router.push('/mainAdmin');
            } else {router.push('/main');};
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('level');
            socket.disconnect();
            router.push('/login');
        });
    });


    return (
        <div>
            <WaitComponent />
            <LogoutButton />
        </div>
    );
}