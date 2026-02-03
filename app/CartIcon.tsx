"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

export const CartIcon = () => {
  const { items, removeItem, getTotalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Shopping cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>

        {/* Badge with item count */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cart Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shopping Bag</h2>

              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 border-b pb-3"
                      >
                        {item.image && (
                          <img
                            src={item.image.url}
                            alt={item.image.altText || item.productTitle}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">
                            {item.productTitle}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {item.selectedOptions
                              .map((o) => `${o.name}: ${o.value}`)
                              .join(", ")}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm font-bold text-blue-600">
                              ${item.price.amount} × {item.quantity}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.variantId)}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${totalPrice}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Checkout
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
