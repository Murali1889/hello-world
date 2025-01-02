import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, set, get } from 'firebase/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CompanySearch from './CompanySearch';

const BlogConfig = ({ isLoading, setIsLoading, error, setError, success, setSuccess, companies }) => {
  const { database } = useFirebase();
  const [blogConfig, setBlogConfig] = useState({
    key: '',
    name: '',
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

  const handleCompanySelect = (company) => {
    setError('');
    setSuccess('');
    setBlogConfig(prev => ({
      ...prev,
      key: company.key,
      name: company.name
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

  const validateBlogConfig = () => {
    if (!blogConfig.key) throw new Error('Please select a company');
    if (!blogConfig.url) throw new Error('URL is required');
    if (!blogConfig.mainPath) throw new Error('Main path is required');
    if (!blogConfig.blogPath) throw new Error('Blog path is required');
    if (!blogConfig.title) throw new Error('Title selector is required');
    if (!blogConfig.blogUrl) throw new Error('Blog URL selector is required');
    if (!blogConfig.contentSelector) throw new Error('Content selector is required');
    if (!blogConfig.date && !blogConfig.blogPageDateSelector) {
      throw new Error('Either date or blog page date selector is required');
    }
    if (blogConfig.pagination.type === 'clicking-button') {
      if (!blogConfig.pagination.nextButtonSelector) {
        throw new Error('Next button selector is required for clicking pagination');
      }
      if (!blogConfig.pagination.maxPages) {
        throw new Error('Max pages is required for clicking pagination');
      }
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      validateBlogConfig();

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

      const companyRef = ref(database, `companies/${blogConfig.key}/blog_config`);
      await set(companyRef, config);

      setSuccess('Blog configuration updated successfully!');
      
      // Reset form except company selection
      setBlogConfig(prev => ({
        ...prev,
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
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <Label htmlFor="companySelect" className="text-[#1B365D] font-medium">Company Name</Label>
              <CompanySearch 
                companies={companies} 
                onCompanySelect={handleCompanySelect}
                placeholder="Select company for blog config..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-[#1B365D] font-medium">Blog URL</Label>
              <Input
                id="url"
                value={blogConfig.url}
                onChange={(e) => handleBlogChange('url', e.target.value)}
                className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                placeholder="Enter blog URL"
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
                  placeholder="Enter main path"
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
                  placeholder="Enter blog path"
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
                  placeholder="Enter title selector"
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
                  placeholder="Enter blog URL selector"
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
                placeholder="Enter content selector"
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
                  placeholder="Enter date selector"
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
                  placeholder="Enter blog page date selector"
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
                    placeholder="Enter next button selector"
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
                    placeholder="Enter max pages"
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
  );
};

export default BlogConfig;