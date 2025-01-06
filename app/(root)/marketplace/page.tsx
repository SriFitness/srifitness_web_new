import MarketplacePage from "@/features/root/marketplace/components/MarketplacePage";
import { getProducts } from "@/features/root/marketplace/server/actions/products";
import { Product } from "@/types/product";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {

  const products: Product[] = await getProducts();

  return (
    <div >
      <Suspense fallback={<Loading />}>
        <MarketplacePage initialProducts={products} />
      </Suspense>
    </div>
  )
}

