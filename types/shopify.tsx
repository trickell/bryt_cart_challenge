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

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  priceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  images?: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: ShopifyMoney;
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyProductEdge {
  node: ShopifyProductNode;
}