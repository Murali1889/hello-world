import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Lightbulb, ChevronUp, ChevronDown } from 'lucide-react';

const StrategicAnalysis = ({ analyticPoints }) => {
  const [showFullAnalytics, setShowFullAnalytics] = useState(false);

  return (
    <div className="mb-4">
      <div className="bg-amber-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Lightbulb className="w-6 h-6 text-amber-500 mr-2 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#1B365D] mb-2">
              Strategic Analysis
            </h3>
            <div className="relative">
              <p className={`text-sm text-[#4A4A4A] whitespace-pre-line ${
                !showFullAnalytics ? 'line-clamp-6' : ''
              }`}>
                {analyticPoints}
              </p>
              {analyticPoints?.split(/(?=\d+\.\s)/).length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullAnalytics(!showFullAnalytics)}
                  className="mt-2 text-[#1B365D] hover:text-[#FF8C69] p-0 h-auto flex items-center"
                >
                  {showFullAnalytics ? (
                    <>
                      Show less
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show more
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicAnalysis;