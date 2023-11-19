import { useEffect, useState, useRef } from 'react'
import { Progress } from "@nextui-org/react";
import propTypes from 'prop-types'

export default function AnswerTimer({ duration, onTimeUp, gameStart, clickedRef, nextScramble }) {
    const [counter, setCounter] = useState(0);
    const [progressLoaded, setProgressLoaded] = useState(0);
    const [started, setStarted] = useState(clickedRef.current);
    const intervalRef = useRef(null);

    useEffect(() => {
        console.log("Progressloaded is:", progressLoaded);
        console.log("counter is:", counter);


        if (!gameStart) {
            setCounter(0);
            setProgressLoaded(0);
            setStarted(false);
        }

        if (gameStart) {
            setStarted(true);
        }

        if (gameStart && started) {
            intervalRef.current = setInterval(() => {
                setCounter((counter) => counter + 1);
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [gameStart, started]);

    useEffect(() => {
        setProgressLoaded((counter / duration) * 100);
        if (counter === duration) {
            clearInterval(intervalRef.current);
            setTimeout(() => {
                onTimeUp();
                console.log("Time is up!");
            }, 1000);
        }
    }, [counter, gameStart]);

    return (
        <div>
            <Progress
                size="md"
                radius="sm"
                classNames={{
                    base: "w-full",
                    track: "shadow border border-default bg-slate-100",
                    indicator: `${progressLoaded < 40
                        ? "bg-success-500"
                        : progressLoaded < 70
                            ? "bg-yellow-500"
                            : "bg-red-500"} `,
                    label: "tracking-wider font-medium text-default-800",
                }}
                value={progressLoaded}
            />
        </div>
    );
}



AnswerTimer.propTypes = {
    duration: propTypes.number.isRequired,
    onTimeUp: propTypes.func.isRequired,
    gameStart: propTypes.bool.isRequired,
    clickedRef: propTypes.object.isRequired,
    nextScramble: propTypes.bool.isRequired,
}