
import React, { useState, useMemo, useEffect } from 'react';
import { QuizQuestion, Language } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  language: Language;
}

const correctSound = typeof Audio !== "undefined" ? new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6aW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1VVVTEAAAAAP/84QeAA8AAAANCgAAAAFhp4y2AACsvowmEwMCEhENl45dMwcAKCl0lwwEALw7MwcACAE4tYQJBYQnAQAPEwEACAAAAAABEU5lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEHwE8AAAANAAAAAkCoa28AAAvE4gETCADghAMiIdQkAMsAEDBQMAIAAVEwMADAMAEBEwAAGoAAAAAAAAABQROaIAAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/84QfgTIAAABWAAAAETAqhoGwAAC8TiARMIAOCEAzIh1DQAywAQMFAwAgABUTAwAMAwAQETAADWj393d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d//OEH4E8AAAAaAAAAA8Coa2sAAAvE4gETCADghAMiIdQ0AMsAEBAMAACAAVEwMAFAwAABMwAANVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/84QfgUAAAAAFgAAABAAqhqjQAD//uYAEwA") : null;
const incorrectSound = typeof Audio !== "undefined" ? new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6aW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1VVVTEAAAAAP/84QeAAgAAAANCgAAAAFhp4y2AACsvowmEwMCEhENl45dMwcAKCl0lwwEALw7MwcACAE4tYQJBYQnAQAPEwEACAAAAAABEU5lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEHwEAIAAANAAAAAkCoa28AAAvE4gETCADghAMiIdQkAMsAEDBQMAIAAVEwMADAMAEBEwAAGoAAAAAAAAABQROaIAAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/84QfgOAAAAAWAAAAETAqhoGwAAC8TiARMIAOCEAzIh1DQAywAQMFAwAgABUTAwAMAwAQETAADWj393d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d//OEH4EAAAAAaAAAAA8Coa2sAAAvE4gETCADghAMiIdQ0AMsAEBAMAACAAVEwMAFAwAABMwAANVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/84QfgQAAAAAFgAAABAAqhqjQAD//uYAEwA") : null;


const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete, language }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  useEffect(() => {
    // Reset state for the new question
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShake(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      correctSound?.play();
    } else {
      incorrectSound?.play();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(score);
    }
  };

  const getButtonClass = (option: string) => {
    let baseClass = `w-full text-left p-4 rounded-lg border-2 text-lg font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`;
    
    if (language === Language.BANGLA) {
        baseClass += ' font-bangla';
    }

    if (isAnswered) {
      const isCorrect = option === currentQuestion.correctAnswer;
      const isSelected = option === selectedAnswer;

      if (isCorrect) {
        return `${baseClass} bg-green-500 border-green-600 text-white animate-pulse`;
      }
      if (isSelected && !isCorrect) {
        return `${baseClass} bg-red-500 border-red-600 text-white`;
      }
      return `${baseClass} bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed`;
    }

    return `${baseClass} bg-white border-gray-300 hover:bg-yellow-100 hover:border-yellow-400 hover:scale-105`;
  };

  return (
    <div className={`p-4 animate-fade-in ${shake ? 'animate-shake' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold text-indigo-600">Question {currentQuestionIndex + 1}/{questions.length}</div>
        <div className="text-lg font-bold text-green-600">Score: {score}</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className={`text-2xl font-bold text-gray-800 ${language === Language.BANGLA ? 'font-bangla' : ''}`}>
          {currentQuestion.question}
        </h3>
      </div>
      
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={getButtonClass(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-6 text-center animate-fade-in">
           {selectedAnswer === currentQuestion.correctAnswer ? (
             <p className="text-2xl font-bold text-green-600">Correct! 🎉</p>
           ) : (
             <p className="text-2xl font-bold text-red-600">
               Not quite! The correct answer was: <span className="block mt-1 font-extrabold">{currentQuestion.correctAnswer}</span>
             </p>
           )}
          <button
            onClick={handleNext}
            className="mt-4 px-10 py-3 text-lg font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
