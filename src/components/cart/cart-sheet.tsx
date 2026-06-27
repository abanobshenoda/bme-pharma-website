"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/context/store-context";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";

export function CartSheet() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, setIsCartOpen } =
    useStore();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {language === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          {language === "ar"
            ? "يبدو أنك لم تضف أي منتجات إلى سلة التسوق بعد."
            : "Looks like you haven't added any items to your cart yet."}
        </p>
        <Button onClick={() => setIsCartOpen(false)} asChild>
          <Link href="/store">
            {language === "ar" ? "تسوق الآن" : "Start Shopping"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SheetHeader className="px-4 py-4">
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          {t("header.cart")} ({cart.length})
        </SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 -mx-6 px-10 my-5">
        <div className="space-y-6">
          {cart.map((item) => (
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
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md h-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-4 pt-6 border-t px-2 mb-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
            </span>
            <span className="font-medium">
              {formatPrice(cartTotal, cart[0]?.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>{language === "ar" ? "الشحن" : "Shipping"}</span>
            <span>
              {language === "ar" ? "يحسب عند الدفع" : "Calculated at checkout"}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-bold text-lg">
          <span>{language === "ar" ? "المجموع الكلي" : "Total"}</span>
          <span>{formatPrice(cartTotal, cart[0]?.currency)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => setIsCartOpen(false)}
          asChild
        >
          <Link href="/checkout">
            {language === "ar" ? "إتمام الشراء" : "Checkout"}
          </Link>
        </Button>
      </div>
    </>
  );
}
