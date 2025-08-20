
import React, { useEffect, useRef, useState, useId } from 'react';

interface MermaidDiagramProps {
  code: string;
}

declare global {
    interface Window {
        mermaid: any;
    }
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId();

  useEffect(() => {
    if (!mermaidRef.current || !code) return;

    const renderDiagram = async () => {
        try {
            setError(null);
            const { svg } = await window.mermaid.render(uniqueId, code);
            if (mermaidRef.current) {
                mermaidRef.current.innerHTML = svg;
            }
        } catch (err: any) {
            console.error("Mermaid rendering error:", err);
            setError(err.message || 'Failed to render diagram. Please check the Mermaid syntax.');
            if (mermaidRef.current) {
                mermaidRef.current.innerHTML = '';
            }
        }
    };
    
    renderDiagram();

  }, [code, uniqueId]);

  return (
    <div className="w-full h-full p-4 overflow-auto bg-gray-800 rounded-lg">
      {error ? (
        <div className="text-red-400 p-4 border border-red-500/50 rounded-md bg-red-900/20">
            <h3 className="font-bold mb-2">Diagram Render Error</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre>
        </div>
      ) : (
        <div ref={mermaidRef} className="mermaid-container flex justify-center items-center min-h-full">
            {!code && <p className="text-gray-500">Diagram will be rendered here.</p>}
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;
