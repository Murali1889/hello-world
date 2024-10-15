import React, {useState} from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function PortfolioTab({ productsData, loading, error }) {
  const [openDialog, setOpenDialog] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!productsData || productsData.length === 0) {
    return <div className="text-center py-8">No data available</div>;
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${openDialog !== null ? 'blur-sm' : ''}`}>
        {productsData.map((product, index) => (
          product.product_name && (
            <Card key={index} className="h-full flex flex-col">
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">
                  <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {product?.product_name}
                  </a>
                </h3>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="list-disc pl-5">
                    {product.product_features.split('\n').slice(0, 5).map((feature, featureIndex) => (
                      <li key={featureIndex} className="mb-1">{feature.trim().replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Use Cases:</h4>
                  <ul className="list-disc pl-5">
                    {product.product_use_cases.split('\n').slice(0, 5).map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="mb-1">{useCase.trim().replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => setOpenDialog(index)} 
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  View More
                </Button>
              </CardContent>
            </Card>
          )
        ))}
      </div>

      {productsData.map((product, index) => (
        <AlertDialog key={index} open={openDialog === index} onOpenChange={() => setOpenDialog(null)}>
          <AlertDialogContent className="max-w-3xl bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {product.product_name}
                </a>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription asChild>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <h4 className="font-medium mb-2">All Features:</h4>
                    <ul className="list-disc pl-5">
                      {product.product_features.split('\n').map((feature, featureIndex) => (
                        <li key={featureIndex} className="mb-1">{feature.trim().replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-1/2 pl-2">
                    <h4 className="font-medium mb-2">All Use Cases:</h4>
                    <ul className="list-disc pl-5">
                      {product.product_use_cases.split('\n').map((useCase, useCaseIndex) => (
                        <li key={useCaseIndex} className="mb-1">{useCase.trim().replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </AlertDialogDescription>
            <AlertDialogCancel className="mt-4">Close</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  );
}
