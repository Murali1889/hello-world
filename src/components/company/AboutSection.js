import { Briefcase, Zap, Users } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-800 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            About {company.company_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700">
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

      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-800 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            What is the Product?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700">
            {company.what_is_the_product ? (
              company.what_is_the_product
            ) : (
              <span className="text-gray-500 italic">
                {getRandomMessage('product')}
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg md:col-span-2">
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-800 flex items-center">
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
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-200"
                  >
                    {client}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 italic text-center">
                  {getRandomMessage('clients')}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;