// This module is created on the client side to check if the user is authenticated.

// import { redirect } from "next/dist/server/api-utils"
import { PORT, WEB_PROTOCOL, ADDRESS } from "./constant"

export async function checkAuth() {
    try{
        const response = await fetch(WEB_PROTOCOL + ADDRESS + ':' + PORT +'/api/authCheck', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
        })

        if (response.status === 200) {
            return true
        } else {
            // in case that not authenticated, redirect to login page
            return false
            }
    } catch (error) {
        console.error('Error checking authentication', error)
    }
}