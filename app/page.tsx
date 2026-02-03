import * as Components from "./components";
import { client } from "@/lib/shopify/serverClient";
import { getShop, getProducts } from "@/lib/shopify/graphql/query";
import { ProductModalContainer } from "./ProductModalContainer";
import { CartIcon } from "./CartIcon";

export default async function Home() {
  "use cache";
  const resp = await client.request(getShop);
  const productsResp = await client.request(getProducts);
  console.log("Products:", productsResp);
  
  return (
    <>
    <Components.NameInputRoot initialValue="world">
      <ProductModalContainer products={productsResp.data?.products?.edges || []}>
      <main className="w-screen min-h-screen py-12 flex flex-col gap-8 items-center max-w-6xl mx-auto">
        {/* Header with cart icon */}
        <div className="w-full flex justify-end mb-4">
          <CartIcon />
        </div>

        {/* <h1 className="text-6xl">
          Hello <Components.NameDisplay /> and good luck 😄!
        </h1> */}
        {resp.data?.shop.name && (
          <h2 className="text-6xl dm-text-regular text-slate-100">Store name: {resp.data?.shop?.name}</h2>
        )}

        <div className="grid grid-cols-2 gap-5 w-full">
          {productsResp.data?.products?.edges?.map((edge: any) => (
            <div key={edge.node.id} className="bg-gray-800 border border-gray-700 overflow-hidden rounded cursor-pointer hover:shadow-2xl hover:shadow-blue-400/50 transition-shadow duration-300" data-product-id={edge.node.id}>
              <h3 className="text-xl p-4 dm-text-regular bg-gray-900 text-white">{edge.node.title}</h3>
              <p className="m-4 text-lg roboto-flex text-gray-300">${edge.node.priceRange.minVariantPrice.amount}</p>
              {edge.node.featuredImage && (
                <img src={edge.node.featuredImage.url} alt={edge.node.featuredImage.altText} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              )}
            </div>
          ))}
        </div>

        {/* <form>
          <Components.NameInput
            className="border-2 border-yellow-500 rounded p-4 text-2xl w-full dark:bg-black dark:text-gray-300 dark:placeholder:text-gray-400"
            name="name"
            placeholder="name"
          />
        </form> */}
      </main>
      </ProductModalContainer>
    </Components.NameInputRoot>
    </>
  );
}
