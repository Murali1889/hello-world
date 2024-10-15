import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart2, Users, Rss } from 'lucide-react';
import ProfileTab from './ProfileTab';
import PortfolioTab from './PortfolioTab';
import PulseTab from './PulseTab';
import axios from 'axios';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile states
  const [companyData, setCompanyData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Portfolio states
  const [productsData, setProductsData] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState(null);

  // Pulse (BlogPosts) states
  const [blogPostsData, setBlogPostsData] = useState(null);
  const [pulseLoading, setPulseLoading] = useState(true);
  const [pulseError, setPulseError] = useState(null);

  const fetchCompanyData = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get('https://script.google.com/macros/s/AKfycbyMF96kj0reKSACaCcUsMNk4bnkFoHfywPzlq0RZGT4v6mulbpuF3-Qbwyqorx91Jej/exec?company_name=Signzy');
      setCompanyData(response.data.data);
    } catch (error) {
      setProfileError('Failed to fetch company data. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchProductsData = useCallback(async () => {
    try {
      setPortfolioLoading(true);
      const productsResponse = await axios.get('https://script.google.com/macros/s/AKfycbyMF96kj0reKSACaCcUsMNk4bnkFoHfywPzlq0RZGT4v6mulbpuF3-Qbwyqorx91Jej/exec?company_name=Signzy&products=true');
      setProductsData(productsResponse.data.data);
    } catch (error) {
      setPortfolioError('Failed to fetch product data. Please try again.');
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  const fetchBlogPostsData = useCallback(async () => {
    try {
      setPulseLoading(true);
      const blogResponse = await axios.get('https://script.google.com/macros/s/AKfycbyMF96kj0reKSACaCcUsMNk4bnkFoHfywPzlq0RZGT4v6mulbpuF3-Qbwyqorx91Jej/exec?blogs=true&id=ID-1728895494800-306');
      setBlogPostsData(blogResponse.data);
    } catch (error) {
      setPulseError('Failed to fetch blog data. Please try again.');
    } finally {
      setPulseLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
    fetchProductsData();
    fetchBlogPostsData();
  }, [fetchCompanyData, fetchProductsData, fetchBlogPostsData]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <div className="container mx-auto p-6 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <TabsTrigger value="profile" className="rounded-full px-4 py-2 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-300">
                <Users className="w-5 h-5 mr-2" />
                Company Profile
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="rounded-full px-4 py-2 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-300">
                <BarChart2 className="w-5 h-5 mr-2" />
                Product Portfolio
              </TabsTrigger>
              <TabsTrigger value="pulse" className="rounded-full px-4 py-2 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-300">
                <Rss className="w-5 h-5 mr-2" />
                Company Pulse
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="h-full overflow-y-auto pb-[50px]">
            <AnimatePresence mode="wait">
              <TabsContent value="profile" key="profile">
                <motion.div {...fadeIn}>
                  <ProfileTab
                    companyData={companyData}
                    loading={profileLoading}
                    error={profileError}
                  />
                </motion.div>
              </TabsContent>
              <TabsContent value="portfolio" key="portfolio">
                <motion.div {...fadeIn}>
                  <PortfolioTab
                    productsData={productsData}
                    loading={portfolioLoading}
                    error={portfolioError}
                  />
                </motion.div>
              </TabsContent>
              <TabsContent value="pulse" key="pulse">
                <motion.div {...fadeIn}>
                  <PulseTab
                    blogPostsData={blogPostsData}
                    loading={pulseLoading}
                    error={pulseError}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
