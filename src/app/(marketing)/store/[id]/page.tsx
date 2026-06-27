import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/actions/store-actions";
import { SingleProductClient } from "./single-product-client";

interface SingleProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleProductPage({
  params,
}: SingleProductPageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const productRes = await getProductById(productId);

  if (!productRes.success || !productRes.data) {
    notFound();
  }

  const product = productRes.data;

  // Fetch related products from the same category (exclude current product)
  const allProductsRes = await getProducts();
  const relatedProducts =
    allProductsRes.success && allProductsRes.data
      ? (allProductsRes.data as any[])
          .filter(
            (p) => p.categoryId === product.categoryId && p.id !== product.id,
          )
          .slice(0, 4)
      : [];

  // Map DB product to the Product type expected by child components
  const mappedProduct = {
    id: product.id.toString(),
    name: {
      en: product.english_name,
      ar: product.arabic_name || product.english_name,
    },
    price: product.price || 0,
    currency: product.currency as any,
    discount: product.discount || 0,
    image: product.image || "/placeholder-product.png",
    images:
      product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [],
    category: (product as any).category?.english_name || "",
    categoryId: product.categoryId,
    description: {
      en: product.english_description || "",
      ar: product.arabic_description || "",
    },
    sku: product.sku || undefined,
    stock: product.stock ?? 0,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
  };

  const mappedRelated = relatedProducts.map((p: any) => ({
    id: p.id.toString(),
    name: { en: p.english_name, ar: p.arabic_name || p.english_name },
    price: p.price || 0,
    currency: p.currency,
    discount: p.discount || 0,
    image: p.image || "/placeholder-product.png",
    category: p.category?.english_name || "",
    stock: p.stock ?? 0,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
  }));

  return (
    <SingleProductClient
      product={mappedProduct}
      relatedProducts={mappedRelated}
    />
  );
}
