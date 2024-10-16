import React, {useState} from 'react';
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronRight, ChevronDown, Loader } from 'lucide-react'; // Importing Loader from lucide-react

// Utility function to format date into a readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function BlogPosts({ blogPostsData, loading }) {
  const [expandedPost, setExpandedPost] = useState(null); // Track which post is expanded

  const formatSummary = (summary) => {
    return summary
      .split('\n')
      .filter(point => point.trim() !== '') // Filter out empty lines
      .map((point, index) => <li key={index}>{point.replace(/^-/, '').trim()}</li>); // Remove leading "-" and trim the text
  };

  return (
    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner backdrop-blur-md rounded-2xl border-0 h-full">
      <CardContent className="p-6 space-y-6 h-full">
        <h3 className="text-lg font-semibold mb-4 text-white">Company Blogs</h3>
        {loading ? (
          <div className="flex items-center justify-center h-96"> {/* Fixed height for centering */}
            <Loader className="animate-spin text-gray-500 dark:text-gray-300 h-8 w-8" /> {/* Animated Loader icon */}
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <ul className="space-y-4">
              {blogPostsData?.map((post, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedPost(expandedPost === index ? null : index)}>
                    <div className="flex items-center space-x-2">
                      {expandedPost === index ? (
                        <ChevronDown className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      )}
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-300 font-semibold text-lg">
                        {post.title}
                      </a>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(post.date)}</span> {/* Date is aligned to the right */}
                  </div>
                  {expandedPost === index && (
                    <div className="pl-10 mt-2">
                      <h4 className="font-medium text-gray-600 dark:text-gray-400 mb-2">Summary:</h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        {formatSummary(post.summary)}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default BlogPosts;
