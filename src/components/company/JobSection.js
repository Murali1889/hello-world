import { useState, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";

const JobsSection = ({ linkedin_jobs = [] }) => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <Card className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)]">
      <CardHeader className="p-4 bg-[#F8F9FC] border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-[#1B365D] font-semibold text-base flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Job Openings
            </CardTitle>
            {linkedin_jobs.length > 0 && (
              <span className="bg-[#1B365D] text-white text-xs px-3 py-1 rounded-full font-medium">
                {linkedin_jobs.length} opening{linkedin_jobs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {linkedin_jobs.length > 1 && (
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
      <CardContent className="p-6 overflow-hidden">
        {linkedin_jobs.length > 0 ? (
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {linkedin_jobs.map((job, index) => (
              <div
                key={job.jobId || index}
                className="max-w-[730px] flex-shrink-0 snap-center pr-6 last:pr-0"
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="hiring" />
        )}
      </CardContent>
    </Card>
  );
};

// Add this CSS to your global styles or component
const ScrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default JobsSection;