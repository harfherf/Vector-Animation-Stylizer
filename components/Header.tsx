
import React from 'react';

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
            <FilmIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Vector Animation Stylizer
            </h1>
        </div>
      </div>
    </header>
  );
};
