"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VariantSelector } from "./VariantSelector";
import { useCart } from "./CartContext";

// Shopify Product - corrected type
type Product = {
  id: string;
  title: string;
  options?: Array<{ id: string; name: string; values: string[] }>;
  variants?: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        image?: { url: string; altText?: string };
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
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
};

type ButtonState = "idle" | "loading" | "success";

// Product Modal Component
export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    const { addItem } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<
      Product["variants"]["edges"][0]["node"] | null
    >(null);
    const [buttonState, setButtonState] = useState<ButtonState>("idle");

    // Set initial variant when product changes
    useEffect(() => {
      if (product?.variants?.edges?.[0]?.node) {
        setSelectedVariant(product.variants.edges[0].node);
      }
      setButtonState("idle");
    }, [product?.id]);

    const displayPrice = selectedVariant?.price || product?.priceRange.minVariantPrice;
    const displayImage = selectedVariant?.image || product?.featuredImage;

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
    }, [onClose]);

    // Don't render if closed
    if (!isOpen || !product) return null;

    // Close when clicking outside modal
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const variants = product.variants?.edges?.map((edge) => edge.node) || [];
    const options = product.options || [];

    const handleAddToBag = async () => {
      if (!selectedVariant) return;

      // Start loading state
      setButtonState("loading");

      // Simulate async request with deterministic delay (800-1200ms)
      const delay = 800 + Math.random() * 400;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Add item to cart
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        productTitle: product.title,
        price: selectedVariant.price,
        image: selectedVariant.image || product.featuredImage,
        selectedOptions: selectedVariant.selectedOptions,
      });

      // Show success state
      setButtonState("success");

      // After 1-2 seconds, close modal and reset
      const resetDelay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, resetDelay));

      setButtonState("idle");
      onClose();
    };

    const isVariantValid =
      selectedVariant && selectedVariant.availableForSale;
    const isButtonDisabled =
      !isVariantValid || buttonState !== "idle";

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
                                {displayImage ? (
                                    <img
                                        key={displayImage.url}
                                        src={displayImage.url}
                                        alt={displayImage.altText || product.title}
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
                                className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh]"
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
                                    
                                    {/* Variant Selector */}
                                    {options.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.32, duration: 0.3 }}
                                        >
                                            <VariantSelector
                                                options={options}
                                                variants={variants}
                                                onVariantChange={setSelectedVariant}
                                            />
                                        </motion.div>
                                    )}
                                    
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
                                                ${displayPrice?.amount}
                                            </div>
                                            <div className="text-sm font-medium opacity-90">
                                                {displayPrice?.currencyCode}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Availability */}
                                    {selectedVariant && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`text-sm font-semibold ${
                                                selectedVariant.availableForSale
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {selectedVariant.availableForSale
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </motion.div>
                                    )}

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
                                    whileHover={!isButtonDisabled ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
                                    transition={{ delay: 0.45, duration: 0.3 }}
                                    disabled={isButtonDisabled}
                                    className={`w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all mt-8 ${
                                      buttonState === "success"
                                        ? "bg-gradient-to-r from-green-600 to-green-700"
                                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    }`}
                                    onClick={handleAddToBag}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                      {buttonState === "loading" && (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                          }}
                                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                      )}
                                      {buttonState === "success" && (
                                        <motion.svg
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-5 h-5"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </motion.svg>
                                      )}
                                      <span className="text-white">
                                        {buttonState === "loading"
                                          ? "Adding..."
                                          : buttonState === "success"
                                            ? "Added!"
                                            : "Add to Bag"}
                                      </span>
                                    </div>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
