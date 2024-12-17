import { Briefcase, Zap, Users, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";

const EmptyState = ({ type }) => {
  const states = {
    about: {
      icon: <Briefcase className="w-6 h-6 text-[#1B365D]" />,
      title: "About section coming soon",
      message: "We're gathering company information"
    },
    product: {
      icon: <Zap className="w-6 h-6 text-[#1B365D]" />,
      title: "Product details loading",
      message: "Product information is being verified"
    },
    clients: {
      icon: <Users className="w-6 h-6 text-[#1B365D]" />,
      title: "Client list updating",
      message: "We're refreshing the client list"
    }
  };

  const { icon, title, message } = states[type];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-[#1B365D]/5 rounded-full animate-ping" />
        <div className="bg-[#F8F9FC] p-3 rounded-full relative">
          {icon}
        </div>
      </div>

      <h3 className="text-[#1B365D] font-semibold mb-2">{title}</h3>
      <p className="text-[#6B7280] text-sm mb-4">{message}</p>

      <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-full">
        <Clock className="w-4 h-4 text-[#1B365D]" />
        <span className="text-sm text-[#1B365D]">Updating in 4h</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#FF8C69] rounded-full animate-pulse" />
        <span className="text-xs text-[#FF8C69]">Processing</span>
      </div>
    </div>
  );
};

const ClientsNotFoundState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="bg-[#F8F9FC] p-3 rounded-full">
          <AlertCircle className="w-6 h-6 text-[#1B365D]" />
        </div>
      </div>

      <h3 className="text-[#1B365D] font-semibold mb-2">No Clients Found</h3>
      {/* <p className="text-[#6B7280] text-sm mb-4">{message}</p> */}

      <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-full">
        <Clock className="w-4 h-4 text-[#1B365D]" />
        <span className="text-sm text-[#1B365D]">Coming Soon</span>
      </div>
    </div>
  );
};

const AboutSection = ({ company }) => {
  const renderClientsContent = () => {
    if (!company.clients) {
      return <EmptyState type="clients" />;
    }
    
    if (typeof company.clients === 'string') {
      return <ClientsNotFoundState message={company.clients} />;
    }
    
    if (Array.isArray(company.clients) && company.clients.length > 0) {
      return (
        <div className="flex flex-wrap gap-2">
          {company.clients.map((client, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#F8F9FC] text-[#1B365D] px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-[#F0F4F8]"
            >
              {client}
            </Badge>
          ))}
        </div>
      );
    }
    
    return <EmptyState type="clients" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column (About and Clients) */}
      <div className="flex flex-col gap-6">
        {/* About Section */}
        <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border border-gray-100">
          <CardHeader className="bg-[#F8F9FC] p-4 border-b border-gray-100">
            <CardTitle className="text-[#1B365D] flex items-center text-lg font-semibold">
              <Briefcase className="w-5 h-5 mr-2 text-[#1B365D]" />
              About {company.company_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {company.about ? (
              <p className="text-[#4A4A4A] leading-relaxed">
                {company.about}
              </p>
            ) : (
              <EmptyState type="about" />
            )}
          </CardContent>
        </Card>

        {/* Clients Section */}
        <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border border-gray-100">
          <CardHeader className="bg-[#F8F9FC] p-4 border-b border-gray-100">
            <CardTitle className="text-[#1B365D] flex items-center text-lg font-semibold">
              <Users className="w-5 h-5 mr-2 text-[#1B365D]" />
              All Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-32 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#E0E6ED] scrollbar-track-[#F8F9FC] min-h-[250px]">
              {renderClientsContent()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Column (Product) */}
      <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border border-gray-100">
        <CardHeader className="bg-[#F8F9FC] p-4 border-b border-gray-100">
          <CardTitle className="text-[#1B365D] flex items-center text-lg font-semibold">
            <Zap className="w-5 h-5 mr-2 text-[#1B365D]" />
            What is the Product?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#E0E6ED] scrollbar-track-[#F8F9FC]">
          {company.what_is_the_product && company.what_is_the_product.length > 0 ? (
            <ul className="list-disc space-y-2 pl-4">
              {company.what_is_the_product.map((product, index) => (
                <li key={index} className="text-[#4A4A4A] leading-relaxed">
                  {product}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState type="product" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;