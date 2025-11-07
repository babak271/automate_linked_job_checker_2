
import React, { useState, useCallback } from 'react';
import { WorkflowStatus, CustomizedResult, JobDescription } from './types';
import { fetchJobsFromUrl, analyzeAndCustomize } from './services/geminiService';
import { InputStep } from './components/InputStep';
import { ProcessingStep } from './components/ProcessingStep';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [status, setStatus] = useState<WorkflowStatus>(WorkflowStatus.IDLE);
  const [processingMessage, setProcessingMessage] = useState('');
  const [results, setResults] = useState<CustomizedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async (url: string, cv: string) => {
    setStatus(WorkflowStatus.PROCESSING);
    setError(null);
    setResults([]);

    try {
      setProcessingMessage('Step 1/3: Generating relevant job listings...');
      const jobs = await fetchJobsFromUrl(url);

      if (!jobs || jobs.length === 0) {
        throw new Error("Could not find any jobs for the provided URL.");
      }
      
      const successfulResults: CustomizedResult[] = [];

      for (let i = 0; i < jobs.length; i++) {
        const job: JobDescription = jobs[i];
        setProcessingMessage(`Step 2/3: Analyzing & customizing CV for "${job.title}" (${i + 1}/${jobs.length})...`);
        const analysis = await analyzeAndCustomize(job, cv);

        if (analysis && analysis.matchScore >= 60) { // Filter for reasonably good matches
            successfulResults.push({ job, analysis });
        }
      }
      
      if (successfulResults.length === 0) {
         setError("No jobs with a strong enough skills match were found. Try a different search URL or update your CV.");
         setStatus(WorkflowStatus.ERROR);
         return;
      }

      setProcessingMessage('Step 3/3: Finalizing your application packages...');
      // A small delay to make the final step feel substantial
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setResults(successfulResults);
      setStatus(WorkflowStatus.DONE);

    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      setStatus(WorkflowStatus.ERROR);
    }
  }, []);
  
  const handleReset = () => {
    setStatus(WorkflowStatus.IDLE);
    setError(null);
    setResults([]);
  };

  const renderContent = () => {
    switch (status) {
      case WorkflowStatus.PROCESSING:
        return <ProcessingStep message={processingMessage} />;
      case WorkflowStatus.DONE:
      case WorkflowStatus.ERROR:
        return (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-center">
                    <h3 className="font-bold">Workflow Failed</h3>
                    <p>{error}</p>
                </div>
            )}
            {results.length > 0 && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-100">Workflow Complete!</h2>
                    <p className="text-gray-400 mt-2">Here are your customized job application packages.</p>
                </div>
            )}
            <div className="space-y-6">
              {results.map((result, index) => (
                <ResultCard key={index} result={result} />
              ))}
            </div>
            <div className="text-center pt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition">
                Start New Workflow
              </button>
            </div>
          </div>
        );
      case WorkflowStatus.IDLE:
      default:
        return <InputStep onStart={handleStart} isLoading={status === WorkflowStatus.PROCESSING} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full">
          {renderContent()}
      </div>
    </div>
  );
};

export default App;
