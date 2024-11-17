import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, MapPin, ExternalLink, Globe, Clock, Info, Bell, BadgeCheck, Linkedin } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const formatDate = (dateString) => {
    if (!dateString) return 'Not Available';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    console.log(company)
    return (
        <Card className="bg-[#FFFFFF] rounded-lg overflow-hidden transition-all duration-300">
        <CardContent className="p-6">
          <div className="aspect-[4/1] relative mb-4 bg-[#F8F9FA] rounded-md overflow-hidden px-5 py-3">
            {company.logo ? (
              company.logo.type === 'svg' ? (
                <div
                  className="h-full w-full p-4 svg"
                  dangerouslySetInnerHTML={{
                    __html: company.logo.content
                  }}
                />
              ) : company.logo.type === 'img' ? (
                <img
                  src={company.logo.content}
                  alt={`${company.name} logo`}
                  className="object-contain w-full h-full p-4"
                //   onError={(e) => {
                //     e.target.style.display = 'none';
                //     e.target.nextSibling.style.display = 'flex';
                //   }}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[#1B365D]">
                  {(company.name || 'N/A').charAt(0)}
                </span>
              )
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[#1B365D]">
                {(company.name || 'N/A').charAt(0)}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[#1B365D]">
            {company.name || 'Company Name Not Available'}
          </h2>
          <p className="text-[#64748B] text-sm mb-2">{company.industry}</p>
          <p className="text-[#4A4A4A] text-sm line-clamp-3">
            {company.about || 'Company description not available'}
          </p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-[#6B7280]">
              Last updated: {formatDate(company.last_updated)}
            </span>
            <div className="flex gap-2">
              {company.url && (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-300"
                >
                  <Globe className="h-5 w-5 text-[#1B365D]" />
                </a>
              )}
              {company.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-300"
                >
                  <Linkedin className="h-5 w-5 text-[#1B365D]" />
                </a>
              )}
            </div>
          </div>
          <Button
            className="w-full bg-white hover:bg-[#E2E8F0] text-[#1B365D] border border-[#1B365D] transition-colors duration-300"
            variant="secondary"
            onClick={() => navigate(`/company/${encodeURIComponent(company.company_name)}`)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
};

export default CompanyCard;