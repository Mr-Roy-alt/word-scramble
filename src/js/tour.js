//onboarding experience.
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

export default function Tour(closeBtn) {
    const tourDriver = driver({
        showProgress: true,
        allowClose: closeBtn,
        steps: [
            {
                popover: {
                    title: 'Welcome to Guess the Word!',
                    description: 'This is a simple game where you have to guess the word from the scrambled letters. You have <span style="font-size: 15px; font-weight: bold; color: green;"> 20 seconds </span> to guess the word.',
                    side: "left",
                    align: 'start'
                }
            },
            {
                element: '#hearts',
                popover: {
                    title: 'Hearts ❤️',
                    description: 'You have 5 hearts. If you lose all your hearts, the game will end.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#skipBtn',
                popover: {
                    title: 'Skip button 💨',
                    description: 'You can also skip the word if you don\'t know the answer but, you will lose a heart if you do. i.e ❤️ - 1. Also, the total number of characters for the word will be deducted from your score. i.e So, if <span style="font-size: 15px; font-weight: bold; color: green;"> "LOVE = 4" </span> your score becomes <span style="font-size: 15px; font-weight: bold; color: green;"> "Score - 4" </span>.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#revealBtn',
                popover: {
                    title: 'Reveal button 🔍',
                    description: 'You can use the reveal button to reveal the word. You have <span style="font-size: 15px; font-weight: bold; color: green;"> 5 reveals </span>. Use it wisely! 😉',
                    side: "left",
                    align: 'start'
                }
            },
            {
                element: '#timerProgress',
                popover: {
                    title: 'Timer ⏳',
                    description: 'You have 20 seconds to guess the word. If you fail to guess the word in 20 seconds, you will lose a heart. ❤️ - 1 Also, the total number of characters for the word will be deducted from your score. i.e So, if <span style="font-size: 15px; font-weight: bold; color: green;"> "BAG = 3" </span> your score becomes <span style="font-size: 15px; font-weight: bold; color: green;"> "Score - 3" </span>.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#scoreBox',
                popover: {
                    title: 'Scores 📈',
                    description: 'Your current score and your highest score will be displayed here.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#hintBox',
                popover: {
                    title: 'Hint 📝',
                    description: 'Hint will be displayed here as soon as you start playing. This is to give you an idea of the word.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#scrambleWord',
                popover: {
                    title: 'Scramble Word ➰',
                    description: 'Scrambled word will be displayed here. You have to guess the word from the scrambled letters.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#userAnswer',
                popover: {
                    title: "Player's Answer 📝",
                    description: 'Enter your answer here and click the Submit button. ✅',
                }
            },
            {
                element: '#endGameBtn',
                popover: {
                    title: 'End Game button ⏹️',
                    description: 'You can also end the game by clicking the End Game button.⛔',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: 'End of First Introduction! 😊',
                    description: 'And that is all for now, go ahead and start challenging the world. Good luck and see you soon 🤗.',
                }
            },
        ]
    });

    tourDriver.drive()

    // Stop the driver when the component unmounts
    return () => {
        // welcomeDriver.destroy();
        tourDriver.destroy();
    };
}