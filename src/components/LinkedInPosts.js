import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader } from 'lucide-react';

function LinkedInPosts() {
  const [linkedInPosts, setLinkedInPosts] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    fetchLinkedInPosts();
  }, []);

  const fetchLinkedInPosts = async () => {
    setLoading(true); // Set loading state to true when fetching starts
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyMF96kj0reKSACaCcUsMNk4bnkFoHfywPzlq0RZGT4v6mulbpuF3-Qbwyqorx91Jej/exec?posts=true&id=ID-1728895494800-306');
      const data = await response.json();
      setLinkedInPosts(data);
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching is complete
    }
  };

  // Function to truncate the title
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner backdrop-blur-md rounded-2xl border-0">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Top LinkedIn Feed</h3>
        {loading ? (
          <div className="flex justify-center items-center h-[250px]">
            <Loader className="animate-spin text-indigo-500 dark:text-indigo-400" />
          </div>
        ) : (
          <ScrollArea className="h-[250px] pr-4">
            <ul className="space-y-4">
              {(linkedInPosts || []).map((post, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium text-indigo-600 dark:text-indigo-300 "
                    >
                      Post {index + 1}: {truncateTitle(post.title, 50)}
                    </a>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default LinkedInPosts;
