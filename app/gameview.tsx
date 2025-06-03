"use client";

import { useState, SetStateAction, useEffect } from "react";
import LetterNode from "./letter-node";
import LetterInput from "./letter-input";

const letterValues : Map<string, number> = new Map([
  ['e', 1],
  ['t', 2],
  ['a', 2], 
  ['o', 2], 
  ['i', 2],
  ['n', 2], 
  ['s', 3],
  ['h', 3],
  ['r', 3],
  ['d', 3],
  ['l', 3],
  ['c', 5],
  ['u', 5],
  ['m', 5],
  ['w', 5],
  ['f', 5],
  ['g', 5],
  ['y', 7], 
  ['p', 7],
  ['b', 7],
  ['v', 7],
  ['k', 7],
  ['j', 10],
  ['x', 10],
  ['q', 10],
  ['z', 10]
  ]);

export default function GameView({}) {
  const [isRunning, setIsRunning] : [boolean, React.Dispatch<SetStateAction<boolean>>] = useState(false);
  const [score, setScore] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [highScore, setHighScore] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [currentWord, setCurrentWord] : [string, React.Dispatch<SetStateAction<string>>] = useState("");
  const [prevWords, setPrevWords] : [string[], React.Dispatch<SetStateAction<string[]>>] = useState(new Array());

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('highscore')) ?? 0);
  }, []);

  function startGame() {
    setIsRunning(true);
    setScore(0);
    setCurrentWord("");
    setPrevWords([]);
  }

  function endGame() {
    setIsRunning(false);
    if (score > highScore) {
      localStorage.setItem('highscore', score.toString());
      setHighScore(score);
    }
    console.log(`Game Over. Your score is: ${score}`);
  }

  function updateScore(word: string) {
    let value = 0; 
    for (const c of word) {
      if (!letterValues.has(c) || !letterValues.get(c)) {
        console.error(`Error: no score value exists for letter ${c}. Defaulting to 1.`);
      }
      value += letterValues.get(c) ?? 1;
    }
    setScore(score + value);
  }

  function handleLetterInput(value : string) {
    if (!value) return; 

    if (value == 'BACKSPACE') {
      if (currentWord.length > 1) {
        setCurrentWord(currentWord.slice(0, currentWord.length - 1));
      }
      return; 
    }

    setCurrentWord(currentWord + value);
  }

  function isValidWord(word: string) {
    // TODO: add dictionary check 
    return true; 
  }

  function handleWordInput() {
    if (!currentWord) return; // ignore empty word inputs 

    // don't end game for too-short words, just reject them and continue 
    if (currentWord.length < 3) {
      return; 
    }

    if (isValidWord(currentWord)) {
      setPrevWords([...prevWords, currentWord]);
      updateScore(currentWord);
      setCurrentWord(currentWord.charAt(currentWord.length - 1));
    } else {
      endGame();
    }
  }

  return (
    <main className="h-9/10 gap-8 text-center px-8">
      <div className="h-full">
        { isRunning ?
          <div className="flex flex-col justify-between items-center h-full">
            <div className="basis-4/5 content-center">
              {currentWord.split("").map((c, i) => 
                <LetterNode key={'letter-' + i} value={c}></LetterNode>
              )}
              <LetterInput
                onChange={handleLetterInput}
                onSubmit={handleWordInput}
              ></LetterInput>
            </div>
            <div className="content-center">
              <button onClick={endGame} className="border-2 rounded-xl py-2 px-4 cursor-pointer text-lg font-bold hover:bg-cyan-200/20 transition duration-200">End Game</button>
            </div>
            <div className="content-end text-yellow-200 font-bold"><p>{score} points</p></div>
          </div>
        : 
        <div className="flex flex-col items-center h-full">
          {score > 0 ? 
            <div className="content-center p-4 w-full basis-1/5 sm:w-1/2 lg:w-1/3 xl:w-1/4">
              <p className="font-bold text-yellow-200 italic">You scored {score} points!</p>
              {score == highScore && score > 0 ? 
                <p className="text-pulse-green font-bold italic">
                  <span className="sparkle-in-out-animate">✨</span>
                  New High Score!
                  <span className="sparkle-out-in-animate">✨</span>
                </p> 
              : ""}
            </div>
          : ""
          }
          {prevWords.length > 0 ? 
            <div className="border-2 shrink basis-3/5 overflow-y-scroll rounded-xl w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
              <h2 className="sticky top-0 text-lg font-bold bg-background p-2">Words Used</h2>
              <div>
                {prevWords.map((word, i) => 
                  <li key={"word-" + i} className="list-none p-1 hover:bg-white/10 transition duration-200 ease">{word}</li>
                )}
              </div>              
            </div>
          : ""}
          <div className={(score > 0 ? "basis-1/5 " : "grow ") + "content-center w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"}>
            <button className="border-2 rounded-xl py-2 px-4 cursor-pointer text-lg font-bold border-pulse hover:bg-cyan-200/20 transition duration-200" onClick={startGame}>Start New Game</button>
          </div>
          {score == 0 && highScore > 0 ? 
            <p className="text-yellow-200 font-bold">Your high score is {highScore}</p>
          : ""}
        </div>
        }
      </div>
    </main>
  )
}