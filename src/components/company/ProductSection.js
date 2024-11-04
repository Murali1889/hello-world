import { TrendingUp, Sparkles, Target, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const ProductSection = ({ products }) => {
  // Fun fallback messages
  const getRandomMessage = (type) => {
    const messages = {
      noProducts: [
        "Our product showcase is as empty as a programmer's social calendar! 🤓",
        "Products are like buses - none for ages, then they all come at once! 🚌",
        "Watch this space - future awesome products loading... ⌛"
      ],
      noFeatures: [
        "Features are playing hide and seek right now! 🙈",
        "Features list is on vacation, back soon! 🏖️",
        "The features are still in stealth mode 🕵️‍♂️"
      ],
      noUseCases: [
        "Use cases are brainstorming new ideas! 🧠",
        "Use cases went for coffee, be right back! ☕",
        "The use cases are still in the testing phase 🔬"
      ]
    };
    return messages[type][Math.floor(Math.random() * messages[type].length)];
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 italic">
        {getRandomMessage('noProducts')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-blue-800 font-medium">
        {products.length} Product{products.length !== 1 ? 's' : ''} Available
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <Card key={index} className="bg-white border-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
            <CardHeader className="bg-blue-50 p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-blue-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {product.name || "Mystery Product ✨"}
                </CardTitle>
                {product.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(product.url, '_blank')}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 -mt-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Features Section */}
              <div className="space-y-2">
                <h3 className="text-blue-800 flex items-center text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Key Features
                </h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-gray-700 text-sm pl-6 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                    {product.features.length > 3 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
                            +{product.features.length - 3} more features
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-blue-800">All Features - {product.name}</DialogTitle>
                          </DialogHeader>
                          <ul className="space-y-2 mt-4">
                            {product.features.map((feature, idx) => (
                              <li key={idx} className="text-gray-700 pl-6 relative">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">{getRandomMessage('noFeatures')}</p>
                )}
              </div>

              {/* Use Cases Section */}
              <div className="space-y-2">
                <h3 className="text-blue-800 flex items-center text-sm font-medium">
                  <Target className="w-4 h-4 mr-2" />
                  Use Cases
                </h3>
                {product.use_cases && product.use_cases.length > 0 ? (
                  <ul className="space-y-2">
                    {product.use_cases.slice(0, 3).map((useCase, idx) => (
                      <li key={idx} className="text-gray-700 text-sm pl-6 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {useCase}
                      </li>
                    ))}
                    {product.use_cases.length > 3 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
                            +{product.use_cases.length - 3} more use cases
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-blue-800">All Use Cases - {product.name}</DialogTitle>
                          </DialogHeader>
                          <ul className="space-y-2 mt-4">
                            {product.use_cases.map((useCase, idx) => (
                              <li key={idx} className="text-gray-700 pl-6 relative">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">{getRandomMessage('noUseCases')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;