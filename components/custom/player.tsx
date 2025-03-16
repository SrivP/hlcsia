import { useEffect, useRef, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Button } from "../ui/button";




export default function Player() {
    const [playing, setPlaying] = useState(false);
    const [track, setTrack] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (playing) {
                audioRef.current.play();
            }
        }
    }, [track])


    let tracks = [
        {title : "Track 1", src : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
        {title : "Track 2", src : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
        {title : "Track 3", src : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
    ]

    function togglePlay(tracknum : number ) {
        
        if (tracknum == track) {
            
        
        if (playing && audioRef.current) {
            audioRef.current.pause();
        } else if (audioRef.current) {
            audioRef.current.play();
        }
    } else {
        setTrack(tracknum);
        setPlaying(true);
    }
    }

    return (
        <>
        <audio 
        ref={audioRef} 
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={tracks[track].src} type="audio/mpeg" />
      </audio>
        <Carousel className="fixed bottom-[3vh] right-15">
                <CarouselContent>
                    <CarouselItem>
                        <Card>
                            <CardContent className="flex w-1px h-1px rounded-max items-center justify-center">
                                <Button variant="link" onClick={() => togglePlay(0)}>🌧️</Button>        
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                        <Card>
                            <CardContent className="flex w-1px h-1px rounded-max items-center justify-center">
                                <Button variant="link" onClick={() => togglePlay(1)}>🎧</Button>      
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                        <Card>
                            <CardContent className="flex w-1px h-1px rounded-max items-center justify-center">
                                <Button variant="link" onClick={() => togglePlay(2)}>🤖</Button>       
                            </CardContent>
                        </Card>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            </>
    )
}