import {motion} from 'framer-motion'

interface LetterBoxProps {
    letter: string;
    feedback: string;
  }
  
  const LetterBox: React.FC<LetterBoxProps> = ({ letter, feedback }) => {
    return (
      <motion.div
        className={`w-10 h-10 flex items-center justify-center border border-gray-400 text-xl font-bold rounded-lg ${feedback}`}
      >
        {letter}
      </motion.div>
    );
  };
  
  export default LetterBox;
  