import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart2, Users, Rss } from 'lucide-react';
import ProfileTab from './ProfileTab';
import PortfolioTab from './PortfolioTab';
import PulseTab from './PulseTab';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

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
                Product Portfolio Analysis
              </TabsTrigger>
              <TabsTrigger value="pulse" className="rounded-full px-4 py-2 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-300">
                <Rss className="w-5 h-5 mr-2" />
                Company Pulse
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="h-full overflow-y-auto pb-[50px]"> {/* Ensure scrollable content area */}
            <AnimatePresence mode="wait">
              <TabsContent value="profile" key="profile">
                <motion.div {...fadeIn}>
                  <ProfileTab key={activeTab} />
                </motion.div>
              </TabsContent>
              <TabsContent value="portfolio" key="portfolio">
                <motion.div {...fadeIn}>
                  <PortfolioTab key={activeTab} />
                </motion.div>
              </TabsContent>
              <TabsContent value="pulse" key="pulse">
                <motion.div {...fadeIn}>
                  <PulseTab key={activeTab} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
);

}