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

    return (
        <Card className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                    <div className="mb-4 aspect-[2/1] relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        {company.logo ? (
                            company.logo.type === 'svg' ? (
                                <div
                                    className="h-full w-full p-2 svg"
                                    dangerouslySetInnerHTML={{
                                        __html: company.logo.content
                                    }}
                                />
                            ) : company.logo.type === 'img' ? (
                                <img
                                    src={company.logo.content}
                                    alt={`${company.name || 'Company'} logo`}
                                    className="w-full h-full object-scale-down"
                                    onError={(e) => e.target.parentElement.lastChild.className = 'text-3xl font-bold text-[#000040]'}
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#000040]">
                                    {(company.name || 'N/A').charAt(0)}
                                </span>
                            )
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#000040]">
                                {(company.name || 'N/A').charAt(0)}
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                        {company.name || 'Company Name Not Available'}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {company.about || 'Company description not available'}
                    </p>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                            Last updated: {formatDate(company.last_updated)}
                        </span>

                        <div className="flex space-x-2">
                            {company.url && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={company.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#000040] hover:text-black transition-colors duration-300"
                                            >
                                                <Globe className="h-5 w-5" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Visit website</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {company.linkedin_url && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={company.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#000040] hover:text-black transition-colors duration-300"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>View LinkedIn profile</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-[#000040] hover:bg-[#000060] text-white px-4 py-2 rounded-lg transition-all duration-300"
                        onClick={() => navigate(`/company/${encodeURIComponent(company.company_name)}`)}
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyCard;