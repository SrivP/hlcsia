import { Button } from "@/components/ui/button";
import router from "next/router";

export default function Page() {
    return (
        <>
            <p>ERROR, EITHER UR PASSWORD/EMAIL COMBINATION IS WRONG OR THE USER WITH THAT TITLE ALREADY EXISTS</p>
            <Button variant="default" onClick={() => router.push('/login')}>Return to Login</Button>
        </>
    )
}