import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../ui/button";

const CompanyHeader = ({ currentCompany, onBackClick }) => {
  if (!currentCompany) {
    return (
      <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
        Competitive Intel
      </h1>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBackClick}
        className="text-white hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      {currentCompany.logo ? (
        <img
          src={currentCompany.logo}
          alt={`${currentCompany.company_name} logo`}
          className="h-12 w-auto object-contain"
        />
      ) : (
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {currentCompany.company_name}
        </h1>
      )}
    </>
  );
};

export default CompanyHeader;