
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { generateSequenceDiagram } from './services/geminiService';

const App: React.FC = () => {
  const [requirements, setRequirements] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseGeminiResponse = (responseText: string) => {
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/;
    const match = responseText.match(mermaidRegex);

    if (match && match[1]) {
      const code = match[1].trim();
      const analysisText = responseText.replace(mermaidRegex, '').trim();
      setMermaidCode(code);
      setAnalysis(analysisText);
    } else {
      setAnalysis(responseText);
      setMermaidCode('');
      setError("The AI response did not contain a valid Mermaid code block. Please try refining your request.");
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!requirements.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    setMermaidCode('');

    try {
      const response = await generateSequenceDiagram(requirements);
      if (response.startsWith('Error:')) {
        setError(response);
      } else {
        parseGeminiResponse(response);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [requirements]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ height: 'calc(100vh - 120px)' }}>
            <InputPanel 
                requirements={requirements}
                setRequirements={setRequirements}
                onGenerate={handleGenerate}
                isLoading={isLoading}
            />
            <OutputPanel 
                analysis={analysis}
                mermaidCode={mermaidCode}
                setMermaidCode={setMermaidCode}
                isLoading={isLoading}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
