
import React, { useState, useCallback, ChangeEvent } from 'react';
import { parseTextFile, parsePdfFile } from '../services/pdfParser';

interface HomePageProps {
  onLessonReady: (content: string) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);


const HomePage: React.FC<HomePageProps> = ({ onLessonReady }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    try {
      let content = '';
      if (file.type === 'application/pdf') {
        content = await parsePdfFile(file);
      } else if (file.type === 'text/plain') {
        content = await parseTextFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }
      onLessonReady(content);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process file.');
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  }, [onLessonReady]);
  
  const handlePasteSubmit = () => {
      if(text.trim().length < 50) {
          setError('Please paste a longer lesson text (at least 50 characters).');
          return;
      }
      setError('');
      onLessonReady(text);
  }

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
        Learn BGS with <span className="text-green-500">Fun!</span>
      </h2>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Upload your BGS lesson as a PDF or text file, or simply paste the text below. We'll turn it into a fun quiz for you!
      </p>

      <div className="mt-8 space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <label htmlFor="file-upload" className="relative cursor-pointer">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 transition-colors duration-300 bg-white">
              <UploadIcon className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-indigo-600">Click to upload</span> a file (PDF or TXT)
              </p>
            </div>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt" disabled={isLoading} />
          </label>
           {isLoading && <p className="mt-4 text-indigo-600 animate-pulse">Processing your file...</p>}
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white/80 backdrop-blur-sm px-3 text-lg font-medium text-gray-900"> Or </span>
            </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="...paste your lesson text here."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!text.trim() || isLoading}
            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            Create Quiz from Text
          </button>
        </div>

         {error && <p className="mt-4 text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
};

export default HomePage;
