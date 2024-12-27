import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, set, get } from 'firebase/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Switch } from "../components/ui/switch";

const ConfigManager = () => {
  const { database } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product Config State
  const [productConfig, setProductConfig] = useState({
    companyName: '',
    url: '',
    mainPath: '',
    title: '',
    content: '',
    hover: false,
    hoverSelector: '',
    excluded_words: ''
  });

  // Blog Config State
  const [blogConfig, setBlogConfig] = useState({
    companyName: '',
    url: '',
    mainPath: '',
    blogPath: '',
    title: '',
    blogUrl: '',
    contentSelector: '',
    date: '',
    blogPageDateSelector: '',
    pagination: {
      type: 'clicking-button',
      nextButtonSelector: '',
      maxPages: 1
    }
  });

  // Client Config State
  const [clientConfig, setClientConfig] = useState({
    companyName: '',
    url: '',
    mainPath: ''
  });

  const handleProductChange = (field, value) => {
    setProductConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBlogChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBlogConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBlogConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleClientChange = (field, value) => {
    setClientConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateProductConfig = () => {
    if (!productConfig.companyName) return 'Company name is required';
    if (!productConfig.url) return 'URL is required';
    if (!productConfig.mainPath) return 'Main path is required';
    if (productConfig.hover && !productConfig.hoverSelector) {
      return 'Hover selector is required when hover is enabled';
    }
    return null;
  };

  const validateBlogConfig = () => {
    if (!blogConfig.companyName) return 'Company name is required';
    if (!blogConfig.url) return 'URL is required';
    if (!blogConfig.mainPath) return 'Main path is required';
    if (!blogConfig.blogPath) return 'Blog path is required';
    if (!blogConfig.title) return 'Title selector is required';
    if (!blogConfig.blogUrl) return 'Blog URL selector is required';
    if (!blogConfig.contentSelector) return 'Content selector is required';
    if (!blogConfig.date && !blogConfig.blogPageDateSelector) {
      return 'Either date or blog page date selector is required';
    }

    if (blogConfig.pagination.type === 'clicking-button') {
      if (!blogConfig.pagination.nextButtonSelector) {
        return 'Next button selector is required for clicking pagination';
      }
      if (!blogConfig.pagination.maxPages) {
        return 'Max pages is required for clicking pagination';
      }
    }
    return null;
  };

  const validateClientConfig = () => {
    if (!clientConfig.companyName) return 'Company name is required';
    if (!clientConfig.url) return 'URL is required';
    if (!clientConfig.mainPath) return 'Main path is required';
    return null;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateProductConfig();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const config = {
        url: productConfig.url,
        mainPath: productConfig.mainPath,
        excluded_words: productConfig.excluded_words.split(',').map(word => word.trim()),
      };

      if (productConfig.title) config.title = productConfig.title;
      if (productConfig.content) config.content = productConfig.content;
      if (productConfig.hover) {
        config.hover = true;
        config.hoverSelector = productConfig.hoverSelector;
      }

      const companyRef = ref(database, `companies/${productConfig.companyName}`);
      const snapshot = await get(companyRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      await set(companyRef, {
        ...existingData,
        product_config: config
      });

      setSuccess('Product configuration updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateBlogConfig();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const config = {
        url: blogConfig.url,
        mainPath: blogConfig.mainPath,
        blogPath: blogConfig.blogPath,
        title: blogConfig.title,
        blogUrl: blogConfig.blogUrl,
        contentSelector: blogConfig.contentSelector,
        pagination: blogConfig.pagination
      };

      if (blogConfig.date) config.date = blogConfig.date;
      if (blogConfig.blogPageDateSelector) config.blogPageDateSelector = blogConfig.blogPageDateSelector;

      const companyRef = ref(database, `companies/${blogConfig.companyName}`);
      const snapshot = await get(companyRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      await set(companyRef, {
        ...existingData,
        blog_config: config
      });

      setSuccess('Blog configuration updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateClientConfig();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const config = {
        url: clientConfig.url,
        mainPath: clientConfig.mainPath
      };

      const companyRef = ref(database, `companies/${clientConfig.companyName}`);
      const snapshot = await get(companyRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      await set(companyRef, {
        ...existingData,
        clients_config: config
      });

      setSuccess('Client configuration updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-8">
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="products" className="w-full">
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
            {/* Products Tab Content */}
            <TabsContent value="products">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#1B365D] text-white rounded-t-lg">
                  <CardTitle>Product Configuration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure product scraping settings for your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="productCompanyName" className="text-[#1B365D] font-medium">Company Name</Label>
                        <Input
                          id="productCompanyName"
                          value={productConfig.companyName}
                          onChange={(e) => handleProductChange('companyName', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productUrl" className="text-[#1B365D] font-medium">Product URL</Label>
                        <Input
                          id="productUrl"
                          value={productConfig.url}
                          onChange={(e) => handleProductChange('url', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productMainPath" className="text-[#1B365D] font-medium">Main Path</Label>
                        <Input
                          id="productMainPath"
                          value={productConfig.mainPath}
                          onChange={(e) => handleProductChange('mainPath', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productTitle" className="text-[#1B365D] font-medium">Title Selector (Optional)</Label>
                        <Input
                          id="productTitle"
                          value={productConfig.title}
                          onChange={(e) => handleProductChange('title', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productContent" className="text-[#1B365D] font-medium">Content Selector (Optional)</Label>
                        <Input
                          id="productContent"
                          value={productConfig.content}
                          onChange={(e) => handleProductChange('content', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hover"
                          checked={productConfig.hover}
                          onCheckedChange={(checked) => handleProductChange('hover', checked)}
                          className="shadow-sm border-slate-500"
                        />
                        <Label htmlFor="hover" className="text-[#1B365D] font-medium">Enable Hover</Label>
                      </div>

                      {productConfig.hover && (
                        <div className="space-y-2">
                          <Label htmlFor="hoverSelector" className="text-[#1B365D] font-medium">Hover Selector</Label>
                          <Input
                            id="hoverSelector"
                            value={productConfig.hoverSelector}
                            onChange={(e) => handleProductChange('hoverSelector', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                            required
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="excludedWords" className="text-[#1B365D] font-medium">Excluded Words</Label>
                        <Input
                          id="excludedWords"
                          value={productConfig.excluded_words}
                          onChange={(e) => handleProductChange('excluded_words', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          placeholder="Enter comma-separated words"
                          required
                        />
                        <p className="text-sm text-gray-500">Enter words separated by commas</p>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mt-6 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-[#FF8C69] hover:bg-[#ff7f5c] text-white font-medium py-3 mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Product Configuration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blogs Tab Content */}
            <TabsContent value="blogs">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#1B365D] text-white rounded-t-lg">
                  <CardTitle>Blog Configuration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure blog scraping settings for your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-[#1B365D] font-medium">Company Name</Label>
                        <Input
                          id="companyName"
                          value={blogConfig.companyName}
                          onChange={(e) => handleBlogChange('companyName', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-[#1B365D] font-medium">Blog URL</Label>
                        <Input
                          id="url"
                          value={blogConfig.url}
                          onChange={(e) => handleBlogChange('url', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mainPath" className="text-[#1B365D] font-medium">Main Path</Label>
                          <Input
                            id="mainPath"
                            value={blogConfig.mainPath}
                            onChange={(e) => handleBlogChange('mainPath', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blogPath" className="text-[#1B365D] font-medium">Blog Path</Label>
                          <Input
                            id="blogPath"
                            value={blogConfig.blogPath}
                            onChange={(e) => handleBlogChange('blogPath', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-[#1B365D] font-medium">Title Selector</Label>
                          <Input
                            id="title"
                            value={blogConfig.title}
                            onChange={(e) => handleBlogChange('title', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blogUrl" className="text-[#1B365D] font-medium">Blog URL Selector</Label>
                          <Input
                            id="blogUrl"
                            value={blogConfig.blogUrl}
                            onChange={(e) => handleBlogChange('blogUrl', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contentSelector" className="text-[#1B365D] font-medium">Content Selector</Label>
                        <Input
                          id="contentSelector"
                          value={blogConfig.contentSelector}
                          onChange={(e) => handleBlogChange('contentSelector', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-[#1B365D] font-medium">Date Selector</Label>
                          <Input
                            id="date"
                            value={blogConfig.date}
                            onChange={(e) => handleBlogChange('date', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          />
                          <p className="text-sm text-gray-500">Either Date or Blog Page Date Selector is required</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blogPageDateSelector" className="text-[#1B365D] font-medium">Blog Page Date Selector</Label>
                          <Input
                            id="blogPageDateSelector"
                            value={blogConfig.blogPageDateSelector}
                            onChange={(e) => handleBlogChange('blogPageDateSelector', e.target.value)}
                            className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#1B365D] font-medium">Pagination Type</Label>
                        <Select
                          value={blogConfig.pagination.type}
                          onValueChange={(value) => handleBlogChange('pagination.type', value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]">
                            <SelectValue placeholder="Select pagination type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="clicking-button">Clicking Button</SelectItem>
                            <SelectItem value="scrolling">Scrolling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {blogConfig.pagination.type === 'clicking-button' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nextButtonSelector" className="text-[#1B365D] font-medium">Next Button Selector</Label>
                            <Input
                              id="nextButtonSelector"
                              value={blogConfig.pagination.nextButtonSelector}
                              onChange={(e) => handleBlogChange('pagination.nextButtonSelector', e.target.value)}
                              className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxPages" className="text-[#1B365D] font-medium">Max Pages</Label>
                            <Input
                              id="maxPages"
                              type="number"
                              min="1"
                              value={blogConfig.pagination.maxPages}
                              onChange={(e) => handleBlogChange('pagination.maxPages', parseInt(e.target.value))}
                              className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mt-6 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-[#FF8C69] hover:bg-[#ff7f5c] text-white font-medium py-3 mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Blog Configuration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab Content */}
            <TabsContent value="clients">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#1B365D] text-white rounded-t-lg">
                  <CardTitle>Client Configuration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure client scraping settings for your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleClientSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="clientCompanyName" className="text-[#1B365D] font-medium">Company Name</Label>
                        <Input
                          id="clientCompanyName"
                          value={clientConfig.companyName}
                          onChange={(e) => handleClientChange('companyName', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientUrl" className="text-[#1B365D] font-medium">Client URL</Label>
                        <Input
                          id="clientUrl"
                          value={clientConfig.url}
                          onChange={(e) => handleClientChange('url', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientMainPath" className="text-[#1B365D] font-medium">Main Path</Label>
                        <Input
                          id="clientMainPath"
                          value={clientConfig.mainPath}
                          onChange={(e) => handleClientChange('mainPath', e.target.value)}
                          className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mt-6 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-[#FF8C69] hover:bg-[#ff7f5c] text-white font-medium py-3 mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Client Configuration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfigManager;