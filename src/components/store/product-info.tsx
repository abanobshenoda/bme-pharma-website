"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { useStore } from "@/context/store-context";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Heart, Gift } from "lucide-react";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useStore();
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = isInWishlist(product.id);
  const stock = product.stock || 0;
  const isOutOfStock = stock === 0;

  const getName = () => (language === "ar" ? product.name.ar : product.name.en);
  const getDescription = () =>
    language === "ar"
      ? product.description?.ar || "لا يوجد وصف."
      : product.description?.en || "No description available.";

  const price = product.price;
  const discount = product.discount || 0;
  const discountedPrice = price - (price * discount) / 100;

  const handleAddToCart = () => {
    if (quantity > stock && !isOutOfStock) {
      toast.error(
        t("product.outOfStock") || "Cannot add more than available stock",
      );
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(t("product.addedToCart") || "Added to cart", {
      description: getName(),
      action: {
        label: t("header.cart") || "View Cart",
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(t("product.addedToWishlist") || "Added to favorites", {
        description: getName(),
        action: {
          label: t("header.wishlist") || "View Wishlist",
          onClick: () => setIsWishlistOpen(true),
        },
      });
    } else {
      toast.info(t("product.removedFromWishlist") || "Removed from favorites", {
        description: getName(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Availability */}
      <div className="text-sm font-semibold text-foreground">
        {language === "ar" ? "التوفر:" : "Availability:"}{" "}
        <span
          className={
            isOutOfStock ? "text-destructive italic" : "text-primary italic"
          }
        >
          {isOutOfStock
            ? language === "ar"
              ? "نفذت الكمية"
              : "Out of Stock"
            : language === "ar"
              ? "متوفر"
              : "In Stock"}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight flex items-center gap-2 flex-wrap select-none">
        <span>{getName()}</span>
        {product.discountType === "PERCENTAGE" && discount > 0 && (
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs border-none shadow-sm">
            {language === "ar" ? `خصم ${discount}%` : `-${discount}%`}
          </Badge>
        )}
        {product.discountType === "BUY_X_GET_Y" && product.buyXQuantity && product.getYQuantity && (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs border-none shadow-sm flex items-center gap-1">
            <Gift className="w-3 h-3" />
            {language === "ar"
              ? `عرض ${product.buyXQuantity} + ${product.getYQuantity} مجاناً`
              : `Buy ${product.buyXQuantity} Get ${product.getYQuantity} Free`}
          </Badge>
        )}
      </h1>

      {/* Prices */}
      <div className="flex items-baseline gap-3">
        <span className="text-xl font-bold text-primary">
          {formatPrice(discountedPrice, product.currency)}
        </span>
        {discount > 0 && (
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(price, product.currency)}
          </span>
        )}
      </div>

      {/* Promotion Details */}
      {product.discountType === "BUY_X_GET_Y" && product.buyXQuantity && product.getYQuantity && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3.5 my-1.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm md:text-base">
              {language === "ar" ? "عرض خاص متوفر!" : "Special Offer Available!"}
            </h4>
            <p className="text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {language === "ar"
                ? product.buyXQuantity === 1
                  ? "اشتري علبة واحصل على هدية مجاناً!"
                  : product.buyXQuantity === 2
                    ? "اشتري علبتين واحصل على هدية مجاناً!"
                    : `اشتري ${product.buyXQuantity} علب واحصل على ${product.getYQuantity} مجاناً!`
                : `Buy ${product.buyXQuantity} box${product.buyXQuantity > 1 ? 'es' : ''} and get ${product.getYQuantity} free!`}
            </p>
          </div>
        </div>
      )}

      {product.discountType === "PERCENTAGE" && discount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10 border border-rose-200/60 dark:border-rose-800/40 flex items-start gap-3.5 my-1.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-center shadow-sm shrink-0 w-10 h-10 flex items-center justify-center">
            <span className="text-base">%</span>
          </div>
          <div>
            <h4 className="font-extrabold text-rose-800 dark:text-rose-300 text-sm md:text-base">
              {language === "ar" ? "وفر أكثر اليوم!" : "Save More Today!"}
            </h4>
            <p className="text-xs md:text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">
              {language === "ar"
                ? `وفر ${discount}% من السعر الأصلي عند الشراء الآن!`
                : `Get ${discount}% off the original price when you order now!`}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-base font-bold italic text-foreground mb-1">
          {language === "ar" ? "الوصف" : "Description"}
        </h3>
        <div className="max-h-[140px] overflow-y-auto pr-2 pl-1 scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <div
            className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: getDescription() }}
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-base font-bold italic text-foreground">
          {language === "ar" ? "الكمية" : "Quantity"}
        </span>
        <button
          type="button"
          aria-label="Decrease quantity"
          tabIndex={0}
          disabled={quantity <= 1 || isOutOfStock}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xl font-bold transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center text-lg font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          tabIndex={0}
          disabled={(stock > 0 && quantity >= stock) || isOutOfStock}
          onClick={() =>
            setQuantity((q) => (stock > 0 ? Math.min(stock, q + 1) : q + 1))
          }
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xl font-bold transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Button
          size="lg"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6"
        >
          {t("product.addToCart") ||
            (language === "ar" ? "أضف للسلة" : "Add To Cart")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleToggleWishlist}
          className={`rounded-full font-bold text-base py-6 border-2 ${
            isWishlisted
              ? "border-red-400 bg-red-50 text-red-500 hover:bg-red-100"
              : "border-muted-foreground/30 text-foreground hover:bg-muted"
          }`}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-current" : ""}`}
          />
          {isWishlisted
            ? language === "ar"
              ? "في المفضلة"
              : "In Favorites"
            : language === "ar"
              ? "أضف للمفضلة"
              : "Add To Favorites"}
        </Button>
      </div>
    </div>
  );
};
