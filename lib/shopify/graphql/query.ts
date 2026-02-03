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
          options {
            id
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
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
