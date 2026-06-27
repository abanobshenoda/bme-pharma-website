import { Suspense } from "react";
import { ProductsClientPage } from "./products-client-page";
import { getProducts, getProductsPage } from "@/actions/store-actions";

export default async function ProductsMarketingPage() {
  const [prodRes, pageRes] = await Promise.all([
    getProducts(),
    getProductsPage(),
  ]);

  const initialProducts = prodRes.success ? (prodRes.data as any) : [];
  const pageDetails = pageRes.success ? (pageRes.data as any) : null;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-20 text-center text-muted-foreground">
          Loading Products...
        </div>
      }
    >
      <ProductsClientPage
        initialProducts={initialProducts}
        pageDetails={pageDetails}
      />
    </Suspense>
  );
}
