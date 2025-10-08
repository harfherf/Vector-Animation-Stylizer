
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { generateVectorVideo } from './services/geminiService';
import { extractFirstFrame } from './utils/fileUtils';
import type { AppState, FrameData } from './types';
import { AppStatus } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ status: AppStatus.IDLE });
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
  
  const loadingMessages = [
    'Warming up the animation engine...',
    'Analyzing the first frame...',
    'This can take a few minutes...',
    'Sketching vector outlines...',
    'Applying pastel color palette...',
    'Rendering smooth motion...',
    'Almost there, adding final touches...',
  ];

  useEffect(() => {
    let interval: number;
    if (appState.status === AppStatus.LOADING) {
      let messageIndex = 0;
      setLoadingMessage(loadingMessages[messageIndex]);
      interval = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [appState.status]);

  const handleFileSelect = (file: File) => {
    const originalVideoUrl = URL.createObjectURL(file);
    setAppState({ status: AppStatus.FILE_SELECTED, file, originalVideoUrl });
  };

  const handleGenerateClick = useCallback(async () => {
    if (appState.status !== AppStatus.FILE_SELECTED) return;
    
    setAppState({ status: AppStatus.LOADING, file: appState.file, originalVideoUrl: appState.originalVideoUrl });

    try {
      const frameData: FrameData = await extractFirstFrame(appState.file);
      const generatedVideoBlob = await generateVectorVideo(frameData.base64, frameData.mimeType);
      const generatedVideoUrl = URL.createObjectURL(generatedVideoBlob);
      setAppState({
        status: AppStatus.COMPLETED,
        file: appState.file,
        originalVideoUrl: appState.originalVideoUrl,
        generatedVideoUrl,
      });
    } catch (error) {
      console.error("Video generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setAppState({
        status: AppStatus.ERROR,
        file: appState.file,
        originalVideoUrl: appState.originalVideoUrl,
        error: errorMessage,
      });
    }
  }, [appState]);

  const handleReset = () => {
    if (appState.status === AppStatus.COMPLETED) {
        URL.revokeObjectURL(appState.generatedVideoUrl);
    }
    if (appState.status !== AppStatus.IDLE && appState.status !== AppStatus.LOADING) {
       URL.revokeObjectURL(appState.originalVideoUrl);
    }
    setAppState({ status: AppStatus.IDLE });
  };

  const renderContent = () => {
    switch (appState.status) {
      case AppStatus.LOADING:
        return <Loader message={loadingMessage} />;
      case AppStatus.COMPLETED:
        return <ResultsDisplay originalUrl={appState.originalVideoUrl} generatedUrl={appState.generatedVideoUrl} onReset={handleReset} />;
      case AppStatus.ERROR:
        return (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-xl font-bold text-red-700">Generation Failed</h3>
            <p className="text-red-600 mt-2">{appState.error}</p>
            <button
              onClick={handleReset}
              className="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case AppStatus.IDLE:
      case AppStatus.FILE_SELECTED:
      default:
        return (
          <FileUpload
            onFileSelect={handleFileSelect}
            onGenerate={handleGenerateClick}
            file={appState.status === AppStatus.FILE_SELECTED ? appState.file : null}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-slate-200">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
