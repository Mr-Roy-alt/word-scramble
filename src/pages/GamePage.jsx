import { useEffect, useState, useRef } from "react";
import { Input, Button, Chip } from "@nextui-org/react";
import { wordList } from "../js/data";
import { ToastContainer, toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import { setDoc, doc, getDocs, collection } from 'firebase/firestore';
import { auth, db, } from '../firebaseConfig';
import LeaderBoard from "../component/LeaderBoard";
import CardBoard from "../component/CardBoard";
import { useNavigate } from 'react-router-dom';
// import { nanoid } from 'nanoid';
import 'react-toastify/dist/ReactToastify.css';


import "./GamePage.css"
import AnswerTimer from "../component/AnswerTimer";
import ScreenSizeWarning from "../component/ScreenSizeWarning";
export default function GamePage() {
    const [gameStart, setGameStart] = useState(false);
    const [input, setInput] = useState("")
    const [currentWord, setCurrentWord] = useState("");
    const [hint, setHint] = useState("");
    const [scrambledWord, setScrambledWord] = useState(null);
    const [timer, setTimer] = useState(20);
    const [timerCounter, setTimerCounter] = useState(0);
    const [revealCount, setRevealCount] = useState(5);
    const [revealedWord, setRevealedWord] = useState(null);
    const [pointCount, setPointCount] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [wordPointCount, setWordPointCount] = useState(0);
    const [nextScramble, setNextScramble] = useState(false);
    const [showAnswerTimer, setShowAnswerTimer] = useState(true);
    const [heartCount, setHeartCount] = useState(["❤️", "❤️", "❤️", "❤️", "❤️"]);
    const [userStatus, setUserStatus] = useState("Offline");
    const clickedRef = useRef(false);
    const userName = auth.currentUser.displayName;
    // const nanoidRef = useRef(nanoid());
    // console.log("nanoidRef is: " + nanoidRef.current)

    const navigationHistory = useNavigate();

    // console.log(auth.currentUser)

    useEffect(() => {
        if (auth.currentUser.uid) {
            setUserStatus("Online")
            // db.collection("leaderboard").where("uuid", "==", auth.currentUser.uid)
            const docRef = getDocs(collection(db, "leaderboard"))
            docRef.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().uuid === auth.currentUser.uid) {
                        setHighScore(doc.data().highestScore)
                    }
                })
            })
        } else {
            setUserStatus("Offline")
        }
    }, [userStatus])

    async function submitScore() {
        try {
            const docRef = await setDoc(doc(db, "leaderboard", auth.currentUser.uid), {
                uuid: auth.currentUser.uid,
                userName: userName,
                score: pointCount,
                highestScore: pointCount >= highScore ? pointCount : highScore,
                status: userStatus,
            })
            // console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

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
        setHeartCount(["❤️", "❤️", "❤️", "❤️", "❤️"])
        // resetTimer() // Reset the timer when starting a new word
        // console.log("Revealed word is: " + revealedWord)
    }

    function onTimeUp() {
        endGame()
        handleNext()
        setHeartCount(prevHeartCount => prevHeartCount.slice(0, -1))
        // resetTimer(); // Reset the timer when time is up
        // console.log("timerCounter is: " + timerCounter);
        setPointCount(prevValue => (prevValue <= 0 ? 0 : prevValue - wordPointCount))
        // toast("Time is up!")
    }

    function handleSkip() {
        endGame()
        setHeartCount(prevHeartCount => prevHeartCount.slice(0, -1))
        console.log("Heart count is: " + heartCount.length)
        setPointCount(prevValue => (prevValue <= 0 ? 0 : prevValue - wordPointCount))
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
            // console.log("Revealed word is: " + revealedWord)
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
        if (input.toLocaleLowerCase() === currentWord) {
            setPointCount(prevValue => prevValue + wordPointCount)
            setRevealedWord(null)
            handleNext()
        } else {
            setRevealedWord(null)
        }
    }

    function handleSignout() {
        if (window.confirm("Are you sure you want to Sign out?")) {
            signOut(auth).then(() => {
                // Sign-out successful.
                setGameStart(false);
                setUserStatus("Offline")
                console.log("Signout successful")
                // console.log(val, "val")
                navigationHistory('/')
            })
        }
    }

    // function pauseGame() {
    //     // setNextScramble(false);
    //     setGameStart(false);
    // }

    function handleEndGame() {
        setGameStart(false);
        submitScore()
        console.log("Game ended")
    }

    function endGame() {
        if (heartCount.length === 0) {
            setGameStart(false);
            submitScore()
            setHeartCount([])
            console.log("Game ended")
        }
    }


    return (
        <>
            <div className='sm:flex md:hidden lg:hidden xl:hidden 2xl:hidden bg-gradient-to-r from-gray-600 to-gray-700 p-8 w-full h-screen flex justify-center items-center'>
                <ScreenSizeWarning userName={userName} />
            </div>
            <div className='sm:hidden md:hidden lg:flex bg-gradient-to-r from-gray-600 to-gray-700 p-8 w-full h-full xl:h-screen flex justify-center '>
                {/* {console.log("wordPointCount is: " + wordPointCount)} */}
                <div className='rounded-lg  flex w-full justify-evenly gap-2'>
                    <div className="w-3/5 px-32 bg-slate-50 rounded-2xl shadow-2xl">
                        <h1 className='text-2xl text-center font-bold mb-4'>Guess the word</h1>
                        <div className="flex justify-between mb-2">
                            <p id="hearts">
                                {heartCount.length === 0 ? <span>❤️(0)</span> :
                                    heartCount.map((heart, index) => (
                                        <span key={index} className="heart">{heart}</span>
                                    ))
                                }
                            </p>
                            <p id="user-points" className="font-medium">Points: {pointCount}</p>
                        </div>
                        <div className="w-full mb-2 h-4">
                            {showAnswerTimer && <AnswerTimer
                                duration={timer}
                                onTimeUp={onTimeUp}
                                clickedRef={clickedRef}
                                gameStart={gameStart}
                                nextScramble={nextScramble}
                                timerCounter={timerCounter}
                            />}
                            <ToastContainer />
                        </div>
                        <div className="h-20 bg-yellow-500 p-2 rounded-xl overflow-x-hidden overflow-y-auto">
                            <p className="font-medium ">Hint: <span className="font-normal">{hint}</span></p>
                        </div>

                        <div className="scrambled-word shadow rounded-xl p-2 h-36 my-5">
                            <h2 className="flex justify-center flex-wrap  ">

                                {
                                    scrambledWord && scrambledWord.map((letter, index) => (
                                        <span key={index} className="letter"><i className="letter-count">{index + 1}</i>{letter}</span>
                                    ))
                                }
                            </h2>
                        </div>

                        <div className="mb-5  ">
                            <Input
                                size="sm"
                                className="
                                    rounded-xl
                                    shadow-md
                                    placeholder:italic
                                    placeholder:text-slate-400
                                "
                                type="text"
                                placeholder="Enter your answer"
                                onChange={handleChange}
                                value={input}
                                isDisabled={!gameStart}
                            />
                        </div>
                        <div className="flex justify-between mb-2">
                            <Button color="warning" className="w-2/5" onClick={handleReveals} isDisabled={!gameStart}>Reveal <span>({revealCount})</span></Button>
                            <Button onClick={handleSkip} color="danger" className="w-2/5" isDisabled={!gameStart || heartCount.length === 0}>Skip <span></span></Button>
                        </div>
                        {!gameStart ? <Button onClick={handleStartGame} color="success" className="w-full mb-2">Start</Button>
                            : <Button onClick={handleSubmit} color="success" className="w-full mb-2">Submit <span></span></Button>}
                        <div className="flex justify-between mb-2">
                            <Button onClick={handleEndGame} color="danger" className="w-full" isDisabled={!gameStart}>End Game <span></span></Button>

                        </div>


                    </div>
                    <div className="px-4 bg-slate-300 flex flex-col items-center rounded-2xl shadow-2xl">
                        <h1 className='text-2xl font-bold mb-2'>Leader board</h1>
                        <div className="mb-2">
                            <LeaderBoard />
                        </div>
                        <h1 className='text-2xl font-bold mb-2'>Preference</h1>
                        <div className="mb-4">
                            <CardBoard />
                        </div>
                        <div className="w-full">
                            <Button onClick={handleSignout} color="danger" className="font-semibold block w-full"><span></span>Signout </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
