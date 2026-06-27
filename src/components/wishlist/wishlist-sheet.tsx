"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/context/store-context";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { toast } from "sonner";
// We need to fetch product details because wishlist only stores IDs
// In a real app we'd fetch from API. Here we'll Mock import or filter from a known list.
// However, allProducts is in page files. We should probably accessible constant.
// For now, I'll move allProducts to a shared data file or define a mock subset here
// OR better, I will assume the StoreContext *should* ideally provide the full product objects for wishlist too
// but it currently only stores string[].
// Let's modify StoreContext to helper find products, or just mock it here for now.
// Actually, looking at StoreContext, it doesn't have a product lookup method.
// I will temporarily define a mock getter or import mock data if possible.
// Since I can't easily import 'allProducts' from the page file, I will create a temporary mock data file or just
// use a hook if available. Ideally, I'd refactor allProducts to `src/data/products.ts`.
// For now, let's create a partial lookup mock since we have the data in store/page.tsx
// I will quick-fix by importing a 'getAllProducts' if I create it, or just use a small mock list here matching IDs p1-p12.

import { Product } from "@/types";

export function WishlistSheet() {
  const { wishlist, toggleWishlist, addToCart, setIsWishlistOpen } = useStore();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (item: Product) => {
    addToCart(item);
    toast.success(
      language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart",
      {
        description: language === "ar" ? item.name.ar : item.name.en,
      },
    );
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {language === "ar"
            ? "قائمة الأمنيات فارغة"
            : "Your wishlist is empty"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          {language === "ar"
            ? "حفظ العناصر لوقت لاحق. أضف العناصر المفضلة لديك هنا."
            : "Save items for later. Add your favorite items here."}
        </p>
        <Button onClick={() => setIsWishlistOpen(false)} asChild>
          <Link href="/store">
            {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SheetHeader className="px-4 py-4">
        <SheetTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {t("header.wishlist")} ({wishlist.length})
        </SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 -mx-6 px-10 my-4">
        <div className="space-y-6">
          {wishlist.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative aspect-square w-20 h-20 rounded-lg overflow-hidden border bg-muted shrink-0">
                <Image
                  src={item.image}
                  alt={language === "ar" ? item.name.ar : item.name.en}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium line-clamp-1">
                    {language === "ar" ? item.name.ar : item.name.en}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(
                        item.discount
                          ? item.price - item.price * (item.discount / 100)
                          : item.price,
                        item.currency,
                      )}
                    </p>
                    {!!item.discount && item.discount > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                    {language === "ar" ? "إضافة" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => toggleWishlist(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
