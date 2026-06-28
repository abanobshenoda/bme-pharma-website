import { notFound, permanentRedirect } from "next/navigation";
import { getProductById } from "@/actions/store-actions";
import { slugify } from "@/lib/utils";

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

  const slug = slugify(productRes.data.english_name);
  permanentRedirect(`/product/${slug}`);
}
