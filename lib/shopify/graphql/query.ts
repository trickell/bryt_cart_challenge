export const getShop = `#graphql
  query getShop {
    shop {
      name
      description
    }
  }
` as const;

export const getProducts = `#graphql
  query getProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
        }
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
` as const;
