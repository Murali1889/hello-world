// pages/CompanyDetails.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, ArrowLeft } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { useData } from '../context/DataContext';
import { useDashboard } from '../context/DashboardContext';
import AboutSection from '../components/company/AboutSection';
import ProductSection from '../components/company/ProductSection';
import BlogSection from '../components/company/BlogSection';
import Navbar from '../components/Navbar';

export default function CompanyDetailsPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { companies, loading, error } = useData();
  const { isDarkMode, setIsDarkMode } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [company, setCompany] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      // Format relative time
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 30) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } else if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      } else {
        return 'Just now';
      }
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (companies && companies.length > 0) {
      const foundCompany = companies.find(c =>
        c.company_name.toLowerCase() === decodeURIComponent(name).toLowerCase()
      );
      setCompany(foundCompany);
    }
  }, [companies, name]);

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-slate-100';
  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';

  if (loading) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${bgColor} ${textColor}`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${bgColor} ${textColor}`}>
        Error: {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className={`min-h-screen p-8 flex flex-col items-center justify-center ${bgColor} ${textColor}`}>
        <h2 className="text-2xl font-semibold mb-4">Company not found</h2>
        <Button onClick={() => navigate('/')} variant="outline">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-300 ${bgColor} ${textColor}`}>

      <Navbar />
      <Tabs defaultValue="profile" className="space-y-8 mt-[70px]">
        <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <TabsTrigger
            value="profile"
            className={isDarkMode ? 'data-[state=active]:bg-slate-700 text-slate-100' : 'data-[state=active]:bg-white text-slate-900'}
          >
            Company Profile
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className={isDarkMode ? 'data-[state=active]:bg-slate-700 text-slate-100' : 'data-[state=active]:bg-white text-slate-900'}
          >
            Product Portfolio
          </TabsTrigger>
          <TabsTrigger
            value="pulse"
            className={isDarkMode ? 'data-[state=active]:bg-slate-700 text-slate-100' : 'data-[state=active]:bg-white text-slate-900'}
          >
            Company Pulse
          </TabsTrigger>
        </TabsList>

       <div className='flex justify-between'>
        <div className='text-3xl font-bold text-blue-800 w-full'>{company.name}</div>
       <div className='w-full justify-end text-end'>Last Updated: {formatDate(company.last_updated)}</div>
       </div>


        <TabsContent value="profile">
          <AboutSection company={company} isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="portfolio">
          <ProductSection products={company.products} isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="pulse">
          <div className="grid grid-cols-1 gap-8">
            <BlogSection company={company} isDarkMode={isDarkMode} />
            {/* LinkedIn and Hiring sections can be added here later */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}