import { useState } from "react";
import {
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Newspaper,
  Briefcase,
  ChevronDown,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 5;

const EmptyState = ({ type }) => {
  const states = {
    blogs: {
      icon: <Newspaper className="w-6 h-6 text-[#1B365D]" />,
      title: "Blog posts coming soon",
      message: "We're gathering the latest articles"
    },
    linkedin: {
      icon: <ExternalLink className="w-6 h-6 text-[#1B365D]" />,
      title: "LinkedIn feed updating",
      message: "Recent posts are being fetched"
    },
    hiring: {
      icon: <Briefcase className="w-6 h-6 text-[#1B365D]" />,
      title: "Hiring analytics loading",
      message: "Job market insights are being analyzed"
    }
  };

  const { icon, title, message } = states[type];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-[#1B365D]/5 rounded-full animate-ping" />
        <div className="bg-[#F8F9FC] p-3 rounded-full relative">
          {icon}
        </div>
      </div>

      <h3 className="text-[#1B365D] font-semibold mb-2">{title}</h3>
      <p className="text-[#6B7280] text-sm mb-4">{message}</p>

      <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-full">
        <Clock className="w-4 h-4 text-[#1B365D]" />
        <span className="text-sm text-[#1B365D]">Updating in 4h</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#FF8C69] rounded-full animate-pulse" />
        <span className="text-xs text-[#FF8C69]">Processing</span>
      </div>
    </div>
  );
};

const PaginatedContent = ({ data, currentPage, setCurrentPage, renderItem }) => {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <ul className="space-y-4">
      {currentItems.map((item, index) => renderItem(item, index))}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-[#1B365D] hover:text-[#FF8C69]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-[#1B365D] text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="text-[#1B365D] hover:text-[#FF8C69]"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </ul>
  );
};

const BlogItem = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSummaryPoints = (summary) => {
    if (!summary) return [];
    return summary
      .split("- ")
      .map((point) => point.trim())
      .filter((point) => point.length > 0);
  };

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Collapsible>
        <div className="p-4 border-b border-[#F0F0F0]">
          <div className="flex items-center justify-between">
            <div>
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B365D] font-semibold text-base hover:text-black transition-colors line-clamp-1"
              >
                {blog.title || blog.name}
              </a>
              {blog.date && (
                <div className="text-sm text-gray-500 mt-2">
                  {format(new Date(blog.date), "MMM d, yyyy")}
                </div>
              )}
            </div>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-[#F8F9FC] rounded-full transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="bg-[#F8F9FC] p-6">
            {blog.summary ? (
              <ul className="space-y-4">
                {getSummaryPoints(blog.summary).map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#1B365D] rounded-full flex-shrink-0 mt-1"></span>
                    <span className="text-sm text-[#4A4A4A]">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Summary is being processed...
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const BlogSection = ({ company }) => {
  const [blogPage, setBlogPage] = useState(1);
  const [linkedinPage, setLinkedinPage] = useState(1);
  const { blogs = [], linkedin_posts = [], linkedin_job_analytics = [] } = company;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Company Blogs */}
      <Card className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)] md:col-span-2">
        <CardHeader className="p-4 bg-[#F8F9FC] border-b border-[#F0F0F0]">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-[#1B365D] font-semibold text-base flex items-center">
                <Newspaper className="w-5 h-5 mr-2" />
                Company Blogs
              </CardTitle>
              {blogs.length > 0 && (
                <span className="bg-[#1B365D] text-white text-xs px-3 py-1 rounded-full font-medium">
                  {blogs.length} post{blogs.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {blogs.length > 0 ? (
            <PaginatedContent
              data={blogs}
              currentPage={blogPage}
              setCurrentPage={setBlogPage}
              renderItem={(blog, index) => <BlogItem key={index} blog={blog} />}
            />
          ) : (
            <EmptyState type="blogs" />
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Posts */}
      <Card className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)]">
  <CardHeader className="p-4 bg-[#F8F9FC] border-b border-[#F0F0F0]">
    <CardTitle className="text-[#1B365D] font-semibold text-base flex items-center">
      <ExternalLink className="w-5 h-5 mr-2" />
      LinkedIn Feed
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    {linkedin_posts.length > 0 ? (
      <PaginatedContent
        data={linkedin_posts}
        currentPage={linkedinPage}
        setCurrentPage={setLinkedinPage}
        renderItem={(post, index) => (
          <div key={index} className="bg-[#F8F9FC] p-4 rounded-lg hover:bg-[#E5E7EB] transition-colors">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1B365D] text-sm font-medium hover:text-[#FF8C69] line-clamp-2"
            >
              {post.content}
            </a>
            <p className="text-gray-600 text-xs mt-2">{post.date}</p>
          </div>
        )}
      />
    ) : (
      <EmptyState type="linkedin" />
    )}
  </CardContent>
</Card>

      {/* Hiring Analytics */}
      <Card className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)]">
        <CardHeader className="p-4 bg-[#F8F9FC] border-b border-[#F0F0F0]">
          <CardTitle className="text-[#1B365D] font-semibold text-base flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Hiring Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {linkedin_job_analytics.length > 0 ? (
            <ul className="space-y-4">
              {linkedin_job_analytics.map((analytic, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge className="bg-[#F8F9FC] text-[#1B365D] px-3 py-1 rounded-full text-xs font-medium">
                    #{index + 1}
                  </Badge>
                  <span className="text-sm text-[#4A4A4A]">{analytic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState type="hiring" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSection;