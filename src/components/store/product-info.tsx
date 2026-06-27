"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { useStore } from "@/context/store-context";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart } from "lucide-react";
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
    toggleWishlist(product.id);
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

      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
        {getName()}
        {discount > 0 &&
          ` - ${discount}% ${language === "ar" ? "خصم" : "Discount"}`}
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

      {/* Description */}
      <div>
        <h3 className="text-base font-bold italic text-foreground mb-1">
          {language === "ar" ? "الوصف" : "Description"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {getDescription()}
        </p>
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
