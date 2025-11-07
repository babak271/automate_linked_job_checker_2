
import React, { useState } from 'react';
import { LinkedInIcon } from './icons/LinkedInIcon';

interface InputStepProps {
  onStart: (url: string, cv: string) => void;
  isLoading: boolean;
}

const defaultCV = `John Doe
Senior Frontend Developer
j.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

---
Professional Summary
---
Results-driven Senior Frontend Developer with 8+ years of experience in creating responsive, high-performance web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about building intuitive user interfaces and collaborating in agile environments to deliver high-quality software.

---
Skills
---
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3/SASS
- Frameworks/Libraries: React, Next.js, Redux, Zustand, React Query, Tailwind CSS, D3.js
- Tools: Webpack, Vite, Babel, Git, Docker, Jest, Cypress, Figma

---
Experience
---
Tech Solutions Inc. | Senior Frontend Developer | 2018 - Present
- Led the development of a new customer-facing dashboard using React and TypeScript, resulting in a 30% increase in user engagement.
- Architected and implemented a reusable component library, reducing development time for new features by 25%.
- Mentored junior developers, conducting code reviews and promoting best practices for clean, scalable code.

Innovate Co. | Frontend Developer | 2015 - 2018
- Developed and maintained features for a large-scale e-commerce platform using React and Redux.
- Collaborated with UX/UI designers to translate wireframes into pixel-perfect, responsive web pages.
- Improved application performance by optimizing component rendering and state management, leading to a 40% reduction in load times.
`;

export const InputStep: React.FC<InputStepProps> = ({ onStart, isLoading }) => {
  const [url, setUrl] = useState('https://www.linkedin.com/jobs/search/?keywords=senior%20react%20developer');
  const [cv, setCv] = useState(defaultCV);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && cv.trim()) {
      onStart(url, cv);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-[#2C2C54] rounded-2xl shadow-2xl border border-blue-500/30">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">AI Job Application Assistant</h2>
      <p className="text-center text-gray-400 mb-8">Enter a LinkedIn job search URL and your CV to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn Job Search URL
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LinkedInIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="linkedin-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/search/?keywords=..."
              className="w-full bg-[#1a1a2e] border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="user-cv" className="block text-sm font-medium text-gray-300 mb-2">
            Your Current CV / Skills
          </label>
          <textarea
            id="user-cv"
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            rows={12}
            className="w-full bg-[#1a1a2e] border border-gray-600 rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
            placeholder="Paste your CV here..."
            required
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            {isLoading ? 'Processing...' : 'Start Automation'}
          </button>
        </div>
      </form>
    </div>
  );
};
