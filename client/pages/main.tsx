import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/waitMessage";
import { checkAuth } from "@/actions/checkAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { URL_BEGIN } from "../actions/constant";
import { emit } from "process";

// import from the local storage the token and the name
export const name = localStorage.getItem('name');
const tokenID = localStorage.getItem('token');


console.log("Got token: ", tokenID);
export const socket = io('http://localhost:8080', {
    auth: {'token': tokenID},
    transports: ['websocket', 'polling', 'webtransport']
});


// socket.on('connect', (tokenID) => {console.log('Connected to the server')});

export default function Main() {
    // set in component the saved token
    // socket.auth = {'token': tokenID};
    socket.connect();
    // socket.on('connect', (tokenID) => {console.log('Connected to the server ', tokenID)});

    // create a router object
    const router = useRouter();

    useEffect(() => {
        // in case of get start message from the server
        socket.on('error', (errorData)=> {
            console.log('Error: ', errorData);
        });

        socket.on('start', () => {
            console.log('Session started! Let\'s play...');
        });

        // in case of get stop message from the server
        socket.on("stop", () => {
            console.log("Disconnected from the server");
        });

        // in case of get message from the server
        socket.on("message", data => {
            console.log("Got 'message', The data: ", data);
        })
    });

        
    // }, []);

    // checkAuth()
        //     .then((response) => {
        //         if (response == false) {
        //             router.push('/login');
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("CheckAuth got error: error");
        //         router.push('/login');
        //     });

    return (
        <div>
            <WaitComponent />
            <LogoutButton />
        </div>
    );
}