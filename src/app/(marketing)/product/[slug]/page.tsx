import { notFound } from "next/navigation";
import { getProducts } from "@/actions/store-actions";
import { SingleProductClient } from "@/app/(marketing)/store/[id]/single-product-client";
import { slugify } from "@/lib/utils";
import type { Product, Category } from "@/generated/prisma/client";

interface SingleProductSlugPageProps {
  params: Promise<{ slug: string }>;
}

type ProductWithCategories = Product & {
  categories: Category[];
};

export default async function SingleProductSlugPage({
  params,
}: SingleProductSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch all products to find the one matching the slug
  const allProductsRes = await getProducts();
  if (!allProductsRes.success || !allProductsRes.data) {
    notFound();
  }

  const allProducts = allProductsRes.data as ProductWithCategories[];

  const product = allProducts.find(
    (p) => slugify(p.english_name) === slug
  );

  if (!product) {
    notFound();
  }

  // Get the IDs of this product's categories
  const productCategoryIds: number[] = product.categories.map((c) => c.id);

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((c) => productCategoryIds.includes(c.id))
    )
    .slice(0, 4);

  // Map DB product to the Product type expected by child components (same mapping as store/[id]/page.tsx)
  const mappedProduct = {
    id: product.id.toString(),
    name: {
      en: product.english_name,
      ar: product.arabic_name || product.english_name,
    },
    price: product.price || 0,
    currency: product.currency as "USD" | "EGP",
    discount: product.discount || 0,
    discountType: product.discountType as "PERCENTAGE" | "BUY_X_GET_Y",
    buyXQuantity: product.buyXQuantity ?? undefined,
    getYQuantity: product.getYQuantity ?? undefined,
    image: product.image || "/placeholder-product.png",
    images:
      product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [],
    category: product.categories[0]?.english_name || "",
    categoryId: product.categories[0]?.id.toString() || "",
    description: {
      en: product.english_description || "",
      ar: product.arabic_description || "",
    },
    sku: product.sku || undefined,
    stock: product.stock ?? 0,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
  };

  const mappedRelated = relatedProducts.map((p) => ({
    id: p.id.toString(),
    name: { en: p.english_name, ar: p.arabic_name || p.english_name },
    price: p.price || 0,
    currency: p.currency as "USD" | "EGP",
    discount: p.discount || 0,
    discountType: p.discountType as "PERCENTAGE" | "BUY_X_GET_Y",
    buyXQuantity: p.buyXQuantity ?? undefined,
    getYQuantity: p.getYQuantity ?? undefined,
    image: p.image || "/placeholder-product.png",
    category: p.categories[0]?.english_name || "",
    categoryId: p.categories[0]?.id.toString() || "",
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
