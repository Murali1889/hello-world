import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from "../ui/input";
import SearchResults from './SearchResults';

const SearchBar = ({ companies }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  const filteredCompanies = companies?.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!filteredCompanies.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsListVisible(true);
        setSelectedIndex(prev =>
          prev < filteredCompanies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          const selected = filteredCompanies[selectedIndex];
          navigate(`/company/${encodeURIComponent(selected.company_name)}`);
          setIsListVisible(false);
          setSearchTerm('');
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsListVisible(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex w-[300px] items-center gap-4 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
        <Search className="ml-2 h-5 w-5 text-white" />
        <Input
          type="search"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsListVisible(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsListVisible(true)}
          onKeyDown={handleKeyDown}
          className="h-8 border-none bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0"
        />
      </div>

      {isListVisible && searchTerm && filteredCompanies.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <SearchResults
            companies={filteredCompanies}
            selectedIndex={selectedIndex}
            onSelect={(company) => {
              navigate(`/company/${encodeURIComponent(company.company_name)}`);
              setIsListVisible(false);
              setSearchTerm('');
            }}
            onMouseEnter={setSelectedIndex}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;