import { useState } from 'react';
import { ExternalLink, ChevronRight, ChevronLeft, Newspaper, Briefcase, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const ITEMS_PER_PAGE = 5;

const getRandomMessage = (type) => {
  const messages = {
    blogs: [
      "Our blog writers are currently in a deep meditation... 🧘‍♂️",
      "The blogs are doing push-ups, getting stronger! 💪",
      "Content team is brainstorming over coffee ☕"
    ],
    linkedin: [
      "LinkedIn posts are taking a professional development day! 👔",
      "Posts are networking with other content... 🤝",
      "Building connections in the digital world... 🌐"
    ],
    jobs: [
      "Job analytics are crunching numbers... 🔢",
      "Hiring team is doing interview practice! 🎯",
      "Career opportunities loading... ⌛"
    ]
  };
  return messages[type][Math.floor(Math.random() * messages[type].length)];
};

const PaginatedContent = ({ data, currentPage, setCurrentPage, renderItem }) => {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <ul className="space-y-4">
      {currentItems.map((item, index) => renderItem(item, index))}
    </ul>
  );
};
const BlogItem = ({ blog, formatDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSummaryPoints = (summary) => {
    if (!summary) return [];
    // Split by hyphen and filter out empty strings
    return summary.split('- ').map(point => point.trim()).filter(point => point.length > 0);
  };

  const summaryPoints = blog.summary ? getSummaryPoints(blog.summary) : [];

  return (
    <li className="group border-b last:border-b-0">
      <Collapsible>
        <div className="py-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Title */}
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-800 font-medium group-hover:text-blue-600 transition-colors line-clamp-1"
            >
              {blog.title || blog.name}
            </a>
            
            {/* Date and Expand Button */}
            <div className="flex items-center gap-3 shrink-0">
              {blog.date && (
                <span className="text-gray-500 text-sm">
                  {(blog.date)}
                </span>
              )}
              <CollapsibleTrigger 
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
              >
                <ChevronDown 
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </CollapsibleTrigger>
            </div>
          </div>

        {/* Collapsible Summary */}
        <CollapsibleContent>
            <div className="mt-2 text-gray-600 text-sm bg-blue-50/50 p-3 rounded">
              {summaryPoints.length > 0 ? (
                <ul className="space-y-1">
                  {summaryPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No summary available</p>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </li>
  );
};
const BlogSection = ({ company }) => {
  const [blogPage, setBlogPage] = useState(1);
  const [linkedinPage, setLinkedinPage] = useState(1);
  const { blogs = [], linkedin_posts = [], linkedin_job_analytics = [] } = company;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const [expandedItems, setExpandedItems] = useState({});

  // Function to toggle expansion of individual items
  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to truncate text
  const truncateText = (text, lines = 2) => {
    const words = text.split(' ');
    const truncated = words.slice(0, 20).join(' '); // Approximate 2 lines
    return words.length > 20 ? `${truncated}...` : text;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Company Blogs Card */}
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg md:col-span-2">
        <CardHeader className="bg-blue-50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-blue-800 flex items-center">
                <Newspaper className="w-5 h-5 mr-2" />
                Company Blogs
              </CardTitle>
              <span className="text-sm text-blue-600">
                {blogs.length} post{blogs.length !== 1 ? 's' : ''}
              </span>
            </div>
            {blogs.length > ITEMS_PER_PAGE && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                  disabled={blogPage === 1}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-blue-600 text-sm">
                  Page {blogPage}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBlogPage(p => Math.min(Math.ceil(blogs.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={blogPage === Math.ceil(blogs.length / ITEMS_PER_PAGE)}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {blogs.length > 0 ? (
            <PaginatedContent
              data={blogs}
              currentPage={blogPage}
              setCurrentPage={setBlogPage}
              renderItem={(blog, index) => (
                <Collapsible key={index} className="w-full">
                  <BlogItem blog={blog} />
                </Collapsible>
              )}
            />
          ) : (
            <p className="text-center py-6 text-gray-500 italic">{getRandomMessage('blogs')}</p>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Posts Card */}
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="bg-blue-50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-blue-800 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                LinkedIn Feed
              </CardTitle>
              <span className="text-sm text-blue-600">
                {linkedin_posts.length} post{linkedin_posts.length !== 1 ? 's' : ''}
              </span>
            </div>
            {linkedin_posts && linkedin_posts.length > ITEMS_PER_PAGE && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkedinPage(p => Math.max(1, p - 1))}
                  disabled={linkedinPage === 1}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-blue-600 text-sm">
                  Page {linkedinPage}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkedinPage(p => Math.min(Math.ceil(linkedin_posts.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={linkedinPage === Math.ceil(linkedin_posts.length / ITEMS_PER_PAGE)}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {linkedin_posts.length > 0 ? (
            <PaginatedContent
              data={linkedin_posts}
              currentPage={linkedinPage}
              setCurrentPage={setLinkedinPage}
              renderItem={(post, index) => (
                <li key={index} className="group">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    <h4 className="text-blue-600 group-hover:text-blue-800 transition-colors text-sm font-medium mb-1">
                      {post?.content?.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content
                      }
                    </h4>
                    <div className="text-gray-500 text-xs">
                      {post.date}
                    </div>
                  </a>
                </li>
              )}
            />
          ) : (
            <p className="text-center py-6 text-gray-500 italic">{getRandomMessage('linkedin')}</p>
          )}
        </CardContent>
      </Card>

      {/* Hiring Analytics Card */}
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="bg-blue-50 p-4">
        <CardTitle className="text-blue-800 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Hiring Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {linkedin_job_analytics.length > 0 ? (
          <ul className="space-y-3">
            {linkedin_job_analytics.map((analytic, index) => (
              <li key={index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800 shrink-0 mt-1">
                    #{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">
                      {expandedItems[index] ? analytic : truncateText(analytic)}
                    </p>
                    {analytic.length > 100 && (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm mt-1"
                        onClick={() => toggleExpand(index)}
                      >
                        {expandedItems[index] ? 'Show less' : 'Show more'}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-6 text-gray-500 italic">
            {getRandomMessage('jobs')}
          </p>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default BlogSection;