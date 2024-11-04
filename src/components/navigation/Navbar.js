import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useFirebase } from '../../context/FirebaseContext';
import { useData } from '../../context/DataContext';
import SearchBar from './SearchBar';
import CompanyHeader from './CompanyHeader';
import AddCompanyDialog from './AddCompanyDialog';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companies } = useData();
  const { auth } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const currentCompanyName = location.pathname.startsWith('/company/')
    ? decodeURIComponent(location.pathname.split('/company/')[1])
    : null;
  const currentCompany = companies?.find(c => c.company_name === currentCompanyName);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-3xl right-0 left-0 p-4">
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <CompanyHeader 
            currentCompany={currentCompany} 
            onBackClick={() => navigate('/')} 
          />
        </div>

        <div className="flex items-center gap-4">
          <SearchBar companies={companies} />

          {!currentCompany && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
              <AddCompanyDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
              />
            </Dialog>
          )}

          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;