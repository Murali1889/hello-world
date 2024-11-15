import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import CompanyCard from './CompanyCard';
import { useState } from 'react';

export default function HomePage() {
  const { companies, loading } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Calculate pagination values
  const totalPages = Math.ceil(companies.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCompanies = companies.slice(indexOfFirstCard, indexOfLastCard);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the cards section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <Navbar />

      {!loading && companies.length > 0 && (
        <div className="flex justify-between items-center mb-8 mt-[150px]">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, companies.length)} of {companies.length} companies
          </div>
          <div className="flex items-center space-x-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#000040] hover:bg-[#000040]/10'
                }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((number, index) => (
              number === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">•••</span>
              ) : (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(number)}
                  className={`w-9 h-9 rounded-lg font-medium transition-all duration-200 ${currentPage === number
                      ? 'bg-[#000040] text-white hover:bg-[#000040]/90 shadow-sm'
                      : 'text-[#000040] hover:bg-[#000040]/10'
                    }`}
                >
                  {number}
                </Button>
              )
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#000040] hover:bg-[#000040]/10'
                }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="animate-pulse bg-white">
              <CardHeader className="bg-blue-50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-200 rounded-lg" />
                  <div className="h-6 w-32 bg-blue-200 rounded" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {currentCompanies.map((company) => (
            <div key={company.company_name} className="w-[calc(100%-1.5rem)] min-[720px]:w-[calc(50%-1.5rem)] min-[1080px]:w-[calc(33.33%-1.5rem)] min-w-[360px]">
              <CompanyCard company={company} />
            </div>
          ))}
          {companies.length === 0 && (
            <div className="w-full min-h-[200px] flex items-center justify-center text-gray-600">
              <p className="text-lg font-medium">No companies found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}