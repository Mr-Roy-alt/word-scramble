import { useState, useRef, useEffect } from "react";
import { Card, CardBody, Image, Button, Slider } from "@nextui-org/react";
// import { PauseCircleIcon } from "./iconsComponents/PauseCircleIcon";
import { NextIcon } from "./iconsComponents/NextIcon";
import { PreviousIcon } from "./iconsComponents/PreviousIcon";
import { RepeatOneIcon } from "./iconsComponents/RepeatOneIcon";
import { ShuffleIcon } from "./iconsComponents/ShuffleIcon";
import { VolumeHighIcon } from "./iconsComponents/VolumeHighIcon";
import { VolumeLowIcon } from "./iconsComponents/VolumeLowIcon";
import { SoundData } from "../js/sound.js";
import { FiPlay, FiPause } from "react-icons/fi";
import picture from "../assets/Leroy_Profile_Picture_1.png";

//onboarding experience.
import Tour from '../js/tour.js';
// import PropTypes from 'prop-types';

export default function PreferenceCard() {
    const [play, setPlay] = useState(false);
    const [volume, setVolume] = useState(2);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [isRandomAudioActive, setIsRandomAudioActive] = useState(false);
    const [loopMusic, setLoopMusic] = useState(false);
    const [musicProgress, setMusicProgress] = useState(0);
    const audioRef = useRef(null);
    const allowCloseBtn = true

    useEffect(() => {

        const currentAudioRef = audioRef.current

        // setPlay(true);

        // Listen for the 'ended' event and play the next track
        const handleAudioEnd = () => {
            if (isRandomAudioActive) {
                randomAudio()
            } else {
                nextMusic()
            }
        };
        const handleTimeupdate = () => {
            const { currentTime, duration } = currentAudioRef;
            const newProgress = (currentTime / duration) * 100;
            setMusicProgress(newProgress);
        };

        currentAudioRef.addEventListener('ended', handleAudioEnd);
        currentAudioRef.addEventListener('timeupdate', handleTimeupdate);

        // Cleanup the event listeners when the component unmounts
        return () => {
            currentAudioRef.removeEventListener('ended', handleAudioEnd);
            currentAudioRef.addEventListener('timeupdate', handleTimeupdate);
        };
    }, [currentAudioIndex]);

    function randomAudio() {
        const randomIndex = Math.floor(Math.random() * SoundData.length);
        setCurrentAudioIndex(randomIndex);
    }

    function playMusic() {
        if (play) {
            audioRef.current.pause();
            setPlay(false);
        } else {
            audioRef.current.play();
            setPlay(true);
        }
    }

    function nextMusic() {

        if (currentAudioIndex === SoundData.length - 1) {
            setCurrentAudioIndex(0);
        } else {
            setCurrentAudioIndex((currentAudioIndex + 1) % SoundData.length);
        }
    }

    function prevMusic() {
        if (currentAudioIndex === 0) {
            setCurrentAudioIndex(SoundData.length - 1);
            return;
        } else {
            setCurrentAudioIndex((currentAudioIndex - 1) % SoundData.length);
        }
    }

    function handleVolume(value) {
        setVolume(value);
        audioRef.current.volume = value / 100;
    }

    return (
        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
        >
            <div className="hidden">
                <audio ref={audioRef} src={SoundData[currentAudioIndex].src} loop={loopMusic}></audio>
            </div>
            <div
                className="absolute h-full bg-gradient-to-r from-slate-100 to-slate-500 -z-10"
                style={{ width: `${musicProgress}%` }}
            />
            <CardBody>
                <div className="grid grid-cols-12 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                    <div className="relative flex flex-col gap-6 col-span-4 md:col-span-4">
                        {/* {Image or menu can go here too} */}
                        <Button onClick={() => Tour(allowCloseBtn)} size="sm" className="block font-medium">
                            Tutorial
                        </Button>
                        <Button size="sm" className="block font-medium">
                            Game History
                        </Button>
                        <Button size="sm" className="block font-medium">
                            My Profile
                        </Button>
                    </div>

                    <div className="flex flex-col col-span-8 md:col-span-6">
                        <div className="flex justify-between gap-0 items-start">
                            <div className="flex flex-col gap-0">
                                <h3 className="font-semibold text-foreground/90 truncate overflow-hidden">{SoundData[currentAudioIndex].name}</h3>
                                <p className="text-small text-foreground/80">{`${currentAudioIndex + 1} out of ${SoundData.length} Tracks`}</p>
                                {/* <h1 className="text-large font-medium mt-2">Frontend Radio</h1> */}
                            </div>
                            <Button
                                isIconOnly
                                className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-1 translate-x-1"
                                radius="full"
                                variant="light"
                            >
                                <Image
                                    alt="Album cover"
                                    className="object-cover"
                                    height={200}
                                    shadow="md"
                                    src={`${picture}`}
                                    width="100%"
                                />
                            </Button>
                        </div>

                        <div className="flex mt-3 items-center gap-1">
                            <Slider
                                aria-label="Volume"
                                size="sm"
                                color="success"
                                startContent={<VolumeLowIcon className="text-2xl" />}
                                endContent={<VolumeHighIcon className="text-2xl" />}
                                className="max-w-md"
                                value={volume}
                                onChange={handleVolume}
                            />
                        </div>

                        <div className="flex w-full items-center justify-center">
                            <Button
                                isIconOnly
                                className={`data-[hover]:bg-foreground/10 `}
                                radius="full"
                                variant="light"
                                onClick={() => setLoopMusic(!loopMusic)}
                            >
                                <RepeatOneIcon className={`${loopMusic ? "text-gray-950" : "text-foreground/60"}`} />
                            </Button>
                            <Button
                                isIconOnly
                                className="data-[hover]:bg-foreground/10"
                                radius="full"
                                variant="light"
                                onClick={prevMusic}

                            >
                                <PreviousIcon />
                            </Button>
                            <Button
                                onClick={playMusic}
                                isIconOnly
                                className="w-auto h-auto data-[hover]:bg-foreground/10 p-2"
                                radius="full"
                                variant="light"
                            >
                                {!play ? <FiPlay size={35} /> : <FiPause size={35} />}
                            </Button>
                            <Button
                                isIconOnly
                                className="data-[hover]:bg-foreground/10"
                                radius="full"
                                variant="light"
                                onClick={nextMusic}
                            >
                                <NextIcon />
                            </Button>
                            <Button
                                isIconOnly
                                onClick={() => setIsRandomAudioActive(!isRandomAudioActive)}
                                className="data-[hover]:bg-foreground/10"
                                radius="full"
                                variant="light"
                            >
                                <ShuffleIcon className={`${isRandomAudioActive ? "text-gray-950" : "text-foreground/60"}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
