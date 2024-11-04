import React from 'react';
import { Globe } from 'lucide-react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const AddCompanyForm = ({ onSubmit, isSubmitting }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData.get('websiteUrl'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#DE85AD] to-[#B44F7E] hover:from-[#B44F7E] hover:to-[#DE85AD] text-white"
        disabled={isSubmitting}
      >
        Add Company
      </Button>
    </form>
  );
};

export default AddCompanyForm;