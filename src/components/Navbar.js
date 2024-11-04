import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, LogOut, Plus, Globe, Linkedin } from 'lucide-react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { useData } from '../context/DataContext';
import { useFirebase } from '../context/FirebaseContext';
import { signOut } from 'firebase/auth';
import { useMessage } from '../context/MessageContext';
import LoadingComponent from './LoadingComponent';
const AddCompanyForm = ({ onSubmit, isSubmitting }) => (
  <form onSubmit={onSubmit} className="space-y-6 pt-4">
    <div className="space-y-2">
      <Label htmlFor="websiteUrl">Website URL</Label>
      <div className="relative">
        <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://example.com"
          className="pl-8"
          required
        />
      </div>
    </div>
    {/* <div className="space-y-2">
      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
      <div className="relative">
        <Linkedin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="linkedinUrl"
          name="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/company/example"
          className="pl-8"
          required
        />
      </div>
    </div> */}
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-[#DE85AD] to-[#B44F7E] hover:from-[#B44F7E] hover:to-[#DE85AD] text-white"
      disabled={isSubmitting}
    >
      Add Company
    </Button>
  </form>
);

const SearchResults = ({ companies, selectedIndex, onSelect, onMouseEnter }) => (
  <ul className="bg-white backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
    {companies.map((company, index) => (
      <li
        key={company.company_name}
        className={`px-4 py-3 cursor-pointer text-sm text-black border-b last:border-b-0 border-white/10
          ${selectedIndex === index ? 'bg-black/20' : 'hover:bg-black/10'}`}
        onClick={() => onSelect(company)}
        onMouseEnter={() => onMouseEnter(index)}
      >
        {company.company_name}
      </li>
    ))}
  </ul>
);


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companies } = useData();
  const { auth } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const searchRef = useRef(null);
  const { showSuccess, showError, showInfo } = useMessage();

  const loadingMessages = [
    "Analyzing company data structures...",
    "Gathering competitive intelligence...",
    "Processing market insights...",
    "Validating business metrics...",
    "Compiling industry trends...",
    "Synchronizing financial data...",
    "Generating company overview...",
    "Finalizing your business report..."
  ];

  useEffect(() => {
    if (isSubmitting) {
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prevProgress + 1
        })
      }, 200)

      const messageInterval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
      }, 2500)

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isSubmitting]);


  console.log(progress)
  const currentCompanyName = location.pathname.startsWith('/company/')
    ? decodeURIComponent(location.pathname.split('/company/')[1])
    : null;
  const currentCompany = companies?.find(c => c.company_name === currentCompanyName);

  const filteredCompanies = companies?.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = {
      websiteUrl: formData.get('websiteUrl'),
      linkedinUrl: formData.get('linkedinUrl')
    };
  
  
    try {
      // Get the current user's ID token
      const idToken = await auth.currentUser.getIdToken();
  
      // Make API call only for websiteUrl
      const response = await fetch('https://0l1ynkbrfl.execute-api.us-east-1.amazonaws.com/prod/company-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          url: data.websiteUrl
        })
      });
  
      if (!response.ok) {
        throw new Error('API request failed');
      }
  
      setIsDialogOpen(false);
      showSuccess('Company analysis started! We\'ll notify you when it\'s ready.');
  
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'Failed to fetch' || !navigator.onLine) {
        showError('Network error. Please check your connection and try again.');
      } else {
        showInfo('We encountered an issue processing your request. Our team has been notified and will analyze your company within the next hour.');
      }
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (!filteredCompanies.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsListVisible(true);
        setSelectedIndex(prev =>
          prev < filteredCompanies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          const selected = filteredCompanies[selectedIndex];
          navigate(`/company/${encodeURIComponent(selected.company_name)}`);
          setIsListVisible(false);
          setSearchTerm('');
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsListVisible(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <nav className="fixed top-0 z-50 bg-white right-0 left-0 p-4 shadow-md">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {currentCompany ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className='relative h-16 w-[150px] rounded-lg p-2 flex-shrink-0 overflow-hidden bg-[#DE85AD]'>
              {currentCompany.logo ? (
                                currentCompany.logo.type === 'svg' ? (
                                    <div
                                        className="h-full svg w-full p-2"
                                        dangerouslySetInnerHTML={{
                                            __html: currentCompany.logo.content
                                        }}
                                    />
                                ) : currentCompany.logo.type === 'img' ? (
                                    <img
                                        src={currentCompany.logo.content}
                                        alt={`${currentCompany.name || 'Company'} logo`}
                                        className="h-full w-full object-contain"
                                        onError={(e) => e.target.parentElement.lastChild.className = 'text-3xl font-bold text-white/70'}
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#DE85AD]">
                                        {(currentCompany.name || 'N/A').charAt(0)}
                                    </span>
                                )
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#DE85AD]">
                                    {(currentCompany.name || 'N/A').charAt(0)}
                                </span>
                            )}
              </div>
            </>
          ) : (
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent">
              Competitive Intel
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={searchRef}>
            <div className="flex w-[300px] items-center gap-4 rounded-lg bg-black/90 p-2 backdrop-blur-sm">
              <Search className="ml-2 h-5 w-5 text-white" />
              <Input
                type="search"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsListVisible(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setIsListVisible(true)}
                onKeyDown={handleKeyDown}
                className="h-8 border-none bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0"
              />
            </div>

            {isListVisible && searchTerm && filteredCompanies.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2">
                <SearchResults
                  companies={filteredCompanies}
                  selectedIndex={selectedIndex}
                  onSelect={(company) => {
                    navigate(`/company/${encodeURIComponent(company.company_name)}`);
                    setIsListVisible(false);
                    setSearchTerm('');
                  }}
                  onMouseEnter={setSelectedIndex}
                />
              </div>
            )}
          </div>

          {!currentCompany && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-gradient-to-r from-indigo-600 to-rose-600 text-white border-0"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md">
                {isSubmitting ? (
                  <LoadingComponent progress={progress} messageIndex={messageIndex} loadingMessages={loadingMessages} />
                ) : (

                  <><DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                  </DialogHeader>
                    <AddCompanyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} /></>

                )}
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="secondary"
            className="bg-red-500 text-white border-0"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            
          </Button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;