import * as Components from "./components";
import { client } from "@/lib/shopify/serverClient";
import { getShop, getProducts } from "@/lib/shopify/graphql/query";

export default async function Home() {
  "use cache";
  const resp = await client.request(getShop);
  const productsResp = await client.request(getProducts);
  console.log("Products:", productsResp);
  return (
    <Components.NameInputRoot initialValue="world">
      <main className="w-screen h-screen flex flex-col gap-8 justify-center items-center max-w-2xl mx-auto">
        <h1 className="text-6xl">
          Hello <Components.NameDisplay /> and good luck 😄!
        </h1>
        {resp.data?.shop.name && (
          <h2 className="text-4xl">Store name: {resp.data?.shop?.name}</h2>
        )}

        <div className="grid grid-cols-2 gap-4 w-full">
          {productsResp.data?.products.edges.map((edge: any) => (
            <div key={edge.node.id} className="border border-gray-300 p-4 rounded">
              <h3 className="text-xl">{edge.node.title}</h3>
            </div>
          ))}
        </div>

        <form>
          <Components.NameInput
            className="border-2 border-yellow-500 rounded p-4 text-2xl w-full dark:bg-black dark:text-gray-300 dark:placeholder:text-gray-400"
            name="name"
            placeholder="name"
          />
        </form>
      </main>
    </Components.NameInputRoot>
  );
}
