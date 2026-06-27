"use client";

import { useLanguage } from "@/context/language-context";
import { ProductImageGallery } from "@/components/store/product-images";
import { ProductInfo } from "@/components/store/product-info";
import { ProductTabs } from "@/components/store/product-tabs";
import type { Product } from "@/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SingleProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const SingleProductClient = ({
  product,
  relatedProducts,
}: SingleProductClientProps) => {
  const { t, language } = useLanguage();

  const getName = () => (language === "ar" ? product.name.ar : product.name.en);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                {t("header.home") || (language === "ar" ? "الرئيسية" : "Home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/store">
                {t("header.store") || (language === "ar" ? "المتجر" : "Store")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/store?category=${(product as any).categoryId || product.category}`}
              >
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage>{getName()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Card */}
      <div className="rounded-3xl border-2 border-primary/20 dark:border-primary/30 bg-card p-4 md:p-8 shadow-sm">
        {/* Top Section: Image + Info */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-8">
          <ProductImageGallery
            mainImage={product.image}
            images={product.images}
            videos={[]}
            title={getName()}
          />
          <ProductInfo product={product} />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
};
