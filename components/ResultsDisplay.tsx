
import React from 'react';

interface ResultsDisplayProps {
  originalUrl: string;
  generatedUrl: string;
  onReset: () => void;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const RestartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" />
    </svg>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalUrl, generatedUrl, onReset }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-slate-800">Transformation Complete!</h2>
      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Original Video</h3>
          <video src={originalUrl} controls className="w-full rounded-lg shadow-md aspect-video bg-slate-900" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Vector Animation</h3>
          <video src={generatedUrl} controls autoPlay loop className="w-full rounded-lg shadow-md aspect-video bg-slate-900" />
        </div>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <a
          href={generatedUrl}
          download="vector_animation.mp4"
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Result
        </a>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          Create Another
        </button>
      </div>
    </div>
  );
};
