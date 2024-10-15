import React from 'react';
import { Card, CardContent } from "../ui/card";
import BlogPosts from '../BlogPosts'; // Import the BlogPosts component
import LinkedInPosts from '../LinkedInPosts'; // Import the LinkedInPosts component

export default function PulseTab() {
  return (
    <Card className="backdrop-blur-md shadow-xl rounded-2xl border-0">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6"> {/* BlogPosts takes full width */}
          <BlogPosts /> {/* Render BlogPosts component */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* LinkedIn and Jobs side by side */}
          <LinkedInPosts /> {/* Placeholder for LinkedIn posts */}
          <LinkedInPosts /> {/* Placeholder for jobs (you can replace this later) */}
        </div>
      </CardContent>
    </Card>
  );
}
