
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Sequence Diagram Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
