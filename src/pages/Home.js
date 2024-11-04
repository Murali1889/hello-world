import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import CompanyCard from './CompanyCard';

export default function HomePage() {
  const { companies, loading } = useData();

  return (
    <div className="min-h-screen p-8 bg-white">
      <Navbar />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
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
        <div className="flex flex-wrap gap-6 mt-20">
        {companies.map((company) => (
          <div className="w-[calc(100%-1.5rem)] min-[720px]:w-[calc(50%-1.5rem)] min-[1080px]:w-[calc(33.33%-1.5rem)] min-w-[360px]">
            <CompanyCard
              key={company.company_name}
              company={company}
            />
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