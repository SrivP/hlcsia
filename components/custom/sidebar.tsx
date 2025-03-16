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

export default function sidebar() {
    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="border-white">
                    <Avatar className="m-3 size-11">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="justify-center text-center">
                        <Button variant="link" onClick={signOut}><LogOut/></Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <nav className="fixed flex flex-row min-w-screen bottom-[3vh] left-1 justify-start">   
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/focus">Focus</Link>
                </Button>
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/tasks">Tasks</Link>
                </Button>
                <Button variant="link" className="text-md color text-gray-500 font-sm font-mono">
                    <Link href="/stats">Stats</Link>
                </Button>
            </nav>
            <Player />

        
        </>
    )
}