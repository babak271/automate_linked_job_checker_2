
import React from 'react';

interface ProcessingStepProps {
  message: string;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ message }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-[#2C2C54] rounded-2xl shadow-2xl border border-blue-500/30 text-center">
      <div className="flex justify-center items-center mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Workflow in Progress</h2>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};
