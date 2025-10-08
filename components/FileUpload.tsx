
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onGenerate: () => void;
  file: File | null;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.55a1.5 1.5 0 01.45 2.12l-3.5 4.5A1.5 1.5 0 0115 15.5V8.5a1.5 1.5 0 012.25-1.32l3.5 2a1.5 1.5 0 010 2.64l-3.5 2zM4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onGenerate, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center text-slate-700">Upload Your Video</h2>
      <p className="mt-2 text-center text-slate-500 max-w-md">
        Select a video file to transform. The AI will use the first frame as inspiration to generate a new animation in a flat, vector style.
      </p>
      
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-8 w-full max-w-lg flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'}`}
      >
        <UploadIcon className="w-16 h-16 text-slate-400"/>
        <span className="mt-4 text-slate-600 font-medium">Drag & drop your video here</span>
        <span className="mt-1 text-slate-500">or click to browse</span>
        <input type="file" accept="video/*" className="hidden" onChange={onInputChange} />
      </label>

      {file && (
        <div className="mt-6 w-full max-w-lg p-4 bg-slate-100 rounded-lg flex items-center space-x-4 border border-slate-200">
            <VideoIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={!file}
        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        Stylize Video
      </button>
    </div>
  );
};
