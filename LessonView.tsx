
import React from 'react';
import { Language } from '../types';

interface LessonViewProps {
  content: string;
  onStartQuiz: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  error: string;
}

const LessonView: React.FC<LessonViewProps> = ({ content, onStartQuiz, language, setLanguage, error }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Lesson</h2>
      <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 border rounded-lg shadow-inner text-gray-700 leading-relaxed font-bangla">
        {content}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h3 className="font-semibold text-lg text-indigo-800 mb-2">Quiz Settings</h3>
        <div className="flex items-center gap-4">
            <p className="text-gray-700">Quiz Language:</p>
            <div className="flex rounded-md shadow-sm">
                <button
                    onClick={() => setLanguage(Language.ENGLISH)}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${language === Language.ENGLISH ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    English
                </button>
                <button
                    onClick={() => setLanguage(Language.BANGLA)}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors font-bangla ${language === Language.BANGLA ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    বাংলা
                </button>
            </div>
        </div>
      </div>
      
      {error && <p className="mt-4 text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>}

      <div className="mt-8 text-center">
        <button
          onClick={onStartQuiz}
          className="px-12 py-4 text-xl font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 animate-pulse"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default LessonView;
