import LogoutButton from "@/components/Logout";
import WaitComponent from "@/components/waitMessage";
import { checkAuth } from "@/actions/checkAuth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Main() {
    const router = useRouter();

    useEffect(() => {
        checkAuth()
            .then((response) => {
                if (response == false) {
                    router.push('/login');
                }
            })
            .catch((error) => {
                console.error(error);
                router.push('/login');
            });
    }, []);

    return (
        <div>
            <WaitComponent />
            <LogoutButton />
        </div>
    );
}