import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import { signOut } from "@/app/login/action"
import Player from "./player";
import router from "next/router";
import { useState } from "react";

export default function sidebar() {
    const [loading, setLoading] = useState(false);


    async function handleSignout() {
        console.log("Buton pressed!!")
        setLoading(true);
        await signOut()
        localStorage.removeItem('auth_token'); 
        sessionStorage.removeItem('auth_token');
        window.location.reload();
        router.push('/login')

        
        
        
         
    }

    return(
        <>
        {loading && (
        <div className="w-full h-full fixed bg-black z-50">
            <p className="text-white text-center">SIGNING YOU OUT...</p>
        </div>
    )}
        <div>
            
        
            <DropdownMenu>
                <DropdownMenuTrigger className="border-white">
                    <Avatar className="m-3 size-11 -z-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="justify-center text-center">
                        <Button variant="link" onClick={handleSignout}><LogOut/></Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <nav className="fixed flex flex-row min-w-screen bottom-[3vh] left-1 justify-start">   
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/focus" onClick={() => router.push('/focus')}>Focus</Link>
                </Button>
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/tasks" onClick={() => router.push('/tasks')}>Tasks</Link>
                </Button>
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/stats" onClick={() => router.push('/stats')}>Stats</Link>
                </Button>
            </nav> 
            <Player />   
            </div> 
            </>
    )
}