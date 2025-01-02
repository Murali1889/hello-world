import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProductConfig from './ProductConfig';
import BlogConfig from './BlogConfig';
import ClientConfig from './ClientConfig';
import { useData } from '../context/DataContext';

const ConfigManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { companies } = useData();

  // Reset messages when switching tabs
  const handleTabChange = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-8">
      <div className="max-w-3xl mx-auto">
        {
          companies.length > 0 && <Tabs defaultValue="products" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 bg-[#1B365D] rounded-lg h-fit p-[5px]">
              <TabsTrigger
                value="products"
                className="text-white data-[state=active]:bg-[#F5F5F0] data-[state=active]:text-[#1B365D] px-8 py-2 rounded-md transition-all"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="blogs"
                className="text-white data-[state=active]:bg-[#F5F5F0] data-[state=active]:text-[#1B365D] px-8 py-2 rounded-md transition-all"
              >
                Blogs
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="text-white data-[state=active]:bg-[#F5F5F0] data-[state=active]:text-[#1B365D] px-8 py-2 rounded-md transition-all"
              >
                Clients
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="products">
                <ProductConfig
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  setError={setError}
                  success={success}
                  setSuccess={setSuccess}
                  companies={companies}
                />
              </TabsContent>
              <TabsContent value="blogs">
                <BlogConfig
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  setError={setError}
                  success={success}
                  setSuccess={setSuccess}
                  companies={companies}
                />
              </TabsContent>
              <TabsContent value="clients">
                <ClientConfig
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  setError={setError}
                  success={success}
                  setSuccess={setSuccess}
                  companies={companies}
                />
              </TabsContent>
            </div>
          </Tabs>
        }
      </div>
    </div>
  );
};

export default ConfigManager;