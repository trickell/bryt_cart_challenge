"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Variant {
  id: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

interface Option {
  name: string;
  values: string[];
}

interface VariantSelectorProps {
  options: Option[];
  variants: Variant[];
  onVariantChange: (variant: Variant) => void;
}

export const VariantSelector = ({
  options,
  variants,
  onVariantChange,
}: VariantSelectorProps) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Find the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    return variants.find((variant) => {
      return variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      );
    });
  }, [selectedOptions, variants]);

  // Determine which option values are available given current selections
  const getAvailableValues = (optionName: string): string[] => {
    const partialSelection = { ...selectedOptions };

    return options
      .find((opt) => opt.name === optionName)
      ?.values.filter((value) => {
        partialSelection[optionName] = value;

        // Check if any variant matches this partial selection
        return variants.some((variant) => {
          return Object.entries(partialSelection).every(([name, val]) => {
            return variant.selectedOptions.some(
              (opt) => opt.name === name && opt.value === val
            );
          });
        });
      }) || [];
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newSelection = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelection);

    // Find and notify parent of the matching variant
    const matchingVariant = variants.find((variant) => {
      return variant.selectedOptions.every(
        (option) => newSelection[option.name] === option.value
      );
    });

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <motion.div
          key={option.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {option.name}
          </label>

          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isAvailable = getAvailableValues(option.name).includes(
                value
              );
              const isSelected = selectedOptions[option.name] === value;

              return (
                <motion.button
                  key={value}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  onClick={() =>
                    isAvailable && handleOptionChange(option.name, value)
                  }
                  disabled={!isAvailable}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                      : isAvailable
                        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {value}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
