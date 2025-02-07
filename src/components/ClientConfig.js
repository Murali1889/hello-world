import React, { useState, useEffect } from 'react';
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
import CompanySearch from './CompanySearch';
import { Loader2, Plus, X } from 'lucide-react';

const ClientConfig = ({ isLoading, setIsLoading, error, setError, success, setSuccess, companies }) => {
  const { database } = useFirebase();
  const [clientConfig, setClientConfig] = useState({
    key: '',
    name: '',
    url: '',
    mainPath: ''
  });
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState('');
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const fetchClients = async (companyKey) => {
    setIsLoadingClients(true);
    try {
      const clientsRef = ref(database, `companies/${companyKey}/clients`);
      const snapshot = await get(clientsRef);
      const clientsData = snapshot.val();
      // Clean the data by removing undefined values
      const cleanClients = clientsData ? clientsData.filter(client => client !== undefined) : [];
      setClients(cleanClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch clients');
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleDeleteClient = async (indexToDelete) => {
    try {
      // Filter out undefined values and the deleted client
      const updatedClients = clients
        .filter(client => client !== undefined)
        .filter((_, index) => index !== indexToDelete);
      const clientsRef = ref(database, `companies/${clientConfig.key}/clients`);
      await set(clientsRef, updatedClients);
      setClients(updatedClients);
      setSuccess('Client removed successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError('Failed to delete client');
      setTimeout(() => setError(''), 3000); // Clear error message after 3 seconds
    }
  };

  const handleCompanySelect = async (company) => {
    setError('');
    setSuccess('');
    setClientConfig(prev => ({
      ...prev,
      key: company.company_name,
      name: company.name
    }));
    await fetchClients(company.company_name);
  };

  const handleAddClient = async (e) => {
    if (e.key === 'Enter' && newClient.trim() && clientConfig.key) {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        // Check for duplicates
        if (clients.filter(client => client !== undefined).includes(newClient.trim())) {
          setError('Client already exists');
          setTimeout(() => setError(''), 3000);
          return;
        }

        // Filter out undefined values and add new client
        const cleanClients = clients.filter(client => client !== undefined);
        const updatedClients = [...cleanClients, newClient.trim()];
        const clientsRef = ref(database, `companies/${clientConfig.key}/clients`);
        await set(clientsRef, updatedClients);
        setClients(updatedClients);
        setNewClient('');
        setSuccess('Client added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to add client');
        setTimeout(() => setError(''), 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClientChange = (field, value) => {
    setClientConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateClientConfig = () => {
    if (!clientConfig.key) throw new Error('Please select a company');
    if (!clientConfig.url.trim()) throw new Error('URL is required');
    if (!clientConfig.mainPath.trim()) throw new Error('Main path is required');
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      validateClientConfig();

      const config = {
        url: clientConfig.url,
        mainPath: clientConfig.mainPath
      };

      const companyRef = ref(database, `companies/${clientConfig.key}/clients_config`);
      await set(companyRef, config);

      setSuccess('Client configuration updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset form except company selection
      setClientConfig(prev => ({
        ...prev,
        url: '',
        mainPath: ''
      }));
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <Label htmlFor="companySelect" className="text-[#1B365D] font-medium">
                Company Name
              </Label>
              <CompanySearch 
                companies={companies} 
                onCompanySelect={handleCompanySelect}
                placeholder="Select company for client config..."
              />
            </div>

            {clientConfig.key && (
              <div className="space-y-4">
                {/* Client Management Section */}
                <div className="space-y-2">
                  <Label className="text-[#1B365D] font-medium">Clients</Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter new client name and press Enter..."
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      onKeyDown={handleAddClient}
                      className="pr-10"
                    />
                    <Plus className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* Clients List */}
                  {isLoadingClients ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {clients.map((client, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm group hover:bg-gray-200 transition-colors"
                        >
                          <span>{client}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteClient(index)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {clients.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No clients added yet
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Configuration Section */}
                <div className="space-y-2">
                  <Label htmlFor="clientUrl" className="text-[#1B365D] font-medium">
                    Client URL
                  </Label>
                  <Input
                    id="clientUrl"
                    value={clientConfig.url}
                    onChange={(e) => handleClientChange('url', e.target.value)}
                    className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                    placeholder="Enter client URL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientMainPath" className="text-[#1B365D] font-medium">
                    Main Path
                  </Label>
                  <Input
                    id="clientMainPath"
                    value={clientConfig.mainPath}
                    onChange={(e) => handleClientChange('mainPath', e.target.value)}
                    className="border-gray-300 focus:border-[#1B365D] focus:ring-[#1B365D]"
                    placeholder="Enter main path"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50 text-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-6 border-green-200 bg-green-50 text-green-900">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {clientConfig.key && (
            <Button
              type="submit"
              className="w-full bg-[#FF8C69] hover:bg-[#ff7f5c] text-white font-medium py-3 mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Client Configuration'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientConfig;