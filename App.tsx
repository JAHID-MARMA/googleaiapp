
import React, { useState, useCallback } from 'react';
import { AppView, QuizQuestion, Language } from './types';
import HomePage from './components/HomePage';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import SummaryView from './components/SummaryView';
import { generateQuiz } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';

// PDFJS worker configuration
import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);

  const handleLessonReady = (content: string) => {
    setLessonContent(content);
    setView(AppView.LESSON_VIEW);
    setError('');
  };

  const handleStartQuiz = useCallback(async () => {
    setView(AppView.GENERATING_QUIZ);
    setError('');
    try {
      const generatedQuestions = await generateQuiz(lessonContent, language);
      if (generatedQuestions.length === 0) {
        throw new Error("AI couldn't generate a quiz from this text. Please try with a more detailed lesson.");
      }
      setQuiz(generatedQuestions);
      setScore(0);
      setView(AppView.QUIZ_VIEW);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the quiz.";
      setError(errorMessage);
      setView(AppView.LESSON_VIEW);
    }
  }, [lessonContent, language]);
  
  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setView(AppView.SUMMARY_VIEW);
  };

  const handleRetryQuiz = () => {
    setScore(0);
    setView(AppView.QUIZ_VIEW);
  };

  const handleUploadNew = () => {
    setLessonContent('');
    setQuiz([]);
    setError('');
    setView(AppView.HOME);
  };

  const handleLearnAgain = () => {
    setView(AppView.LESSON_VIEW);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <HomePage onLessonReady={handleLessonReady} />;
      case AppView.LESSON_VIEW:
        return (
          <LessonView
            content={lessonContent}
            onStartQuiz={handleStartQuiz}
            language={language}
            setLanguage={setLanguage}
            error={error}
          />
        );
      case AppView.GENERATING_QUIZ:
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Creating your fun quiz...</h2>
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Our friendly AI is reading the lesson!</p>
            </div>
        );
      case AppView.QUIZ_VIEW:
        return <QuizView questions={quiz} onComplete={handleQuizComplete} language={language}/>;
      case AppView.SUMMARY_VIEW:
        return (
          <SummaryView
            score={score}
            totalQuestions={quiz.length}
            onRetry={handleRetryQuiz}
            onUploadNew={handleUploadNew}
            onLearnAgain={handleLearnAgain}
          />
        );
      default:
        return <HomePage onLessonReady={handleLessonReady} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center p-4">
      <Header />
      <main className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 mt-6 ring-1 ring-black ring-opacity-5">
        <div className="transition-all duration-300">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} Jahid's Edu. Learning made fun.
      </footer>
    </div>
  );
};

export default App;
