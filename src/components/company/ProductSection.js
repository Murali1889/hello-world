import { useState } from 'react';
import { Clock, PackageSearch, ArrowRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const ProductEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-[#000040]/5 rounded-full animate-ping" />
          <div className="relative bg-[#F0F1F9] rounded-full p-6">
            <PackageSearch className="w-12 h-12 text-[#000040]" />
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-[#000040] mb-3">
          Product Catalog Update
        </h2>
        <div className="inline-flex items-center justify-center bg-[#000040] text-white px-8 py-3 rounded-full">
          <Clock className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">4h remaining</span>
        </div>
      </div>

      <div className="max-w-md text-center space-y-4">
        <p className="text-gray-600 text-lg">
          We're enhancing our product catalog with new features and improvements
        </p>
        <div className="inline-flex items-center gap-2 bg-[#F0F1F9] px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-[#000040] rounded-full animate-pulse" />
          <span className="text-[#000040] font-medium">Status: Updating</span>
        </div>
      </div>
    </div>
  );
};

const FeaturesList = ({ items, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayItems = items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#000040]">{title}</h4>
        <ul className="space-y-2">
          {displayItems.map((item, idx) => (
            <li 
              key={idx} 
              className="text-sm text-gray-600 flex items-start group-hover:translate-x-1 transition-transform duration-300"
            >
              <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-[#000040] rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        {hasMore && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="text-sm text-[#000040] hover:text-black transition-colors">
                Show all {items.length} {title.toLowerCase()}...
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#000040]">All {title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ul className="space-y-3">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#000040] rounded-full flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

const ProductSection = ({ products }) => {
  if (!products || products.length === 0) {
    return <ProductEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {products.map((product, index) => (
        <div 
          key={index}
          className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#000040]/20"
        >
          <div className="bg-[#F0F1F9] p-4 border-b border-gray-200">
            <h3 className="text-[#000040] font-medium">{product.name}</h3>
          </div>
          <div className="p-6">
            {/* Features Section */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <FeaturesList items={product.features} title="Features" />
              </div>
            )}

            {/* Use Cases Section */}
            {product.use_cases && product.use_cases.length > 0 && (
              <div className="mb-6">
                <FeaturesList items={product.use_cases} title="Use Cases" />
              </div>
            )}

            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-sm text-[#000040] hover:text-black transition-colors group"
              >
                Learn more
                <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSection;