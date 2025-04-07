import React from 'react';
import GithubProfileAnalyzer from './components/GithubProfilerAnalyzer';
import { ThemeProvider } from './components/ThemeProvider';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b py-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold tracking-tighter">GitHub Profile Analyzer</h1> <span className='text-xs tracking-tight font-semibold'>Rate limiting applied (60request per hour)</span>
          </div>
        </header>
        <main className="py-8">
          <GithubProfileAnalyzer />
        </main>
        <footer className="border-t py-4 text-center text-sm text-gray-500">
          <div className="container mx-auto">
            <p>Built with React, TypeScript and ShadCN UI</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;