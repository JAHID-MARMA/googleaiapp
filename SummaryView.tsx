
import React, { useMemo } from 'react';
import { ENCOURAGING_MESSAGES } from '../constants';

interface SummaryViewProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onUploadNew: () => void;
  onLearnAgain: () => void;
}

const RetryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M21 21v-5h-5"/>
  </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);


const SummaryView: React.FC<SummaryViewProps> = ({ score, totalQuestions, onRetry, onUploadNew, onLearnAgain }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const { message, colorClass, emoji } = useMemo(() => {
    let category: 'HIGH' | 'MEDIUM' | 'LOW';
    let emojiChar: string;
    let color: string;

    if (percentage >= 80) {
      category = 'HIGH';
      emojiChar = '🏆';
      color = 'text-green-500';
    } else if (percentage >= 50) {
      category = 'MEDIUM';
      emojiChar = '👍';
      color = 'text-yellow-500';
    } else {
      category = 'LOW';
      emojiChar = '🌱';
      color = 'text-red-500';
    }
    const messages = ENCOURAGING_MESSAGES[category];
    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      colorClass: color,
      emoji: emojiChar,
    };
  }, [percentage]);
  
  return (
    <div className="text-center p-4 sm:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
      <div className="my-8">
        <div className={`text-8xl font-black ${colorClass}`}>{percentage}%</div>
        <div className="text-2xl text-gray-600 font-semibold mt-2">
          You answered {score} out of {totalQuestions} questions correctly.
        </div>
      </div>
      <p className="text-2xl font-semibold text-indigo-700 my-8">
        {emoji} {message}
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          <RetryIcon className="w-5 h-5"/>
          Retry Quiz
        </button>
        <button
          onClick={onLearnAgain}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-green-500 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-transform transform hover:scale-105"
        >
          <BookOpenIcon className="w-5 h-5"/>
          Learn Again
        </button>
        <button
          onClick={onUploadNew}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-transform transform hover:scale-105"
        >
          <UploadIcon className="w-5 h-5"/>
          New Lesson
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
