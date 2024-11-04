import React, { useState } from 'react';
import { useToast } from "../../hooks/use-toast";
import { useFirebase } from '../../context/FirebaseContext';
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddCompanyForm from './AddCompanyForm';
import LoadingComponent from '../LoadingComponent';
import axios from 'axios';

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

const AddCompanyDialog = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const { toast } = useToast();
  const { auth } = useFirebase();

  React.useEffect(() => {
    if (isSubmitting) {
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 200);

      const messageInterval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isSubmitting]);

  const handleSubmit = async (websiteUrl) => {
    setIsSubmitting(true);
    
    try {
      const idToken = await auth.currentUser.getIdToken();

      console.log(idToken)
      
      const response = await axios.post('https://0l1ynkbrfl.execute-api.us-east-1.amazonaws.com/prod/company-scraper', {
          url: websiteUrl,
          idToken
      });


      console.log(response)

      const data = await response.json();


      console.log(data)

      if (!data.success) {
        throw new Error(data.error || 'Failed to add company');
      }

      toast({
        title: "Success",
        description: "Company details added successfully!",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md">
      {isSubmitting ? (
        <LoadingComponent 
          progress={progress} 
          messageIndex={messageIndex} 
          loadingMessages={loadingMessages} 
        />
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <AddCompanyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </>
      )}
    </DialogContent>
  );
};

export default AddCompanyDialog;