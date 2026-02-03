"use client";
import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Shopify Product - corrected type
type Product = {
  id: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText: string | null;
  } | null;
};

// Props for ProductModal
type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

// Product Modal Component
export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    // When open, lock scrolling
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            
            // Lock scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            return () => {
                // Restore scroll on cleanup
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") { onClose(); }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]); // Removed isOpen from dependencies

    // Don't render if closed
    if (!isOpen || !product) return null;

    // Close when clicking outside modal
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={handleOutsideClick}
                >
                    {/* Modal container w/ animation and gradient */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ 
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-6 right-6 z-10 text-gray-600 hover:text-gray-900 text-2xl leading-none bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            &times;
                        </motion.button>

                        {/* Responsive layout: stacked on mobile, 2-column on desktop */}
                        <div className="flex flex-col md:flex-row overflow-hidden">
                            {/* Image section - left on desktop, top on mobile */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="w-full md:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 relative"
                            >
                                {product.featuredImage ? (
                                    <img
                                        src={product.featuredImage.url}
                                        alt={product.featuredImage.altText || product.title}
                                        className="w-full h-80 md:h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-80 md:h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500">
                                        <svg className="w-24 h-24 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </motion.div>

                            {/* Product info section - right on desktop, bottom on mobile */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between"
                            >
                                <div className="space-y-6">
                                    {/* Product Title */}
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                        className="dm-text-regular text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight"
                                    >
                                        {product.title}
                                    </motion.h2>
                                    
                                    {/* Product Price */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, duration: 0.3 }}
                                        className="inline-block"
                                    >
                                        <div className="roboto-flex bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-md">
                                            <div className="text-sm font-medium uppercase tracking-wider opacity-90">Price</div>
                                            <div className="text-3xl md:text-4xl font-bold">
                                                ${product.priceRange.minVariantPrice.amount}
                                            </div>
                                            <div className="text-sm font-medium opacity-90">
                                                {product.priceRange.minVariantPrice.currencyCode}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Product Description */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.3 }}
                                        className="text-gray-600 leading-relaxed"
                                    >
                                        <p className="text-base">
                                            Experience premium quality and exceptional craftsmanship with this carefully selected product.
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Buy button with enhanced styling */}
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ delay: 0.45, duration: 0.3 }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-8"
                                    onClick={() => alert(`Purchased ${product.title}!`)}
                                >
                                    Add to Cart
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};