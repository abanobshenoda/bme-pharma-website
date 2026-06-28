"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, ShoppingCart, Loader2, Gift } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { useStore } from "@/context/store-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { language, t, dir } = useLanguage();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const discountedPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  const getName = () => (language === "ar" ? product.name.ar : product.name.en);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);

    if (!isWishlisted) {
      toast.success(t("product.addedToWishlist") || "Added to wishlist", {
        description: getName(),
        action: {
          label: t("header.wishlist") || "View Wishlist",
          onClick: () => setIsWishlistOpen(true),
        },
      });
    } else {
      toast.info(t("product.removedFromWishlist") || "Removed from wishlist", {
        description: getName(),
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    // Simulate API call / delay
    setTimeout(() => {
      addToCart(product);
      setIsAddingToCart(false);
      toast.success(t("product.addedToCart") || "Added to cart", {
        description: getName(),
        action: {
          label: t("header.cart") || "View Cart",
          onClick: () => setIsCartOpen(true),
        },
      });
    }, 500);
  };

  return (
    <div className="group relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-border/50 h-full flex flex-col hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted group-hover:bg-muted/30 transition-colors">
        <Image
          src={product.image}
          alt={getName()}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating Badges */}
        {product.discountType === "PERCENTAGE" && product.discount && product.discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-2.5 py-1 rounded-full z-10 shadow-sm border-none select-none">
            {language === "ar" ? `خصم ${product.discount}%` : `-${product.discount}%`}
          </Badge>
        )}
        {product.discountType === "BUY_X_GET_Y" && product.buyXQuantity && product.getYQuantity && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-full z-10 shadow-sm border-none flex items-center gap-1 select-none">
            <Gift className="w-3 h-3" />
            {language === "ar"
              ? `عرض ${product.buyXQuantity} + ${product.getYQuantity} مجاناً`
              : `Buy ${product.buyXQuantity} Get ${product.getYQuantity} Free`}
          </Badge>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Action Buttons (Absolute) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 rtl:right-auto rtl:left-3 rtl:-translate-x-12 rtl:group-hover:translate-x-0 z-10">
          {/* Quick View Dialog */}
          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full shadow-md hover:bg-primary hover:text-primary-foreground h-9 w-9"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t("product.quickView")}</span>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{t("product.quickView")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent
              className="max-w-3xl overflow-hidden p-0 gap-0 sm:rounded-2xl"
              dir={dir}
            >
              <div className="grid md:grid-cols-2 h-full">
                <div className="relative aspect-video md:aspect-auto bg-muted">
                  <Image
                    src={product.image}
                    alt={getName()}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <DialogTitle className="text-2xl font-bold">
                          {getName()}
                        </DialogTitle>
                      </div>
                      <div className="flex font-space flex-col mt-auto items-start">
                        {discountedPrice < product.price ? (
                          <>
                            <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                              {formatPrice(discountedPrice, product.currency)}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(product.price, product.currency)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-auto pt-6 border-t flex items-center justify-between gap-4">
                    <Button
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="mr-2 h-4 w-4" />
                      )}
                      {t("product.addToCart")}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={
                        isWishlisted
                          ? "text-destructive border-destructive/20 bg-destructive/5"
                          : ""
                      }
                      onClick={() => toggleWishlist(product)}
                    >
                      <Heart
                        className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Wishlist Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className={`rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground h-9 w-9 transition-colors ${
                    isWishlisted
                      ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
                      : ""
                  }`}
                  onClick={handleWishlist}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  <span className="sr-only">
                    {isWishlisted
                      ? t("product.wishlistRemove")
                      : t("product.wishlistAdd")}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  {isWishlisted
                    ? t("product.wishlistRemove")
                    : t("product.wishlistAdd")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.category}
          </span>
          {/* Optional: Rating or other small info could go here */}
        </div>

        <Link
          href={`/store/${product.id}`}
          className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 mb-1"
        >
          {getName()}
        </Link>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/50">
          <div className="flex font-space flex-col items-start translate-y-1">
            {discountedPrice < product.price ? (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-primary">
                  {formatPrice(discountedPrice, product.currency)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            <span className="sr-only">{t("product.addToCart")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
