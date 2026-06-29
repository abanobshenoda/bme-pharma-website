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
  const { language } = useLanguage();

  const getName = () => (language === "ar" ? product.name.ar : product.name.en);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                {language === "ar" ? "الرئيسية" : "Home"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/store">
                {language === "ar" ? "المتجر" : "Store"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/store?category=${product.categoryId || product.category}`}
              >
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {getName().length > 25 ? `${getName().slice(0, 25)}...` : getName()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Card */}
      <div className="rounded-3xl border-2 border-primary/20 dark:border-primary/30 bg-card p-4 md:p-8 shadow-sm overflow-hidden">
        {/* Top Section: Image + Info */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8">
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
