import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/waitMessage";
// import { checkAuth } from "@/actions/checkAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import io from "socket.io-client";
// import { URL_BEGIN } from "../actions/constant";
// import { emit } from "process";
// import exp from "constants";

// export let name: string | null = null;
// export let tokenID: string | null = null;

// // make sure that the window object is defined
// // if (typeof window !== 'undefined') {
// //     name = localStorage.getItem('name');
// //     tokenID = localStorage.getItem('token');
// //     console.log("Got token: ", tokenID);
// // }

// // // import from the local storage the token and the name
// // export const name = localStorage.getItem('name');
// // const tokenID = localStorage.getItem('token');


let tokenID: string | null = null;

export const socket = io('http://localhost:8080', {
    auth: {'token': tokenID},
    transports: ['websocket', 'polling', 'webtransport']
});

export default function Main() {
    // const [tokenID, setTokenID] = useState<string|null>(null);
   
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const newToken = localStorage.getItem('token') || null;
                console.log("Got token: ", newToken);
                tokenID = newToken;
                socket.auth = { 'token': tokenID };
                // setTokenID(newToken);
                // tokenID = newToken;
                console.log('socket set token: ', tokenID);
            }
        } catch (error) {
            console.log('Error: ', error, ' in setting token disconnecting...');
            socket.disconnect();
            router.push('/login');
        }
    }, []);
    
    // connect to the server   
    socket.connect();

    // create a router object
    const router = useRouter();

    useEffect(() => {
        // in case of get start message from the server
        socket.on('error', (errorData)=> {
            console.log('Error Recieved: ', errorData);
            if (errorData.message == 'User not found') {
                console.log('User not found, disconnecting...');
                router.push('/login');
                socket.disconnect();
            }
        });

        // in case of get message from the server
        socket.on("message", data => {
            console.log("Got 'message', The data: ", data);
            console.log("tokem recieved: ", data.token);
            socket.auth = { token: data.token };
        })

        socket.on('quit', () => {
            if (typeof window !== 'undefined') {
                const level = localStorage.getItem('level') || '0';
                if (level === '1') {
                    router.push('/mainAdmin');
                } else {router.push('/main');};
            } else { router.push('/login');};
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
            // if (typeof window !== 'undefined') {
            //     localStorage.removeItem('token');
            //     localStorage.removeItem('name');
            //     localStorage.removeItem('level');
            // }
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