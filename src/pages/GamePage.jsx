import { useEffect, useState, useRef } from "react";
import { Input, Button } from "@nextui-org/react";
import { wordList } from "../js/data";
import { ToastContainer, toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


import "./GamePage.css"
import AnswerTimer from "../component/AnswerTimer";
export default function GamePage() {
    const [gameStart, setGameStart] = useState(false);
    const [input, setInput] = useState("")
    const [currentWord, setCurrentWord] = useState("");
    const [hint, setHint] = useState("");
    const [scrambledWord, setScrambledWord] = useState(null);
    const [timer, setTimer] = useState(20);
    const [revealCount, setRevealCount] = useState(5);
    const [revealedWord, setRevealedWord] = useState(null);
    const [pointCount, setPointCount] = useState(0);
    const [wordPointCount, setWordPointCount] = useState(0);
    const [nextScramble, setNextScramble] = useState(false);
    const [showAnswerTimer, setShowAnswerTimer] = useState(true);
    const clickedRef = useRef(false);

    const navigationHistory = useNavigate();

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        let randomWord = wordList[randomIndex];
        setCurrentWord(randomWord.word)
        setHint(randomWord.hint)
        scrambleWord(randomWord.word, randomWord.hint);
    }

    function scrambleWord(word) {
        let scrambledWord = word.split('').sort(function () { return 0.5 - Math.random() }).join('');
        setScrambledWord(scrambledWord.split(''))
        // console.log("Scrambled word is: " + scrambledWord.split(''))
        setWordPointCount(scrambledWord.split('').length)
        return scrambledWord;
    }
    // console.log("Answer is: " + word)

    function handleStartGame() {
        setGameStart(true);
        clickedRef.current = true;
        getRandomWord()
        setRevealedWord(currentWord)
        // resetTimer() // Reset the timer when starting a new word
        console.log("Revealed word is: " + revealedWord)
    }

    function onTimeUp() {
        handleNext()
        // resetTimer(); // Reset the timer when time is up
        // console.log("timerCounter is: " + timerCounter);
        setPointCount(prevValue => (prevValue <= 0 ? 0 : prevValue - wordPointCount))
        // toast("Time is up!")
    }

    function handleSkip() {
        getRandomWord()
        setPointCount(prevValue => (prevValue <= 0 ? 0 : (prevValue - wordPointCount) / 2))
        handleNext()
    }

    function handleNext() {
        // setRevealedWord(null)
        setShowAnswerTimer(false)
        getRandomWord()
        setInput("")
        setTimeout(() => {
            setShowAnswerTimer(true);
        });
    }

    function handleReveals() {
        setRevealedWord(currentWord)
        if (revealCount === 0) {
            alert("You have no more reveals left!")
            return;
        }
        else if (revealedWord === currentWord) {
            setInput(currentWord);
            console.log("Revealed word is: " + revealedWord)
        } else {
            setRevealCount(prevRevealCount => prevRevealCount - 1)
            setInput(currentWord);
        }
    }

    function handleChange(event) {
        const { value } = event.target
        setInput(value)
    }

    function handleSubmit() {
        if (input === currentWord) {
            setPointCount(prevValue => prevValue + wordPointCount)
            setRevealedWord(null)
            handleNext()
        } else {
            setRevealedWord(null)
        }
    }

    function handleSignout() {
        signOut(auth).then((val) => {
            // Sign-out successful.
            console.log("Signout successful")
            console.log(val, "val")
            navigationHistory('/')
        })
    }


    return (
        <>
            <div className='bg-gradient-to-r from-pink-300 to-blue-500 p-8 w-full h-screen flex justify-center '>
                {console.log("wordPointCount is: " + wordPointCount)}
                <div className='bg-white rounded-lg shadow-2xl flex w-full justify-between '>
                    <div className="w-3/4 px-44 bg-red-200">
                        <h1 className='text-2xl text-center font-bold mb-4'>Guess the word</h1>
                        <div className="flex justify-between mb-2">
                            <p id="hearts">❤️❤️❤️❤️❤️</p>
                            <p id="user-points" className="font-medium">Points: {pointCount}</p>
                        </div>
                        <div className="w-full mb-2 h-4">
                            {showAnswerTimer && <AnswerTimer
                                duration={timer}
                                onTimeUp={onTimeUp}
                                clickedRef={clickedRef}
                                gameStart={gameStart}
                                nextScramble={nextScramble}
                            />}
                            <ToastContainer />
                        </div>
                        <p className="font-medium h-20 bg-yellow-500 p-2 rounded-xl">Hint: <span className="font-normal">{hint}</span></p>
                        <div className="scrambled-word rounded-xl p-2 h-36 my-5">
                            <h2 className="flex justify-center flex-wrap  ">

                                {
                                    scrambledWord && scrambledWord.map((letter, index) => (
                                        <span key={index} className="letter"><i className="letter-count">{index + 1}</i>{letter}</span>
                                    ))
                                }
                            </h2>
                        </div>

                        <div className="mb-5">
                            <Input
                                size="lg"
                                type="text"
                                placeholder="Enter your answer"
                                onChange={handleChange}
                                value={input}
                                isDisabled={!gameStart}
                            />
                        </div>
                        <div className="flex justify-between mb-2">
                            <Button color="warning" className="w-2/5" onClick={handleReveals} isDisabled={!gameStart}>Reveal <span>({revealCount})</span></Button>
                            <Button onClick={handleSkip} color="danger" className="w-2/5" isDisabled={!gameStart}>Skip <span></span></Button>
                        </div>
                        {!gameStart ? <Button onClick={handleStartGame} color="success" className="w-full">Start</Button>
                            : <Button onClick={handleSubmit} color="success" className="w-full">Submit <span></span></Button>}
                        <Button onClick={handleSignout} color="danger" className="w-full">Signout <span></span></Button>

                    </div>
                    <div className="w-1/4 bg-gray-200">
                        <h1 className='text-4xl font-bold mb-4'>Leader board</h1>
                        <p className='text-xl'>Still in development 🚧</p>
                    </div>
                </div>
            </div>
        </>
    )
}
