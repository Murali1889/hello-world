// pages/CompanyDetails.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Building,
  Activity,
  Briefcase,
  Zap,
  Users
} from "lucide-react";
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
      console.log(foundCompany)
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
    <div className="min-h-screen p-8">
      <Navbar isCompany={true} />
      {/* Company Header */}
      <div className="flex justify-between items-center mb-6 mt-[50px]">
        <h1 className="text-3xl font-bold text-[#1B365D]">{company.name}</h1>
        <span className="text-sm text-[#6B7280]">Last Updated: <span className='text-[#4A4A4A]'>{formatDate(company.last_updated)}</span></span>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="profile" className="space-y-8">
  {/* Tabs Navigation */}
  <TabsList className="w-full bg-white border-b border-[#E5E7EB] shadow-sm">
    <TabsTrigger
      value="profile"
      className="flex-1 py-2 rounded-none text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-[#F8F9FC] hover:text-[#1B365D] data-[state=active]:text-[#1B365D] data-[state=active]:border-b-2 data-[state=active]:border-[#FF8C69] data-[state=active]:font-semibold"
    >
      <Building className="w-4 h-4 mr-2 text-gray-500 data-[state=active]:text-[#1B365D]" />
      Company Profile
    </TabsTrigger>
    <TabsTrigger
      value="portfolio"
      className="flex-1 py-2 rounded-none text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-[#F8F9FC] hover:text-[#1B365D] data-[state=active]:text-[#1B365D] data-[state=active]:border-b-2 data-[state=active]:border-[#FF8C69] data-[state=active]:font-semibold"
    >
      <Package className="w-4 h-4 mr-2 text-gray-500 data-[state=active]:text-[#1B365D]" />
      Product Portfolio
    </TabsTrigger>
    <TabsTrigger
      value="pulse"
      className="flex-1 py-2 rounded-none text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-[#F8F9FC] hover:text-[#1B365D] data-[state=active]:text-[#1B365D] data-[state=active]:border-b-2 data-[state=active]:border-[#FF8C69] data-[state=active]:font-semibold"
    >
      <Activity className="w-4 h-4 mr-2 text-gray-500 data-[state=active]:text-[#1B365D]" />
      Company Pulse
    </TabsTrigger>
  </TabsList>

  {/* Tabs Content */}
  <div className="space-y-8">
    {/* Profile Tab */}
    <TabsContent value="profile">
      <div className="bg-[#F8F9FC] p-6 rounded-lg border border-[#E5E7EB]">
        <AboutSection company={company} isDarkMode={isDarkMode} />
      </div>
    </TabsContent>

    {/* Portfolio Tab */}
    <TabsContent value="portfolio">
      <div className="bg-[#F8F9FC] p-6 rounded-lg border border-[#E5E7EB]">
        <ProductSection products={company.products} isDarkMode={isDarkMode} />
      </div>
    </TabsContent>

    {/* Pulse Tab */}
    <TabsContent value="pulse">
      <div className="bg-[#F8F9FC] p-6 rounded-lg border border-[#E5E7EB]">
        <BlogSection company={company} isDarkMode={isDarkMode} />
        {/* Additional LinkedIn and Hiring sections can be added here */}
      </div>
    </TabsContent>
  </div>
</Tabs>
    </div>
  );
}



