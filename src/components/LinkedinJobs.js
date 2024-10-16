import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Loader } from 'lucide-react';
import axios from 'axios';

// Helper function to generate prompt for GPT
const generatePrompt = (jobData) => {
  let jobDetails = jobData.map(job => `- ${job.title} in ${job.location}`).join('\n');
  return `Here are the recent job postings for a company:\n${jobDetails}\n\nBased on these job roles, what does this hiring trend indicate about the company's plans? Please provide insights as bullet points prefixed by a # symbol for each point.`;
};

// Function to split GPT response into bullet points
const splitIntoBulletPoints = (insights) => {
  const sentences = insights.split(/#/).filter(sentence => sentence.trim() !== '');
  return sentences.map(sentence => sentence.trim());
};

// Function to replace job titles with hyperlinks
const replaceTitlesWithLinks = (insights, jobData) => {
  let bulletPoints = splitIntoBulletPoints(insights); // Ensure it's an array
  jobData.forEach(job => {
    const jobTitleRegex = new RegExp(job.title, 'g');
    bulletPoints = bulletPoints.map(point =>
      point.replace(
        jobTitleRegex,
        `<a href="${job.url}" target="_blank" class="text-indigo-600 dark:text-indigo-300 hover:underline">${job.title}</a>`
      )
    );
  });
  return bulletPoints;
};

// Main component
function LinkedinJobs() {
  const [linkedinJobs, setLinkedinJobs] = useState(JSON.parse(localStorage.getItem('linkedinJobs')) || []);
  const [gptInsights, setGptInsights] = useState(JSON.parse(localStorage.getItem('gptInsights')) || []); // Ensure initial state is an array
  const [loadingJobs, setLoadingJobs] = useState(!linkedinJobs.length); // Track job data loading
  const [loadingGPT, setLoadingGPT] = useState(!gptInsights.length); // Track GPT loading

  useEffect(() => {
    if (!linkedinJobs.length) {
      fetchLinkedinJobs();
    }
  }, []);

  const fetchLinkedinJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyMF96kj0reKSACaCcUsMNk4bnkFoHfywPzlq0RZGT4v6mulbpuF3-Qbwyqorx91Jej/exec?jobs=true&id=ID-1728895494800-306');
      const data = await response.json();
      setLinkedinJobs(data);
      localStorage.setItem('linkedinJobs', JSON.stringify(data));
      await fetchGptInsights(data);
    } catch (error) {
      console.error('Error fetching LinkedIn jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchGptInsights = async (jobData) => {
    setLoadingGPT(true);
    try {
      const prompt = generatePrompt(jobData);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', 
        {
          model: 'gpt-3.5-turbo',
          max_tokens: 500,
          n: 1,
          stop: null,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }]
        }, 
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const gptContent = response.data.choices[0].message.content;
      const formattedContent = replaceTitlesWithLinks(gptContent, jobData);

      // Set GPT insights as an array of bullet points
      setGptInsights(formattedContent);
      localStorage.setItem('gptInsights', JSON.stringify(formattedContent));
    } catch (error) {
      console.error('Error processing data with GPT:', error.message);
    } finally {
      setLoadingGPT(false);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem('linkedinJobs');
    localStorage.removeItem('gptInsights');
    setLinkedinJobs([]);
    setGptInsights([]);
    fetchLinkedinJobs();
  };

  return (
    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner backdrop-blur-md rounded-2xl border-0">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Hiring Analytics</h3>
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Refresh Data
          </button>
        </div>

        {(loadingJobs || loadingGPT) ? (
          <div className="flex justify-center items-center h-[150px]">
            <Loader className="animate-spin text-indigo-500 dark:text-indigo-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {gptInsights.length > 0 ? (
              <ul className="list-disc pl-5">
                {gptInsights.map((point, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ul>
            ) : (
              <p>No insights available. Please refresh the data.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LinkedinJobs;
