import { Briefcase, Zap, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const AboutSection = ({ company }) => {
  // Fun fallback messages for different sections
  const fallbackMessages = {
    about: [
      "This company is playing hide and seek with their about section! 🙈",
      "The about section is still being written by Shakespeare... ✍️",
      "This company is keeping their story mysterious for now 🕵️‍♂️"
    ],
    product: [
      "Product details are cooking in the innovation kitchen! 👨‍🍳",
      "The product is so cutting-edge, words haven't been invented to describe it yet! 🚀",
      "This product is playing hard to get... Check back later! 🎭"
    ],
    clients: [
      "No clients yet - they're probably just being fashionably late! ⏰",
      "The client list is as empty as a developer's coffee cup at 9am ☕",
      "Clients are like stars - they'll shine here soon! ✨"
    ]
  };

  // Get random fallback message for each section
  const getRandomMessage = (section) => {
    const messages = fallbackMessages[section];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const ClientsEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#000040]/5 rounded-full animate-ping" />
            <div className="bg-[#F0F1F9] p-2 rounded-full">
              <Users className="w-5 h-5 text-[#000040]" />
            </div>
          </div>
          {/* <span className="text-[#000040] font-medium">Client List</span> */}
        </div>

        <div className="flex items-center gap-2 bg-[#F0F1F9] px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-[#000040]" />
          <span className="text-sm text-[#000040]">Updating in 4h</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600">Processing</span>
        </div>
      </div>
    );
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* About Card */}
      <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
        <CardHeader className="bg-[#F0F1F9] p-4 border-b border-gray-100">
          <CardTitle className="text-[#000040] flex items-center text-lg font-semibold">
            <Briefcase className="w-5 h-5 mr-2" />
            About {company.company_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {company.about ? (
              company.about
            ) : (
              <span className="text-gray-500 italic">
                {getRandomMessage('about')}
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Product Card */}
      <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
        <CardHeader className="bg-[#F0F1F9] p-4 border-b border-gray-100">
          <CardTitle className="text-[#000040] flex items-center text-lg font-semibold">
            <Zap className="w-5 h-5 mr-2" />
            What is the Product?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {company.what_is_the_product ? (
            <ul className="list-disc space-y-2 pl-4">
              {company.what_is_the_product.map((product, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {product}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500 italic">
              {getRandomMessage('product')}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Clients Card */}
      <Card className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 md:col-span-2">
        <CardHeader className="bg-[#F0F1F9] p-4 border-b border-gray-100">
          <CardTitle className="text-[#000040] flex items-center text-lg font-semibold">
            <Users className="w-5 h-5 mr-2" />
            All Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-32 w-full">
            {company.clients && company.clients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {company.clients.map((client, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#F0F1F9] text-[#000040] px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-[#000040]/10"
                  >
                    {client}
                  </Badge>
                ))}
              </div>
            ) : (
              <ClientsEmptyState />
            )}
          </ScrollArea>
        </CardContent>

      </Card>
    </div>
  );
};

export default AboutSection;