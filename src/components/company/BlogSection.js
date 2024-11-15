import { useState, useEffect } from 'react';
import { ExternalLink, ChevronRight, ChevronLeft, Newspaper, Briefcase, ChevronDown, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { formatDate } from 'date-fns';

const ITEMS_PER_PAGE = 5;


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

const BlogItem = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);


  const getSummaryPoints = (summary) => {
    if (!summary) return [];
    return summary.split('- ').map(point => point.trim()).filter(point => point.length > 0);
  };

  return (
    <div className="bg-white rounded-xl border border-[#000040]/10 overflow-hidden transition-all duration-300 hover:shadow-md mb-4 last:mb-0">
      <div className="group">
        <Collapsible>
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#000040] font-medium hover:text-black transition-colors line-clamp-1"
                >
                  {blog.title || blog.name}
                </a>
                {blog.date && (
                  <span className="text-sm text-gray-500 mt-1">
                    {formatDate(new Date(blog.date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>

              <CollapsibleTrigger
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-[#F0F1F9] rounded-full transition-colors"
              >
                <ChevronDown
                  className={`h-4 w-4 text-[#000040]/70 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                    }`}
                />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="mt-4 bg-[#F0F1F9] rounded-lg p-4">
                {blog.summary ? (
                  <ul className="space-y-3">
                    {getSummaryPoints(blog.summary).map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-[#000040] rounded-full shrink-0" />
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No summary available</p>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

const BlogSection = ({ company }) => {
  const [blogPage, setBlogPage] = useState(1);
  const [linkedinPage, setLinkedinPage] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(240); // 4 hours in minutes
  const [expandedItems, setExpandedItems] = useState({});
  const { blogs = [], linkedin_posts = [], linkedin_job_analytics = [] } = company;
  console.log(blogs.length)

  useEffect(() => {
    if (blogs.length === 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [blogs.length]);

  const formatTimeRemaining = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h`;
  };

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text, lines = 2) => {
    const words = text.split(' ');
    const truncated = words.slice(0, 20).join(' ');
    return words.length > 20 ? `${truncated}...` : text;
  };

  const NoBlogs = () => {
    const [timeRemaining, setTimeRemaining] = useState(240); // 4 hours in minutes

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="flex flex-col items-center justify-center py-2 px-4">
        {/* Icon Container */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#000040]/5 rounded-full animate-ping" />
            <div className="relative bg-[#F0F1F9] rounded-full p-6">
              <Clock className="w-12 h-12 text-[#000040]" />
            </div>
          </div>
        </div>

        {/* Update Timer */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#000040] mb-2">
            Update expected in
          </h2>
          <div className="inline-flex items-center justify-center bg-[#000040] text-white px-3 py-2 rounded-full">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">4h remaining</span>
          </div>
        </div>
      </div>
    );
  };

  const LinkedInEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#000040]/5 rounded-full animate-ping" />
          <div className="relative bg-[#F0F1F9] rounded-full p-4">
            <ExternalLink className="w-6 h-6 text-[#000040]" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#F0F1F9] px-4 py-2 rounded-full">
          <div className="w-1.5 h-1.5 bg-[#000040] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#000040]">Updating feed...</span>
        </div>
      </div>
    );
  };
  
  // Hiring Analytics Empty State Component
  const HiringEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#000040]/5 rounded-full animate-ping" />
          <div className="relative bg-[#F0F1F9] rounded-full p-4">
            <Briefcase className="w-6 h-6 text-[#000040]" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#F0F1F9] px-4 py-2 rounded-full">
          <div className="w-1.5 h-1.5 bg-[#000040] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#000040]">Processing analytics...</span>
        </div>
      </div>
    );
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-white border-none rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg md:col-span-2">
        <CardHeader className="bg-[#F0F1F9] p-4 border-b border-[#000040]/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-[#000040] flex items-center">
                <Newspaper className="w-5 h-5 mr-2" />
                Company Blogs
              </CardTitle>
              <span className="px-2.5 py-0.5 bg-[#000040] text-white text-xs rounded-full font-medium">
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
                  className="text-[#000040] hover:bg-[#000040]/10 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-[#000040] text-sm font-medium">
                  Page {blogPage} of {Math.ceil(blogs.length / ITEMS_PER_PAGE)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBlogPage(p => Math.min(Math.ceil(blogs.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={blogPage === Math.ceil(blogs.length / ITEMS_PER_PAGE)}
                  className="text-[#000040] hover:bg-[#000040]/10 disabled:opacity-50 transition-colors"
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
                <BlogItem key={index} blog={blog} />
              )}
            />
          ) : (
            <NoBlogs />
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Posts Card */}
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="bg-[#F0F1F9] p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-[#000040] flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                LinkedIn Feed
              </CardTitle>
              <span className="text-sm text-[#000040]">
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
                  className="text-[#000040] hover:bg-[#000040]/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-[#000040] text-sm">
                  Page {linkedinPage}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkedinPage(p => Math.min(Math.ceil(linkedin_posts.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={linkedinPage === Math.ceil(linkedin_posts.length / ITEMS_PER_PAGE)}
                  className="text-[#000040] hover:bg-[#000040]/10"
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
                    className="block p-3 rounded-lg hover:bg-[#F0F1F9] transition-all duration-300"
                  >
                    <h4 className="text-[#000040] group-hover:text-black transition-colors text-sm font-medium mb-1">
                      {post?.content?.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content
                      }
                    </h4>
                    <div className="text-gray-600 text-xs">
                      {post.date}
                    </div>
                  </a>
                </li>
              )}
            />
          ) : (
            <LinkedInEmptyState />
          )}
        </CardContent>
      </Card>

      {/* Hiring Analytics Card */}
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="bg-[#F0F1F9] p-4">
          <CardTitle className="text-[#000040] flex items-center">
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
                    <Badge className="bg-[#F0F1F9] text-[#000040] shrink-0 mt-1">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm">
                        {expandedItems[index] ? analytic : truncateText(analytic)}
                      </p>
                      {analytic.length > 100 && (
                        <Button
                          variant="ghost"
                          className="text-[#000040] hover:text-black p-0 h-auto text-sm mt-1"
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
            <HiringEmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSection;