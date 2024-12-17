import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Briefcase, ChevronLeft, ChevronRight, Newspaper, ExternalLink, Clock, AlertCircle } from "lucide-react";
import JobCard from "./JobCard";

const JobsSection = ({ linkedin_jobs = [] }) => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToCard = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth;
    const newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, linkedin_jobs.length - 1)
      : Math.max(currentIndex - 1, 0);

    container.scrollTo({
      left: cardWidth * newIndex,
      behavior: 'smooth'
    });
    setCurrentIndex(newIndex);
  };

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

  return (
    <Card className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)]">
      <CardHeader className="p-4 bg-[#F8F9FC] border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-[#1B365D] font-semibold text-base flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Job Openings
            </CardTitle>
            {(typeof linkedin_jobs !== 'string' && linkedin_jobs.length > 0) && (
              <span className="bg-[#1B365D] text-white text-xs px-3 py-1 rounded-full font-medium">
                {linkedin_jobs.length} opening{linkedin_jobs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {(typeof linkedin_jobs !== 'string' && linkedin_jobs.length > 1) && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollToCard('prev')}
                disabled={currentIndex === 0}
                className="w-8 h-8 rounded-full hover:bg-[#E5E7EB] disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 text-[#1B365D]" />
              </Button>
              <span className="text-sm text-[#1B365D]">
                {currentIndex + 1} / {linkedin_jobs.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollToCard('next')}
                disabled={currentIndex === linkedin_jobs.length - 1}
                className="w-8 h-8 rounded-full hover:bg-[#E5E7EB] disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 text-[#1B365D]" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        {typeof linkedin_jobs === 'string' ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-[#1B365D]/5 rounded-full animate-ping" />
              <div className="bg-[#F8F9FC] p-3 rounded-full relative">
                <AlertCircle className="w-6 h-6 text-[#1B365D]" />
              </div>
            </div>

            <h3 className="text-[#1B365D] font-semibold mb-2">Currently No Open Positions</h3>
            <p className="text-[#6B7280] text-sm mb-4">The company hasn't published any job opportunities at the moment</p>

            <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-[#1B365D]" />
              <span className="text-sm text-[#1B365D]">Stay tuned for future openings</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF8C69] rounded-full animate-pulse" />
              <span className="text-xs text-[#FF8C69]">We'll notify you when new positions are posted</span>
            </div>
          </div>
        ) : linkedin_jobs.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {linkedin_jobs.map((job, index) => (
              <div
                key={job?.jobId || index}
                className="w-full flex-[0_0_100%] snap-start p-6"
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState type="hiring" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const styles = `
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

export default JobsSection;