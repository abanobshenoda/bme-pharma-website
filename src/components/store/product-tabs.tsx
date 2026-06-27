"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { useStore } from "@/context/store-context";
import { Product } from "@/types";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabKey = "info" | "return" | "related";

interface ProductTabsProps {
  product: Product;
  relatedProducts?: Product[];
}

export const ProductTabs = ({
  product,
  relatedProducts = [],
}: ProductTabsProps) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("related");

  const tabs: { key: TabKey; label: string }[] = [
    {
      key: "info",
      label: language === "ar" ? "مزيد من المعلومات" : "More Information",
    },
    {
      key: "return",
      label: language === "ar" ? "سياسة الإرجاع" : "Return Policy",
    },
    {
      key: "related",
      label: language === "ar" ? "منتجات ذات صلة" : "Related Products",
    },
  ];

  return (
    <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4 md:p-6">
      {/* Tab Triggers */}
      <div className="flex items-center gap-2 md:gap-6 mb-5 border-b border-primary/20 dark:border-primary/30 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            tabIndex={0}
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "text-sm md:text-base font-bold italic px-2 md:px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "text-primary dark:text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>
            {language === "ar"
              ? product.description?.ar || "لا يوجد وصف تفصيلي."
              : product.description?.en || "No detailed description available."}
          </p>
          {product.sku && (
            <p className="mt-3">
              <span className="font-semibold text-foreground">
                {language === "ar" ? "رمز المنتج:" : "SKU:"}
              </span>{" "}
              {product.sku}
            </p>
          )}
          {product.stock !== undefined && (
            <p className="mt-1">
              <span className="font-semibold text-foreground">
                {language === "ar" ? "المخزون:" : "Stock:"}
              </span>{" "}
              {product.stock} {language === "ar" ? "وحدة" : "units"}
            </p>
          )}
        </div>
      )}

      {activeTab === "return" && (
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            {language === "ar"
              ? "يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام بشرط أن يكون في حالته الأصلية."
              : "You may return the product within 14 days of receipt, provided it is in its original condition and packaging."}
          </p>
          <p>
            {language === "ar"
              ? "يرجى التواصل مع خدمة العملاء لبدء عملية الإرجاع."
              : "Please contact our customer service team to initiate a return."}
          </p>
        </div>
      )}

      {activeTab === "related" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts
              .slice(0, 4)
              .map((relProduct) => (
                <RelatedProductCard key={relProduct.id} product={relProduct} />
              ))
          ) : (
            <p className="col-span-full text-center text-sm text-muted-foreground py-6">
              {language === "ar"
                ? "لا توجد منتجات ذات صلة."
                : "No related products available."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Small Related Product Card ─── */

const RelatedProductCard = ({ product }: { product: Product }) => {
  const { formatPrice } = useCurrency();
  const { language } = useLanguage();
  const { toggleWishlist, isInWishlist } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const name = language === "ar" ? product.name.ar : product.name.en;
  const rating = product.rating || 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(
        language === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites",
      );
    } else {
      toast.info(
        language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites",
      );
    }
  };

  return (
    <a
      href={`/store/${product.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative aspect-4/3 bg-muted overflow-hidden">
        <Image
          src={product.image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded">
          {language === "ar" ? "مميز" : "Featured"}
        </span>

        {/* Heart */}
        <button
          type="button"
          aria-label="Toggle wishlist"
          tabIndex={0}
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5",
              isWishlisted
                ? "text-red-500 fill-current"
                : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col gap-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {product.category}
        </span>
        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h4>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {rating.toFixed(1)} {language === "ar" ? "تقييم" : "Rating"}
          </span>
        </div>
      </div>
    </a>
  );
};
