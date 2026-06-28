import { MetadataRoute } from "next";
import { getProducts } from "@/actions/store-actions";
import { slugify } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.bmepharma.com";

  // Fetch products from database
  const productsRes = await getProducts();
  const productUrls =
    productsRes.success && productsRes.data
      ? productsRes.data.map((product) => ({
          url: `${baseUrl}/product/${slugify(product.english_name)}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

  // Static pages
  const routes = [
    "",
    "/store",
    "/products",
    "/about-us",
    "/contact-us",
    "/gallery",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes, ...productUrls];
}
