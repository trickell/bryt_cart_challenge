export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  image?: ShopifyImage;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  options?: ShopifyOption[];
  variants?: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  priceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  images?: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  featuredImage?: ShopifyImage;
}

export interface ShopifyProductEdge {
  node: ShopifyProductNode;
}