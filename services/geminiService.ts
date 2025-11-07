
import { GoogleGenAI, Type } from "@google/genai";
import { JobDescription, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const jobSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      company: { type: Type.STRING },
      location: { type: Type.STRING },
      description: { type: Type.STRING, description: 'A detailed job description, at least 200 words.' },
    },
    required: ["title", "company", "location", "description"],
  },
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.INTEGER, description: 'The match score from 0 to 100.' },
        matchSummary: { type: Type.STRING, description: 'A paragraph summarizing the analysis.' },
        customizedCV: { type: Type.STRING, description: 'The full text of the customized CV.' }
    },
    required: ['matchScore', 'matchSummary', 'customizedCV']
};

export const fetchJobsFromUrl = async (url: string): Promise<JobDescription[]> => {
  const prompt = `
    Based on this LinkedIn job search URL, please generate a list of 3 realistic, distinct, and detailed job descriptions.
    The jobs should be relevant to the keywords and filters likely present in the URL.
    For example, if the URL contains "senior-react-developer", create job descriptions for that role.
    Ensure each job description is comprehensive and at least 200 words long.

    URL: "${url}"

    Return the list as a JSON array that conforms to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: jobSchema,
      }
    });

    const jsonText = response.text.trim();
    const jobs = JSON.parse(jsonText) as JobDescription[];
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from Gemini:", error);
    throw new Error("Failed to generate job listings. The provided URL might be invalid or the service is unavailable.");
  }
};


export const analyzeAndCustomize = async (job: JobDescription, userCV: string): Promise<AnalysisResult> => {
    const prompt = `
    You are an expert career coach and CV writer.
    Given the user's CV and a job description, your task is to analyze the fit and customize the CV to maximize the chances of getting an interview.

    **User's CV:**
    ---
    ${userCV}
    ---

    **Job Description:**
    ---
    Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Description:
    ${job.description}
    ---

    **Your Tasks:**

    1.  **Analyze Fit:**
        *   Rate the match between the CV and the job description on a scale from 0 to 100.
        *   Provide a brief, one-paragraph summary explaining your rating, highlighting key strengths and potential gaps.

    2.  **Customize CV:**
        *   Rewrite the user's CV to be highly tailored for this specific job.
        *   Focus on rephrasing the professional summary and key achievements in the experience section to mirror the language and priorities of the job description.
        *   Do NOT invent new experiences. Only reframe existing ones.
        *   The output should be the full text of the customized CV, ready to be copied and pasted.

    Please provide your response in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as AnalysisResult;
        return result;
    } catch(error) {
        console.error("Error analyzing and customizing CV:", error);
        throw new Error(`Failed to analyze the job: "${job.title}".`);
    }
};
