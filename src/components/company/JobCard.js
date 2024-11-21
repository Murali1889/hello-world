import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Briefcase,
  ChevronUp,
  ChevronDown,
  MapPin,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showFullAnalytics, setShowFullAnalytics] = useState(false);
  
    const getRelativeTime = (dateString) => {
      try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
      } catch (error) {
        return dateString;
      }
    };
  
    const formatAnalyticPoints = (text) => {
      // Split the text into numbered points

      if(!text)
        return;
      const points = text.split(/(?=\d+\.\s)/).filter(Boolean);
      
      // If there are numbered points, take first 5, otherwise return original text
      if (points.length > 0) {
        return showFullAnalytics ? points.join(' ') : points.slice(0, 5).join(' ');
      }
      
      // Fallback for non-numbered text - show first 3 lines
      const lines = text.split('. ');
      return showFullAnalytics ? text : lines.slice(0, 3).join('. ') + '.';
    };
  
    return (
      <Card className="w-full h-full flex flex-col bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-[#1B365D]" />
                <CardTitle className="text-xl font-bold text-[#1B365D]">
                  {job?.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job?.location}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Posted: {getRelativeTime(job?.date)}
                </span>
              </CardDescription>
            </div>
            <Badge 
              variant="secondary" 
              className="text-xs h-6 bg-[#F8F9FC] text-[#1B365D]"
            >
              {job?.location.toLowerCase().includes('remote') ? 'Remote' : 'On-site'}
            </Badge>
          </div>
        </CardHeader>
  
        <CardContent className="flex-grow pt-4 p-6">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-[#1B365D] flex items-center gap-2">
              Strategic Analysis
            </h4>
            <div className="relative">
              <p className="text-sm text-[#4A4A4A] whitespace-pre-line">
                {formatAnalyticPoints(job?.analytic_points)}
              </p>
              {job?.analytic_points.split(/(?=\d+\.\s)/).length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullAnalytics(!showFullAnalytics)}
                  className="mt-2 text-[#1B365D] hover:text-[#FF8C69] p-0 h-auto"
                >
                  {showFullAnalytics ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </div>
          </div>
  
          <div className={`mt-4 transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>
            <h4 className="font-semibold mb-2 text-[#1B365D]">Key Requirements & Responsibilities</h4>
            <ul className="list-disc pl-5 space-y-2">
              {job?.summary?.map((point, index) => (
                <li key={index} className="text-sm text-[#4A4A4A]">
                  {point}
                </li>
              ))}
            </ul>
          </div>
  
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="mt-4 w-full hover:bg-[#F8F9FC] text-[#1B365D]"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  export default JobCard;
