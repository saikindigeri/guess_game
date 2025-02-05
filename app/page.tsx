'use client';

import { useState, useEffect } from 'react';
import GuessRow from './components/GuessRow';


const WORDS = ["react", "table", "space", "devas", "build"];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const Home: React.FC = () => {
  const [solution, setSolution] = useState<string>(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<{ word: string; feedback: string[] }[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check and set the theme from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Update localStorage when the theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value.length <= WORD_LENGTH && /^[a-z]*$/.test(value) && !gameOver) {
      setCurrentGuess(value);
    }
  };

  const checkGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    if (!WORDS.includes(currentGuess)) {
      setMessage("Invalid word!");
      return;
    }

    const solutionArray = solution.split('');
    const guessArray = currentGuess.split('');
    const feedback = Array(WORD_LENGTH).fill("bg-gray-500");
    const usedIndexes = new Set<number>();

    // First pass: Check for correct letters in correct positions (green)
    guessArray.forEach((char, index) => {
      if (char === solutionArray[index]) {
        feedback[index] = "bg-green-500";
        usedIndexes.add(index);
      }
    });

    // Second pass: Check for correct letters in wrong positions (yellow)
    guessArray.forEach((char, index) => {
      if (feedback[index] === "bg-gray-500") { // Only check misplaced letters
        const misplacedIndex = solutionArray.findIndex((solChar, solIdx) => solChar === char && !usedIndexes.has(solIdx));
        if (misplacedIndex !== -1) {
          feedback[index] = "bg-yellow-500";
          usedIndexes.add(misplacedIndex);
        }
      }
    });

    const newGuesses = [...guesses, { word: currentGuess, feedback }];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === solution) {
      setGameOver(true);
      setMessage("🎉 You won!");
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`Game Over! The word was ${solution}`);
    }
  };

  const restartGame = () => {
    setSolution(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`h-screen flex flex-col items-center p-6 space-y-4 transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className="w-full flex justify-between items-center backdrop-blur-md bg-opacity-40 dark:bg-opacity-50 p-4 rounded-xl">
        <h1 className="text-3xl font-bold animate__animated animate__fadeIn">Guess Game</h1>
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="p-3 rounded-full bg-gray-300 dark:bg-gray-600 text-xl transition-colors hover:bg-gray-500 dark:hover:bg-gray-400 backdrop-blur-md bg-opacity-50 dark:bg-opacity-60"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </header>
      <div className="grid grid-rows-6 gap-4">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <GuessRow key={i} guess={guesses[i]} wordLength={WORD_LENGTH} />
        ))}
      </div>

      <input
        type="text"
        value={currentGuess}
        onChange={handleInput}
        disabled={gameOver}
        className="border border-gray-400 px-6 py-3 text-xl text-center uppercase rounded-lg shadow-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />
      
      <button
        onClick={checkGuess}
        disabled={gameOver}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
      >
        Submit
      </button>

      {message && <p className="text-lg font-semibold mt-4">{message}</p>}

      <button
        onClick={restartGame}
        className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 ease-in-out mt-4"
      >
        New Game
      </button>
    </div>
  );
};

export default Home;
