import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader } from 'react-feather';

export default function ProfileTab({ companyData, loading, error }) {

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // Utility function to split text by \n and render paragraphs
    const renderParagraphs = (text) => {
        if (typeof text !== 'string') {
            return <p>{text}</p>; // Fallback in case the input is not a string
        }

        return text.split('\\n\\n').map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph.trim()}</p>
        ));
    };

    if (loading) {
        return (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl border-0">
                <CardContent className="p-6 flex justify-center items-center">
                    <Loader className="animate-spin h-10 w-10 text-indigo-500" />
                    <span className="ml-3 text-indigo-500">Loading...</span>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl border-0">
                <CardContent className="p-6 text-red-500">
                    {error}
                </CardContent>
            </Card>
        );
    }

    if (!companyData) {
        return (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl border-0">
                <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                    No data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl border-0 h-full">
            <CardContent className="p-6 h-full overflow-y-auto">
                <div className='text-[3rem] py-3'>{companyData.company_name}</div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Company Logo */}
                    <Card className="bg-white p-2 rounded-2xl col-span-1 h-[300px]">
                        <CardContent className="p-0 flex justify-center items-center">
                            <Avatar className="h-[300px] w-[300px] rounded-2xl">
                                <AvatarImage src={companyData.company_image_url} className="h-full w-full object-contain" alt="Company Logo" />
                            </Avatar>
                        </CardContent>
                    </Card>

                    {/* Company About */}
                    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner rounded-xl border-0 col-span-1">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-2">About</h3>
                            <div className="text-gray-700 dark:text-gray-300">
                                {renderParagraphs(companyData.about)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clients */}
                    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner rounded-xl border-0 col-span-1">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-2">All Clients</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {companyData.clients.map((client) => (
                                    <Button key={client} variant="outline" className="h-12 bg-white/50 hover:bg-indigo-100 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 rounded-xl transition-all">
                                        {capitalizeFirstLetter(client)}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card className="bg-indigo-50/50 dark:bg-gray-700/50 shadow-inner rounded-xl border-0 col-span-1">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-2">What is the Product?</h3>
                            <div className="text-gray-700 dark:text-gray-300">
                                {renderParagraphs(companyData.details)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}
