
import React from 'react';
import { PromptTemplate } from '../types';
import { PROMPT_TEMPLATES } from '../constants';
import { UploadIcon, GenerateIcon } from './icons';

interface InputPanelProps {
  requirements: string;
  setRequirements: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ requirements, setRequirements, onGenerate, isLoading }) => {

  const handleTemplateChange = (template: PromptTemplate) => {
    setRequirements(PROMPT_TEMPLATES[template]);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700/50">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">1. Provide Requirements</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Start with a template (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleTemplateChange(PromptTemplate.SIMPLE)} className="btn-secondary">Simple Diagram</button>
          <button onClick={() => handleTemplateChange(PromptTemplate.SYSTEMATIC)} className="btn-secondary">Systematic Analysis Diagram</button>
          <button onClick={() => handleTemplateChange(PromptTemplate.SHOPPING_EXAMPLE)} className="btn-secondary">Shopping Example</button>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <label htmlFor="requirements-input" className="block text-sm font-medium text-gray-400 mb-2">
          Enter your requirements below or upload a file
        </label>
        <textarea
          id="requirements-input"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="e.g., A user logs into the system. The system authenticates the user. On success, it shows the dashboard."
          className="w-full flex-grow p-3 bg-gray-900/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none text-gray-200"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between gap-4">
        <button className="btn-secondary w-1/2 flex items-center justify-center opacity-50 cursor-not-allowed" disabled title="File upload coming soon!">
          <UploadIcon />
          Upload File
        </button>
        <button 
          onClick={onGenerate} 
          disabled={isLoading || !requirements.trim()}
          className="btn-primary w-1/2 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <GenerateIcon />
              Generate
            </>
          )}
        </button>
      </div>
      <style>{`
        .btn-primary {
          @apply bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
        }
        .btn-secondary {
          @apply bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300;
        }
      `}</style>
    </div>
  );
};

export default InputPanel;