import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, MapPin, ExternalLink, Globe, Clock, Info, Bell } from "lucide-react";
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

    return (
        <Card className="overflow-hidden bg-white shadow-md transition-all hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-[150px] rounded-lg p-2 flex-shrink-0 overflow-hidden bg-[#DE85AD]">
                            {company.logo ? (
                                company.logo.type === 'svg' ? (
                                    <div
                                        className="h-full svg w-full p-2"
                                        dangerouslySetInnerHTML={{
                                            __html: company.logo.content
                                        }}
                                    />
                                ) : company.logo.type === 'img' ? (
                                    <img
                                        src={company.logo.content}
                                        alt={`${company.name || 'Company'} logo`}
                                        className="h-full w-full object-contain"
                                        onError={(e) => e.target.parentElement.lastChild.className = 'text-3xl font-bold text-white/70'}
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#DE85AD]">
                                        {(company.name || 'N/A').charAt(0)}
                                    </span>
                                )
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#DE85AD]">
                                    {(company.name || 'N/A').charAt(0)}
                                </span>
                            )}
                        </div>

                        <div className='flex flex-col items-left justify-center gap-[10px]'>
                            <h2 className="text-xl ml-1 font-semibold text-gray-800">
                                {company.name || 'Company Name Not Available'}
                            </h2>
                         
                            <div className="ml-[3px] flex items-center gap-3">
                                {company.url && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={`${company.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-rose-600 hover:underline hover:text-rose-700"
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    Website
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                               
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}


                                {company.linkedin_url && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={`${company.linkedin_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-rose-600 hover:underline hover:text-rose-700"
                                                >
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                    LinkedIn
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {/* <p>View on LinkedIn</p> */}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <Badge variant="secondary" className="bg-[#DE85AD]/10 text-[#B44F7E]">
                        <Building2 className="mr-1 h-4 w-4" />
                        {company.sector || 'Sector N/A'}
                    </Badge> */}
                </div>

                <div className="mt-6 text-sm text-gray-600">
                    <p className="line-clamp-2">
                        {company.about || 'Company description not available'}
                    </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                {/* <div className="flex items-center gap-2 ml--">
                                <MapPin className="h-5 w-5 text-[#B44F7E]" />
                                <div>
                                    <p className="text-[12px] font-semibold text-gray-700">
                                        {company.location || 'Location Not Available'}
                                    </p>
                                </div>
                            </div> */}

                </div>

                <div className="mt-4 flex items-center justify-end">
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Last updated: {formatDate(company.last_updated)}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="p-4">
                <Button
                    variant="default"
                    className="w-full h-full text-rose-600 hover:text-rose-700 border border-rose-100 hover:bg-rose-50 cursor-pointer shadow-none"
                    onClick={() => navigate(`/company/${encodeURIComponent(company.company_name)}`)}
                >
                    <Info className="mr-2 h-4 w-4" />
                    View Full Company Profile
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CompanyCard;