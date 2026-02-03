"use client";
import { useState } from "react";
import { ProductModal } from "./ProductModal";

// Define the product types based on Shopify's structure
interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  // Add other product fields you're using
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {    
    node: {
    url: string;
    altText?: string;
    };    
  };
  // Add any other fields your product has
}

interface ProductEdge {
  node: ProductNode;
}

interface ProductModalContainerProps {
  products: ProductEdge[];
  children: React.ReactNode;
}

export const ProductModalContainer = ({ products, children }: ProductModalContainerProps) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductNode | null>(null);

    return (
       <>
         {/* Render children with modal state */}
         <div onClick={(e) => {
           const productId = (e.target as HTMLElement)
             .closest('[data-product-id]')
             ?.getAttribute('data-product-id');
           
           if (productId) {
             const product = products?.find((edge: ProductEdge) => 
               edge.node.id === productId
             )?.node;
             
             if (product) {
               setSelectedProduct(product);
             }
           }
         }}>
           {children}
         </div>

         <ProductModal
           product={selectedProduct}
           isOpen={!!selectedProduct}
           onClose={() => setSelectedProduct(null)}
         />
       </>
     );
   };