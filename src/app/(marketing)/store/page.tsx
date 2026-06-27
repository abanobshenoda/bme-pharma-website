import { Suspense } from "react";
import { StoreClientPage } from "./store-client-page";
import { getProducts, getStorePage } from "@/actions/store-actions";
import { getCategories } from "@/actions/category-actions";

export default async function StorePage() {
  const [prodRes, catRes, pageRes] = await Promise.all([
    getProducts(),
    getCategories(),
    getStorePage(),
  ]);

  const initialProducts = prodRes.success ? (prodRes.data as any) : [];
  const categories = catRes.success ? (catRes.data as any) : [];
  const pageDetails = pageRes.success ? (pageRes.data as any) : null;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-20 text-center text-muted-foreground">
          Loading Store...
        </div>
      }
    >
      <StoreClientPage
        initialProducts={initialProducts}
        categories={categories}
        pageDetails={pageDetails}
      />
    </Suspense>
  );
}
