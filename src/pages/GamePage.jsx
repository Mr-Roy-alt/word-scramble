import { useEffect, useState, useRef } from "react";
import { Input, Button } from "@nextui-org/react";
import { wordList } from "../js/data";
import { ToastContainer, toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc} from 'firebase/firestore';
import { auth, db, } from '../firebaseConfig';
import LeaderBoard from "../component/LeaderBoard";
import CardBoard from "../component/PreferenceCard";
import { useNavigate } from 'react-router-dom';
// import { nanoid } from 'nanoid';
import 'react-toastify/dist/ReactToastify.css';

//onboarding experience.
import Tour from '../js/tour.js';


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
    const [userDataExists, setUserDataExists] = useState(false);
    const [isFirstGame, setIsFirstGame] = useState(null);
    const clickedRef = useRef(false);
    const DOMloadedRef = useRef(false);
    const userName = auth.currentUser.displayName;
    const allowCloseBtn = false;
    const navigationHistory = useNavigate();


    useEffect(() => {

        if (DOMloadedRef.current) {
            if (isFirstGame && userDataExists) {
                Tour(allowCloseBtn)
            }
        }


    }, [DOMloadedRef.current, userDataExists, isFirstGame]);



    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser && auth.currentUser.uid) {
                const docRef = doc(db, "leaderboard", auth.currentUser.uid);

                try {
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // User data exists, fetch and update state
                        const userData = docSnap.data();
                        setHighScore(userData.highestScore);
                        setIsFirstGame(userData.isFirstGame);
                        setUserDataExists(true);

                        // Update status to "Online"
                        await updateDoc(docRef, { status: "Online", userName: userName, isOnline: true, });
                    } else {
                        // User data doesn't exist, create a new document
                        await setDoc(docRef, {
                            uuid: auth.currentUser.uid,
                            userName: userName,
                            score: 0,
                            highestScore: 0,
                            status: "Online",
                            isFirstGame: true,
                            isOnline: true,
                        });
                        // Now setHighScore to the initial value
                        setHighScore(0);
                        setUserDataExists(true);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();

        DOMloadedRef.current = true;

        return () => {
            // Cleanup
        };
    }, [isFirstGame, userName]);


    async function submitScore() {
        try {
            const docRef = doc(db, "leaderboard", auth.currentUser.uid);

            await updateDoc(docRef, {
                status: "Online",
                score: pointCount,
                highestScore: highScore,
                isFirstGame: false,
                isOnline: true,
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error("Error adding document: ", error, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            })
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
        setWordPointCount(scrambledWord.split('').length)
        return scrambledWord;
    }

    function handleStartGame() {
        setGameStart(true);
        clickedRef.current = true;
        getRandomWord()
        setRevealedWord(currentWord)
        setHeartCount(["❤️", "❤️", "❤️", "❤️", "❤️"])
        setRevealCount(5)
    }

    function onTimeUp() {
        endGame()
        handleNext()
        setHeartCount(prevHeartCount => prevHeartCount.slice(0, -1))
        setPointCount(prevValue => (prevValue <= 0 ? 0 : prevValue - wordPointCount))
        // toast("Time is up!")
    }

    function handleSkip() {
        endGame()
        setHeartCount(prevHeartCount => prevHeartCount.slice(0, -1))
        setPointCount(prevValue => (prevValue <= 0 ? 0 : prevValue - wordPointCount))
        handleNext()
    }

    function handleNext() {
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
            toast.error("No more reveals left!",{
                position: "top-left",
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            
            })
            return;
        }
        else if (revealedWord === currentWord) {
            setInput(currentWord);
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

    async function handleSignout() {
        if (window.confirm("Are you sure you want to Sign out? You will lose all your progress except your Highest Score!")) {
            setGameStart(false);
            try {
                const docRef = doc(db, "leaderboard", auth.currentUser.uid);

                await updateDoc(docRef, {
                    status: "Offline",
                    userName: userName,
                    score: pointCount,
                    highestScore: highScore,
                    isOnline: false,
                });

            } catch (error) {
                console.error("Error adding document: ", error);
            } finally {
                setTimeout(() => {
                    signOut(auth).then(() => {
                        // Sign-out successful.
                        console.log("Signout successful")
                        navigationHistory('/')
                    })
                }, 2000);

            }
        }
    }



    useEffect(() => {
        setHighScore(prevScore => (prevScore <= pointCount ? pointCount : prevScore))
    }, [pointCount])

    function handleEndGame() {
        setGameStart(false);
        setPointCount(0)
        submitScore()
    }

    function endGame() {
        if (heartCount.length === 0) {
            setPointCount(0)
            setHeartCount([])
            setGameStart(false);
        }
    }

    // for screen size... I'll handle the whole design later
    const screenSize ="md:h-screen lg:h-screen xl:h-screen 2xl:h-screen"

    return (
        <>
            <ToastContainer />
            <div className='sm:flex md:hidden lg:hidden xl:hidden 2xl:hidden bg-gradient-to-r from-gray-600 to-gray-700 p-8 w-full h-screen flex justify-center items-center'>
                <ScreenSizeWarning userName={userName ? userName : "User"} />
            </div>
            <div className={`sm:hidden md:hidden lg:flex bg-gradient-to-r ${screenSize} from-gray-600 to-gray-700 flex justify-center`}>
                <div className={`rounded-lg flex w-full h-full p-8 justify-evenly gap-2`}>
                    <div className="w-3/5 px-32 bg-slate-50 rounded-2xl shadow-2xl h-full">
                        <h1 className='text-2xl text-center font-bold mb-4'>Guess the word</h1>
                        <div className="flex justify-between mb-2">
                            <p id="hearts">
                                {
                                    heartCount.length === 0 ? <span>❤️(0)</span> :
                                    heartCount.map((heart, index) => (
                                        <span key={index} className="heart">{heart}</span>
                                    ))
                                }
                            </p>
                            <div id="scoreBox" className="flex gap-4">
                                <p id="user-points" className="font-medium">High score: {highScore}</p>
                                <p id="user-points" className="font-medium">Points: {pointCount}</p>

                            </div>
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
                        <div id="hintBox" className="h-20 bg-yellow-500 p-2 rounded-xl overflow-x-hidden overflow-y-auto">
                            <p className="font-medium ">Hint: <span className="font-normal">{hint}</span></p>
                        </div>

                        <div id="scrambleWord" className="scrambled-word shadow rounded-xl p-2 h-36 my-5">
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
                                id="userAnswer"
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
                            <Button id="revealBtn" color="warning" className="w-2/5" onClick={handleReveals} isDisabled={!gameStart}>Reveal <span>({revealCount})</span></Button>
                            <Button id="skipBtn" onClick={handleSkip} color="danger" className="w-2/5" isDisabled={!gameStart || heartCount.length === 0}>Skip <span></span></Button>
                        </div>
                        {!gameStart ? <Button onClick={handleStartGame} color="success" className="w-full mb-2">Start</Button>
                            : <Button onClick={handleSubmit} color="success" className="w-full mb-2">Submit <span></span></Button>}
                        <div className="flex justify-between mb-2">
                            <Button id="endGameBtn" onClick={handleEndGame} color="danger" className="w-full" isDisabled={!gameStart}>End Game <span></span></Button>

                        </div>


                    </div>
                    <div className="px-4 bg-slate-300 flex flex-col items-center rounded-2xl shadow-2xl">
                        <h1 className='text-2xl font-bold mb-2'>Leader board</h1>
                        <div className="mb-2">
                            <LeaderBoard tour={Tour} />
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



// function pauseGame() {
//     // setNextScramble(false);
//     setGameStart(false);
// }