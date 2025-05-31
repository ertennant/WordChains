import { useState, SetStateAction } from "react"

type AppProps = {
  value: string 
}

export default function LetterNode({value}: AppProps) {  
  return (
    <input 
      className="rounded-full border-2 border-black w-12 h-12 bg-white text-black text-center text-2xl" 
      type="text"
      maxLength={1}
      readOnly={true}
      value={value}
    ></input>
  )
}