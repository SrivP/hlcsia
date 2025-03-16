"use client"

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Page() {
    return (
        <>
            <p>ERROR, EITHER UR PASSWORD/EMAIL COMBINATION IS WRONG OR THE USER WITH THAT TITLE ALREADY EXISTS</p>
            <Button variant="default" onClick={() => redirect('/login')}>Return to Login</Button>
        </>
    )
}