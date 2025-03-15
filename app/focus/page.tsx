"use client"
import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/custom/sidebar';
import Image from 'next/image';
import cat from '@/public/cat.png'
import { Button } from '@/components/ui/button';
import { supabase } from "../api/supabase";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { min } from 'date-fns';


  

export default function Page() {
    const [time, setTime] = useState(1500);
    const [initTime, setInitTime] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [running, setRunning] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [variant, setVariant] = useState<"default" | "secondary"| "destructive">("default");
    const [created_at, setCreated_at] = useState<Date>();
    const [user_id, setUser_id] = useState<string | null>();

    
    useEffect(() => {
        let countdown: NodeJS.Timeout | undefined;
        if (running) {
          countdown = setInterval(() => {
            setTime((prev) => {
              if (prev <= 1) {
                clearInterval(countdown);
                setRunning(false);
                if (audioRef.current) {
                  audioRef.current.play();
                }
                toast("Good Job!!") 
                setVariant("default");
                setTime(0);
                setMinutes(0);
                setSeconds(0);
                console.log("This is initTime" + initTime)
                updateTime(initTime, "8a06959d-477f-45a0-bd87-f9191618de99");
                

              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => {
            if (countdown) {
              clearInterval(countdown);
            }
          };
        }, [running]);
        
    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`    
    }

    // rewrite this function
    function handleStop() {
        setRunning(false);
        setVariant("default");
        console.log("This is initTime" + (initTime-time))
        setInitTime((prevInitTime) => {
            const timeTracked = prevInitTime - time;
            console.log("Time tracked:", timeTracked);
            updateTime(timeTracked, user_id!); // Make sure user_id is available
            return prevInitTime; // No need to reset initTime to time after stopping
        });
    }

    function handleStart() {
        setRunning(true);
        setVariant("destructive");
        setInitTime(time)
    }
    function handleTime() {
      let minute2 = minutes;
      let second2 = seconds;
      let time2 = minute2 * 60 + second2;
      let timeCheck = minutes * 60 + seconds;
        if (timeCheck <= 0) {
            toast("Please set a valid time 🕰️");
            console.log("Everything you need boss" + seconds, minutes, time)
            return;
        } else {
            setTime(time2);
            

            
        }
    }

    async function updateTime(seconds : number, user_id : string) {
        const response = await fetch('/api/timeData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seconds,
            created_at: new Date().toISOString(),
            user_id, 
          })
        })
    
        if (response.ok) {
          console.log('Task updated successfully + seconds: ' + seconds);
        } else {
          const errorData = await response.json();
          console.error('Error updating task:', errorData.error);
        }
      }
    return(
        <>
            <Sidebar />
            <div className="grid place-items-center h-screen">
                <Image
                    src={cat} 
                    width={125}
                    height={125}
                    alt="Picture of the author"
                    className="translate-y-[0%]"
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost"className='pt-1 text-3xl font-mono font-medium w-36 h-12 translate-y-[-310%] hover:bg-gray-100 duration-50 ease-in rounded-sm'>{formatTime(time)}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Set Time</h4>
                            <p className="text-sm text-muted-foreground">
                            Set the amount of time you'd like to focus for (in seconds).
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="minutes">Minutes</Label>
                            <Input
                                id="minutes"
                                placeholder="25"
                                className="col-span-2 h-8"
                                onChange={(e) => setMinutes(parseInt(e.target.value))} 
                            />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="seconds">Seconds</Label>
                            <Input
                                id="seconds"
                                placeholder="00"
                                className="col-span-2 h-8"
                                onChange={(e) => {
                                  setSeconds(parseInt(e.target.value))
                                }}
                            />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                            <Button onClick={handleTime} className="col-span-2">Submit</Button>
                            </div>
                            
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Button className="translate-y-[-850%] w-36 rounded-xl" variant={variant} onClick={running ? handleStop : handleStart}>{running ? "Stop" : "Start"}</Button>
            </div>
        </>
    )
}