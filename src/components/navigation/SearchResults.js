import React from 'react';

const SearchResults = ({ companies, selectedIndex, onSelect, onMouseEnter }) => (
  <ul className="bg-white backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
    {companies.map((company, index) => (
      <li
        key={company.company_name}
        className={`px-4 py-3 cursor-pointer text-sm text-black border-b last:border-b-0 border-white/10
          ${selectedIndex === index ? 'bg-black/20' : 'hover:bg-black/10'}`}
        onClick={() => onSelect(company)}
        onMouseEnter={() => onMouseEnter(index)}
      >
        {company.company_name}
      </li>
    ))}
  </ul>
);

export default SearchResults;