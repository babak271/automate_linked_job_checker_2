
import React, { useState } from 'react';
import { CustomizedResult } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ResultCardProps {
  result: CustomizedResult;
}

const getScoreColor = (score: number) => {
    if (score > 85) return 'bg-green-500 text-green-900';
    if (score > 70) return 'bg-yellow-400 text-yellow-900';
    return 'bg-red-500 text-red-900';
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isCvCopied, setIsCvCopied] = useState(false);

  const handleCopyCV = () => {
    navigator.clipboard.writeText(result.analysis.customizedCV);
    setIsCvCopied(true);
    setTimeout(() => setIsCvCopied(false), 2000);
  };

  return (
    <div className="bg-[#2C2C54]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-500/20 overflow-hidden transition-all duration-300 hover:border-blue-500/50">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
                <h3 className="text-xl font-bold text-gray-100">{result.job.title}</h3>
                <p className="text-gray-400">{result.job.company} - {result.job.location}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center ${getScoreColor(result.analysis.matchScore)}`}>
                Match Score: {result.analysis.matchScore}%
            </div>
        </div>

        <div className="bg-black/20 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-200 mb-2">AI Analysis:</h4>
            <p className="text-gray-300 text-sm">{result.analysis.matchSummary}</p>
        </div>

        <div>
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-200">Customized CV for this Role:</h4>
                <button
                    onClick={handleCopyCV}
                    className="flex items-center gap-2 text-sm bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md transition-colors"
                >
                    <ClipboardIcon className="w-4 h-4" />
                    {isCvCopied ? 'Copied!' : 'Copy CV'}
                </button>
            </div>
            <div className="bg-[#1a1a2e] p-4 rounded-lg max-h-60 overflow-y-auto border border-gray-700">
                <pre className="text-gray-300 text-xs whitespace-pre-wrap font-sans">{result.analysis.customizedCV}</pre>
            </div>
        </div>
      </div>
      
      <div className="bg-black/20 px-6 py-3">
        <button
          onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
          className="w-full flex justify-between items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <span>View Original Job Description</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isDescriptionVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isDescriptionVisible && (
        <div className="p-6 border-t border-gray-700">
          <pre className="text-gray-400 text-sm whitespace-pre-wrap font-sans">{result.job.description}</pre>
        </div>
      )}
    </div>
  );
};
