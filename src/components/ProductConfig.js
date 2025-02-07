import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, set } from 'firebase/database';
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
import CompanySearch from './CompanySearch';

const ProductConfig = ({ isLoading, setIsLoading, error, setError, success, setSuccess, companies }) => {
  const { database } = useFirebase();
  const [productConfig, setProductConfig] = useState({
    key: '',
    name: '',
    product_path: '',
  });

  const handleCompanySelect = (company) => {
    setError('');
    setSuccess('');
    setProductConfig(prev => ({
      ...prev,
      key: company.company_name,
      name: company.name
    }));
  };

  const validateForm = () => {
    if (!productConfig.key) {
      throw new Error('Please select a company');
    }
    if (!productConfig.product_path.trim()) {
      throw new Error('Product path is required');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
  
    try {
      validateForm();
      
      const companyRef = ref(database, `companies/${productConfig.key}/products/product_config`);
      await set(companyRef, productConfig.product_path);
      setSuccess('Product configuration updated successfully!');
      
      // Reset form
      setProductConfig(prev => ({
        ...prev,
        product_path: ''
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
        <CardTitle>Product Configuration</CardTitle>
        <CardDescription className="text-gray-300">
          Configure product settings for your company
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companySelect" className="text-[#1B365D] font-medium">Company Name</Label>
              <CompanySearch 
                companies={companies} 
                onCompanySelect={handleCompanySelect}
                placeholder="Select company for product config..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPath" className="text-[#1B365D] font-medium">Product Path</Label>
              <Input
                id="productPath"
                value={productConfig.product_path}
                onChange={(e) => setProductConfig(prev => ({
                  ...prev,
                  product_path: e.target.value
                }))}
                className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                placeholder="Enter product selector path"
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
            {isLoading ? 'Saving...' : 'Save Product Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductConfig;