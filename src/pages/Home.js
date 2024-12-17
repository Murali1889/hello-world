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
    <div className="min-h-screen p-8 bg-[#F5F5F0] ">
      <Navbar />



      {loading ? (
        <div className="flex flex-wrap m-auto mt-[50px] mx-[-12px]">
          <div className="w-full px-[12px]">
            <div className="flex flex-wrap -mx-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="px-3 w-full min-[720px]:w-1/2 min-[1080px]:w-1/3 min-w-[360px] mb-6">
                  <Card className="animate-pulse bg-white">
                    <CardHeader className="bg-blue-50 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-200 rounded-lg" />
                        <div className="h-6 w-32 bg-blue-200 rounded" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full" />
                          <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full" />
                          <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full" />
                          <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap m-auto mt-[50px] mx-[-12px]">
          <div className="w-full px-[12px]">
            <div className="flex flex-wrap -mx-3">
              {currentCompanies
                .map((company) => (
                  <div key={company.company_name} className="px-3 w-full min-[720px]:w-1/2 min-[1080px]:w-1/3 min-w-[360px] mb-6">
                    <CompanyCard company={company} />
                  </div>
                ))}
              {companies.length === 0 && (
                <div className="w-full min-h-[200px] flex items-center justify-center text-gray-600">
                  <p className="text-lg font-medium">No companies found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && companies.length > 0 && (
        <div className="flex justify-center gap-[30px] items-center mt-4">
          <Button
            variant="outline"
            className="bg-white text-[#1B365D] border-[#64748B]/20 hover:bg-[#F1F5F9] transition-colors duration-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2 text-[#1B365D]" />
            Previous
          </Button>
          <span className="text-[#64748B]">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            className="bg-white text-[#1B365D] border-[#64748B]/20 hover:bg-[#F1F5F9] transition-colors duration-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2 text-[#1B365D]" />
          </Button>
        </div>
      )}
    </div>
  );
}