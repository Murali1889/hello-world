import { useState } from 'react';
import { Clock, PackageSearch, ArrowRight, AlertCircle, Zap } from 'lucide-react';
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
          <div className="absolute inset-0 bg-[#1B365D]/5 rounded-full animate-ping" />
          <div className="relative bg-[#F8F9FC] rounded-full p-6">
            <PackageSearch className="w-12 h-12 text-[#1B365D]" />
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#1B365D] mb-3">
          Product Information Coming Soon
        </h2>
        <div className="inline-flex items-center justify-center bg-[#1B365D] text-white px-6 py-3 rounded-full">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-base font-medium">Updating in 4h</span>
        </div>
      </div>

      <div className="max-w-md text-center space-y-3">
        <p className="text-[#4A4A4A] text-base">
          We're gathering and verifying product information to provide you with accurate details
        </p>
        
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-[#FF8C69] rounded-full animate-pulse" />
            <span className="text-[#1B365D] font-medium text-sm">Processing Information</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-[#4A4A4A]">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-[#1B365D]" />
              <span>Features Loading</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-[#1B365D]" />
              <span>Use Cases Updating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductNotFoundState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="mb-8">
        <div className="relative bg-[#F8F9FC] rounded-full p-6">
          <AlertCircle className="w-12 h-12 text-[#1B365D]" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#1B365D] mb-3">
          No Products Found
        </h2>
        <div className="inline-flex items-center justify-center bg-[#F8F9FC] text-[#1B365D] px-6 py-3 rounded-full">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-base font-medium">Coming Soon</span>
        </div>
      </div>

      <div className="max-w-md text-center">
        <p className="text-[#4A4A4A] text-base">
          {message}
        </p>
      </div>
    </div>
  );
};

const FeaturesList = ({ items, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayItems = items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="space-y-2">
      <h4 className="text-[#1B365D] font-semibold text-base mb-3 flex items-center gap-2">
        {title}
        {hasMore && (
          <span className="text-xs bg-[#F8F9FC] text-[#1B365D] px-2 py-1 rounded-full">
            {items.length}
          </span>
        )}
      </h4>
      <ul className="space-y-2">
        {displayItems.map((item, idx) => (
          <li
            key={idx}
            className="text-[#4A4A4A] text-sm flex items-start group"
          >
            <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-[#1B365D] rounded-full flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="text-[#1B365D] hover:text-[#FF8C69] transition-colors text-sm font-medium inline-flex items-center gap-1">
              Show all {items.length} {title.toLowerCase()}
              <ArrowRight className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-[#1B365D] text-lg font-semibold flex items-center gap-2">
                {title}
                <span className="text-sm bg-[#F8F9FC] px-2 py-1 rounded-full">
                  {items.length} total
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={idx} className="text-[#4A4A4A] text-sm flex items-start">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-[#1B365D] rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="group bg-white rounded-2xl border border-[#F0F0F0] shadow-[0px_2px_4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div className="bg-[#F8F9FC] p-4 rounded-t-2xl">
      <h3 className="text-[#1B365D] font-semibold text-base leading-relaxed">
        {product.title || product.name}
      </h3>
    </div>
    <div className="p-4 space-y-4">
      {product.features?.length > 0 && (
        <FeaturesList items={product.features} title="Features" />
      )}

      {product.use_cases?.length > 0 && (
        <FeaturesList items={product.use_cases} title="Use Cases" />
      )}

      {product.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-[#1B365D] hover:text-[#FF8C69] transition-colors font-medium text-sm group"
        >
          Learn more
          <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  </div>
);

const ProductSection = ({ products }) => {
  console.log(products)
  // If products is a string, show the not found state with the message
  if (typeof products === 'string') {
    return <ProductNotFoundState message={products} />;
  }

  // If no products or empty array, show empty state
  if (!products || products.length === 0) {
    return <ProductEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductSection;