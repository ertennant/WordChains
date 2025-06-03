import { useState, SetStateAction } from "react";

type AppProps = {
  onChange: (value: string) => void 
  onSubmit: () => void 
}

export default function LetterInput({onChange, onSubmit}: AppProps) {
  const [letter, setLetter] : [string, React.Dispatch<SetStateAction<string>>] = useState("");

  function handleChange(value: string) {
    if (!value) return; 

    if (value == 'BACKSPACE') {
      onChange(value);
      return; 
    }

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
      className="rounded-full w-[2em] h-[2em] bg-transparent text-white text-center text-3xl border-white border-2" 
      type="text"
      maxLength={1}
      autoFocus
      onChange={event => handleChange(event.currentTarget.value)}
      onKeyUp={event => event.key == 'Enter' ? onSubmit() : event.key == 'Backspace' ? handleChange('BACKSPACE') : ""}
      value={letter}
    ></input>
  )
}