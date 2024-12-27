import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, LogOut, Plus, Globe, Moon, User } from 'lucide-react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { useData } from '../context/DataContext';
import { useFirebase } from '../context/FirebaseContext';
import { signOut } from 'firebase/auth';
import { useMessage } from '../context/MessageContext';
import LoadingComponent from './LoadingComponent';
import axios from 'axios';

// Array of admin emails
const ADMIN_EMAILS = ['murali.g@hyperverge.co', 'admin@example.com']; // Add your admin emails here

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { auth } = useFirebase();
  
  const user = auth.currentUser;
  const isAdmin = ADMIN_EMAILS.includes(user.email);
  const avatarLetter = user.email.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4332] text-white font-medium focus:outline-none"
      >
        {avatarLetter}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="flex items-center justify-start gap-2 py-2 px-4 text-black">
            <div className="flex flex-col space-y-1 leading-none">
              {user.displayName && (
                <p className="font-normal text-sm">{user.displayName}</p>
              )}
              {/* {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )} */}
            </div>
          </div>
          <hr/>
          {/* <button
            onClick={() => {}} // Toggle theme function
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Moon className="mr-2 h-4 w-4" />
            Toggle theme
          </button> */}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin/update')}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              Admin page
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

const AddCompanyForm = ({ onSubmit, isSubmitting, errorMessage }) => (
  <form onSubmit={onSubmit} className="space-y-6 pt-4 bg-[#FFFFFF] rounded-2xl">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-[#1B365D] font-semibold text-xl">Add New Company</h2>
    </div>

    <div className="space-y-2">
      <Label htmlFor="websiteUrl" className="text-[#1B365D] font-medium text-lg mb-2">
        Website URL
      </Label>
      <div className="relative">
        <Globe className="absolute left-2 top-2.5 h-4 w-4 text-[#6B7280]" />
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://example.com"
          className="pl-10 pr-4 py-2 bg-[#F8F9FC] border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1B365D] focus:border-[#1B365D] placeholder-[#6B7280] text-[#1B365D]"
          required
        />
      </div>
    </div>

    {errorMessage && (
      <div className="bg-[#FEF2F2] text-[#DC2626] rounded-md p-3 text-sm">
        {errorMessage}
      </div>
    )}

    <Button
      type="submit"
      className={`w-full py-2 text-white font-medium rounded-lg ${
        isSubmitting
          ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
          : 'bg-[#1B365D] hover:bg-[#162A4E]'
      }`}
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

const Navbar = ({ isCompany }) => {
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
  const { showSuccess, showError, showInfo, showWarning } = useMessage();

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
            return 99
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
    };
  
    try {
      const urlDomain = new URL(data.websiteUrl.trim()).hostname.replace('www.', '');
      
      const existingCompany = companies.find(company => {
        const companyDomain = new URL(company.url).hostname.replace('www.', '');
        return companyDomain === urlDomain;
      });
  
      if (existingCompany) {
        showWarning(`This company is already in our database. Company name: ${existingCompany.company_name || 'Unknown'}. Please try another company or check the existing list.`);
        setIsSubmitting(false);
        return;
      }
  
      const idToken = await auth.currentUser.getIdToken();
  
      const response = await axios.post(
        'https://l6ed6gqjaw4gvnh3pxq765zuye0jistj.lambda-url.us-east-1.on.aws/',
        {
          idToken,
          url: data.websiteUrl.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Response:', response.data);
      setIsDialogOpen(false);
      showSuccess('Company analysis started! We\'ll notify you when it\'s ready.');
  
    } catch (error) {
      console.log(error);
      if (error.code === 'ERR_NETWORK') {
        setIsDialogOpen(false);
        showSuccess('Company added successfully! You can now search and look into it.');
      } else if (error.response) {
        showError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        showSuccess('Company added successfully! You can now search and look into it.');
      } else {
        showSuccess('Company added successfully! You can now search and look into it.');
      }
    } finally {
      setIsSubmitting(false);
      setProgress(0);
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
    <nav className="bg-[#1B365D] text-[#FFFFFF] py-4 shadow-md fixed top-0 z-50 right-0 left-0">
      <div className={`mx-auto ${isCompany ? 'px-[30px]' : 'px-[43px]'}`}>
        <div style={{ display: isCompany ? 'flex' : 'block', justifyContent: 'space-between' }}>
          <div className={`flex justify-between items-center w-full ${isCompany ? '' : 'mb-1'}`}>
            <h1 className="text-2xl font-semibold cursor-pointer" onClick={() => navigate('/')}>
              Competitive Intelligence
            </h1>
            <div className={`flex ${isCompany ? 'gap-0' : 'gap-5'}`}>
              <div className="relative w-full sm:w-[500px]" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E0E0E0] h-4 w-4" />
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
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-md focus:border-none text-[#0F172A] bg-[#FFFFFF] placeholder-[#B0B8C1]"
                />
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

              <div className="flex items-center gap-4">
                {!currentCompany && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF8C69] hover:bg-[#FF8C69] text-white transition-colors duration-300">
                        <Plus className="mr-2 h-5 w-5" /> Add Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-[#FFFFFF] border border-[#F0F0F0] rounded-2xl p-6">
                      {isSubmitting ? (
                        <LoadingComponent progress={progress} messageIndex={messageIndex} loadingMessages={loadingMessages} />
                      ) : (
                        <>
                          <AddCompanyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {/* Profile Dropdown Component */}
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;