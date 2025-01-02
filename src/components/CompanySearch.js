import React, { useState, useEffect, useRef } from 'react';
import { ChevronsUpDown, Check, Search } from 'lucide-react';

const CompanySearch = ({ companies = [], onCompanySelect, placeholder = "Select a company..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const dropdownRef = useRef(null);
  
  const filteredCompanies = companies.filter(company => 
    company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company) => {
    setSelectedCompany(company);
    setIsOpen(false);
    setSearchTerm('');
    if (onCompanySelect) {
      onCompanySelect(company);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        className="w-full px-4 py-2 text-left border rounded-md shadow-sm focus:outline-none  flex items-center justify-between"
      >
        <span className={`truncate text-sm ${selectedCompany?.name ? "":"text-gray-400"}`}>
          {selectedCompany?.name || placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Companies List */}
          <div className="max-h-60 overflow-auto">
            {filteredCompanies.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No companies found
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <button
                  key={company.key}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleSelect(company)}
                >
                  <span>{company.name}</span>
                  {selectedCompany?.key === company.key && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;