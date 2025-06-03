import GameView from "./gameview";

export default function Home() {
  return (
    // stylized sign painting cursive title: ...word chains...
    // "enter a word to start"
    // letters appear in circles as they are typed 
    // when a word is successful, it slides off the screen to the left 
    // at the end of the game, all the words are displayed, scrollable 
    // current score is displayed at bottom  
    <div className="h-13/14 flex flex-col">
      <h1 className="m-4 text-4xl text-center text-rose-500 font-[Playwrite_US_Trad] font-bold">Word Chains</h1>
      <GameView></GameView>
    </div>
  );
}
