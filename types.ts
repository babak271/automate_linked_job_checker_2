
export interface JobDescription {
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface AnalysisResult {
  matchScore: number;
  matchSummary: string;
  customizedCV: string;
}

export interface CustomizedResult {
  job: JobDescription;
  analysis: AnalysisResult;
}

export enum WorkflowStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}
