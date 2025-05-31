"use client";

import { useState, SetStateAction } from "react";
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
  const [score, setScore] : [number, React.Dispatch<SetStateAction<number>>] = useState(0);
  const [currentWord, setCurrentWord] : [string, React.Dispatch<SetStateAction<string>>] = useState("");
  const [prevWords, setPrevWords] : [string[], React.Dispatch<SetStateAction<string[]>>] = useState(new Array());

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
    setCurrentWord(currentWord + value);
  }

  function isValidWord(word: string) {
    if (word.length < 3) {
      return false; 
    }

    // TODO: add dictionary check 
    return true; 
  }

  function handleWordInput() {
    console.log(`You entered '${currentWord}'`);
    if (!currentWord) return; // ignore empty word inputs 

    if (isValidWord(currentWord)) {
      setPrevWords([...prevWords, currentWord]);
      updateScore(currentWord);
      setCurrentWord(currentWord.charAt(currentWord.length - 1));
    } else {
      alert(`Game Over`);
      console.log(`Game Over. Your score is: ${score}`);
      setPrevWords([]);
      setCurrentWord("");
      setScore(0);
    }
  }

  return (
    <main className="w-full h-full text-center">
      <div className="h-full p-8">
        {currentWord.split("").map((c, i) => 
          <LetterNode key={'letter-' + i} value={c}></LetterNode>
        )}
        <LetterInput
          onChange={handleLetterInput}
          onSubmit={handleWordInput}
        ></LetterInput>
      </div>
      <div className="fixed bottom-12 w-full"><p>Score: {score}</p></div>
    </main>
  )
}