import { useState, SetStateAction } from "react";

type AppProps = {
  onChange: (value: string) => void 
  onSubmit: () => void 
}

export default function LetterInput({onChange, onSubmit}: AppProps) {
  const [letter, setLetter] : [string, React.Dispatch<SetStateAction<string>>] = useState("");

  function handleChange(value: string) {
    if (!value || !onChange) return; 
    value = value.toLowerCase();
    if (!"abcdefghijklmnopqrstuvwxyz".includes(value)) {
      // ignore punctuation etc., user likely typing quickly 
      setLetter("");
      return; 
    }
    setLetter("");
    onChange(value);
  }
  
  return (
    <input 
      className="rounded-full w-12 h-12 bg-transparent text-white text-center text-2xl border-white border-2" 
      type="text"
      maxLength={1}
      autoFocus
      onChange={event => handleChange(event.currentTarget.value)}
      onKeyUp={event => event.key == 'Enter' ? onSubmit() : undefined}
      value={letter}
    ></input>
  )
}