//app/(root)/marketplace/product/[productId]/page.tsx
import { notFound } from 'next/navigation';
import { getProductDetails } from '@/features/root/marketplace/product/server/db/get-product-details';
import { ProductPage } from '@/features/root/marketplace/product/components/ProductPage';

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {

  const { productId } = await params;

  const product = await getProductDetails(productId);

  if (!product) {
    notFound(); // Redirect to 404 page if the product is not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductPage product={product} />
    </div>
  );
}
