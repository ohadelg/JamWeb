import { PROD_URL } from "@/actions/constant";
import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/chooseSong";
// import { useRouter } from "next/router";
import { useEffect } from "react";
import { io } from "socket.io-client";
// import { PROD_URL } from "@/actions/constant";

export let name: string | null = null;
export let tokenID: string | null = null;

  // make sure that the window object is defined
if (typeof window !== 'undefined') {
    name = localStorage.getItem('name');
    tokenID = localStorage.getItem('token');
    console.log("Got token: ", tokenID);
}

export const socket = io(PROD_URL, {
    auth: {'token': tokenID},
    transports: ['websocket', 'polling', 'webtransport']
});



export default function Main() {
    // connect to the server
    socket.connect();
    
    useEffect(() => {
        const newToken = localStorage.getItem('token');
        tokenID = newToken;
    }, []);

    useEffect(() => {
        socket.auth = { token: tokenID };
    }, [tokenID]);
    // create a router object
    // const router = useRouter();

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