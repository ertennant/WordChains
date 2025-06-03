import { useState, SetStateAction } from "react"

type AppProps = {
  value: string 
}

export default function LetterNode({value}: AppProps) {  
  return (
    <input 
      className="font-[Georgia] font-bold italic text-3xl rounded-full m-1 h-[2em] w-[2em] bg-white text-rose-700 text-center" 
      type="text"
      readOnly={true}
      value={value}
    ></input>
  )
}