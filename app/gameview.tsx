"use client";

import React, { useRef, useState, SetStateAction, useEffect } from "react";
import LetterNode from "./letter-node";
import LetterInput from "./letter-input";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Typo = require("typo-js");

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

const TIME_PER_WORD = 30000; // in milliseconds 

export default function GameView({}) {
  const [gameType, setGameType] : [string, React.Dispatch<SetStateAction<string>>] = useState("");
  const [isRunning, setIsRunning] : [boolean, React.Dispatch<SetStateAction<boolean>>] = useState(false);
  const [score, setScore] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [highScore, setHighScore] : [{timed: number, untimed: number}, React.Dispatch<SetStateAction<{timed: number, untimed: number}>>] = useState({timed: 0, untimed: 0});
  const [currentWord, setCurrentWord] : [string, React.Dispatch<SetStateAction<string>>] = useState("");
  const [prevWords, setPrevWords] : [string[], React.Dispatch<SetStateAction<string[]>>] = useState(new Array<string>());
  const [showGameModePicker, setShowGameModePicker] : [boolean, React.Dispatch<SetStateAction<boolean>>] = useState(false);
  const startTime = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [elapsedTime, setElapsedTime] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [totalDuration, setTotalDuration] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [dictionary, setDictionary] : [typeof Typo | null, React.Dispatch<SetStateAction<typeof Typo>>] = useState(null);

  useEffect(() => {
    // when page loads on client, retrieve any saved highscore data they have 
    setHighScore({
      timed: Number(localStorage.getItem('highscore-timed')) ?? 0, 
      untimed: Number(localStorage.getItem('highscore')) ?? 0, 
    })

    async function loadDictionary() {
      try {
        const affData = await fetch("dictionaries/en_US/en_US.aff").then((res) =>
          res.text()
        );
        const dicData = await fetch("dictionaries/en_US/en_US.dic").then((res) =>
          res.text()
        );

        setDictionary(new Typo("en_US", affData, dicData));
        
      } catch (error) {
        console.error("Error loading the dictionary:", error);
      }
    }
    loadDictionary(); 
  }, []);

  useEffect(() => {
    // update timer every 100 ms, end game if exceeds time 
    if (gameType == "timed") {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setElapsedTime(Date.now() - startTime.current);
        }, 100)
      }
    }

    return () => {
      clearInterval(intervalRef.current); // stops when finished 
    }
  }, [isRunning, gameType])

  useEffect(() => {
    if (elapsedTime > TIME_PER_WORD) {
      setIsRunning(false);
      if (score > highScore.timed) {
        localStorage.setItem('highscore-timed', score.toString());
        setHighScore({timed: score, untimed: highScore.untimed});
      }
    }
  }, [elapsedTime, highScore.timed, highScore.untimed, score])

  function startGame(gameType: string) {
    setIsRunning(true);
    setScore(0);
    setCurrentWord("");
    setPrevWords([]);
    setGameType(gameType);
    if (gameType == "timed") {
      startTime.current = Date.now(); 
      setElapsedTime(0);
      setTotalDuration(0);
    }
  }

  function endGame() {
    setIsRunning(false);
    if (gameType == 'untimed' && score > highScore.untimed) {
      localStorage.setItem('highscore', score.toString());
      setHighScore({timed: highScore.timed, untimed: score});
    } else if (gameType == 'timed' && score > highScore.timed) {
      localStorage.setItem('highscore-timed', score.toString());
      setHighScore({timed: score, untimed: highScore.untimed});
    }
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
    if (word.length > 45) return false; 
    if (!word.match(/^[A-Za-z]+$/)) return false; // reject input containing non-letter characters  
    if (!dictionary) {
      console.error("Error: cannot check word validity because dictionary is null.");
      return true; 
    }
    return dictionary.check(word) || dictionary.check(word.charAt(0).toUpperCase() + word.slice(1));
  }

  function handleWordInput() {
    if (!currentWord) return; // ignore empty word inputs 

    // don't end game for too-short words, just reject them and continue 
    if (currentWord.length < 3) {
      return; 
    }

    const duration = Math.floor((elapsedTime / 1000) % 60); 

    if (isValidWord(currentWord)) {
      setPrevWords([...prevWords, currentWord]);
      updateScore(currentWord);
      setCurrentWord(currentWord.charAt(currentWord.length - 1));
      if (gameType == "timed") {
        setTotalDuration(totalDuration + duration);
        setElapsedTime(0);
        startTime.current = Date.now();  
      }
    } else {
      endGame();
    }
  }

  return (
    <main className="h-9/10 gap-8 text-center px-8" onClick={() => setShowGameModePicker(false)}>
      <div className="h-full">
        { isRunning ?
          <div className="flex flex-col justify-between items-center h-full">
            {gameType == "timed" ?
              <div className={"font-bold italic text-3xl basis-1/5 content-end"}><p>{Math.floor(((TIME_PER_WORD - elapsedTime) / 1000) % 60)}</p></div>
              : ""
            }
            <div className={"content-center" + (gameType == "untimed" ? " basis-4/5" : " basis-4/5")}>
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
              {gameType == "timed" ? 
              <p className="font-bold text-yellow-200 italic">You entered {prevWords.length} word{prevWords.length > 1 || prevWords.length == 0 ? "s" : ""} in {totalDuration + (Math.floor((elapsedTime / 1000) % 60))} seconds!</p>
              : ""}
              {score > 0 && ((gameType == 'timed' && score == highScore.timed) || (gameType == 'untimed' && score == highScore.untimed)) ? 
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
            <div className={showGameModePicker ? "block" : "hidden"}>
              <button className="mx-1 border-2 border-green-500 rounded-xl py-2 px-4 cursor-pointer text-lg font-bold hover:bg-cyan-200/20" onClick={() => startGame("untimed")}>Normal Mode</button>
              <button className="mx-1 border-2 border-yellow-500 rounded-xl py-2 px-4 cursor-pointer text-lg font-bold hover:bg-cyan-200/20" onClick={() => startGame("timed")}>Timed Mode</button>
            </div>
            <button className={"border-2 rounded-xl py-2 px-4 cursor-pointer text-lg font-bold border-pulse hover:bg-cyan-200/20 transition duration-200" + (showGameModePicker ? " hidden" : "")} onClick={e => {setShowGameModePicker(true); e.stopPropagation();}}>Start New Game</button>
          </div>
          <p className="text-yellow-200 font-bold">Your high score is {gameType == "timed" ? highScore.timed : highScore.untimed}</p>
        </div>
        }
      </div>
    </main>
  )
}