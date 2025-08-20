
import React, { useState, useRef, useCallback } from 'react';
import { OutputTab } from '../types';
import MermaidDiagram from './MermaidDiagram';
import { DownloadIcon, CopyIcon } from './icons';

interface OutputPanelProps {
  analysis: string;
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
  isLoading: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ analysis, mermaidCode, setMermaidCode, isLoading }) => {
  const [activeTab, setActiveTab] = useState<OutputTab>(OutputTab.DIAGRAM);
  const [copySuccess, setCopySuccess] = useState(false);
  const diagramContainerRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSVG = () => {
    const svgElement = document.querySelector('.mermaid-container > svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      downloadFile('sequence-diagram.svg', svgString, 'image/svg+xml');
    } else {
      alert('Could not find the diagram SVG to download.');
    }
  };

  const getFullMarkdown = useCallback(() => {
    return `${analysis}\n\n\`\`\`mermaid\n${mermaidCode}\n\`\`\``;
  }, [analysis, mermaidCode]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <svg className="animate-spin mr-3 h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Diagram... Please wait.
        </div>
      );
    }

    if (!analysis && !mermaidCode) {
        return <div className="flex items-center justify-center h-full text-gray-500">Output will appear here once generated.</div>
    }

    switch (activeTab) {
      case OutputTab.DIAGRAM:
        return <div ref={diagramContainerRef} className="h-full"><MermaidDiagram code={mermaidCode} /></div>;
      case OutputTab.MERMAID_CODE:
        return (
          <div className="relative h-full">
            <textarea 
              value={mermaidCode} 
              onChange={(e) => setMermaidCode(e.target.value)}
              className="w-full h-full p-3 bg-gray-900/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none font-mono text-sm text-gray-200"
            />
            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">
              {copySuccess ? 'Copied!' : <CopyIcon />}
            </button>
          </div>
        );
      case OutputTab.ANALYSIS:
        return (
          <div className="prose prose-invert p-4 bg-gray-800 rounded-lg h-full overflow-y-auto" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tab: OutputTab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${activeTab === tab ? 'bg-gray-800 text-cyan-300 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-300">2. Generated Output</h2>
        <div className="flex gap-2">
            <button onClick={handleDownloadSVG} className="btn-download" disabled={!mermaidCode}><DownloadIcon />SVG</button>
            <button onClick={() => downloadFile('diagram.md', getFullMarkdown(), 'text/markdown')} className="btn-download" disabled={!mermaidCode}><DownloadIcon />MD</button>
            <button onClick={() => downloadFile('diagram.mmd', mermaidCode, 'text/plain')} className="btn-download" disabled={!mermaidCode}><DownloadIcon />Mermaid</button>
        </div>
      </div>
      <div className="flex border-b border-gray-700">
        <TabButton tab={OutputTab.DIAGRAM} label="Diagram" />
        <TabButton tab={OutputTab.MERMAID_CODE} label="Mermaid Code" />
        <TabButton tab={OutputTab.ANALYSIS} label="Analysis" />
      </div>
      <div className="flex-grow bg-gray-800 rounded-b-lg overflow-hidden mt-[-1px]">
        {renderContent()}
      </div>
       <style>{`
        .btn-download {
          @apply flex items-center bg-gray-700 text-gray-300 text-xs font-semibold py-1 px-3 rounded-md hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
        }
      `}</style>
    </div>
  );
};

export default OutputPanel;
