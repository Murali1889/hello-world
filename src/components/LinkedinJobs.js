import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronRight } from 'lucide-react';

function LinkedinJobs() {
  const [linkedinJobs, setLinkedinJobs] = useState(null);

  useEffect(() => {
    fetchLinkedinJobs();
  }, []);

  const fetchLinkedinJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/company/signzy/linkedin-posts');
      const data = await response.json();
      setLinkedinJobs(data);
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
    }
  };

  return (
    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner backdrop-blur-md rounded-2xl border-0">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Hiring analytics</h3>
        <ScrollArea className="h-[250px] pr-4">
          <ul className="space-y-4">
            {(linkedinJobs || []).map((post, index) => (
              <li key={index} className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <a href="/" className="hover:underline text-gray-700 dark:text-gray-300">{post}</a>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default LinkedinJobs;
