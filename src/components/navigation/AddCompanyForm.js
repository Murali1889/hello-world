import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

const AddCompanyForm = ({ onSubmit, isSubmitting }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(websiteUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label 
          htmlFor="websiteUrl"
          className="text-sm font-medium text-gray-700"
        >
          Website URL
        </Label>
        <div className="relative">
          <Globe className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            type="url"
            placeholder="https://example.com"
            className="pl-8 w-full border border-gray-200 focus:border-[#000040] focus:ring-1 focus:ring-[#000040] rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full relative bg-gradient-to-r from-[#1E3A8A] to-[#00002B] hover:from-[#00002B] hover:to-[#1E3A8A] text-white py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-70"
        disabled={isSubmitting || !websiteUrl}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Add Company'
        )}
      </Button>
    </form>
  );
};

export default AddCompanyForm;