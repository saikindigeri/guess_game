import LetterBox from "./LetterBox";

interface GuessRowProps {
  guess?: { word: string; feedback: string[] };  // Optional to handle undefined case
  wordLength: number;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess, wordLength }) => {
  // Default to empty values if guess is undefined
  const word = guess?.word || '';
  const feedback = guess?.feedback || Array(wordLength).fill('');

  return (
    <div className="flex space-x-2">
      {Array.from({ length: wordLength }).map((_, j) => (
        <LetterBox key={j} letter={word[j]} feedback={feedback[j]} />
      ))}
    </div>
  );
};

export default GuessRow;
