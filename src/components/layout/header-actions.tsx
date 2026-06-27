"use client";

import { Heart, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { useStore } from "@/context/store-context";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { WishlistSheet } from "@/components/wishlist/wishlist-sheet";
import { CartSheet } from "@/components/cart/cart-sheet";

export function HeaderActions() {
  const { t, language } = useLanguage();
  const {
    cartCount,
    wishlistCount,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
  } = useStore();

  const sheetSide = language === "ar" ? "left" : "right";

  const navItems = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.store"), href: "/store" },
    { title: t("nav.about"), href: "/about-us" },
    { title: t("nav.contact"), href: "/contact-us" },
    { title: t("nav.gallery"), href: "/gallery" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Wishlist */}
      <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {wishlistCount}
            </Badge>
            <span className="sr-only">{t("header.wishlist")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side={sheetSide}
          className="flex flex-col w-[350px] sm:w-[450px]"
        >
          <WishlistSheet />
        </SheetContent>
      </Sheet>

      {/* Cart */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {cartCount}
            </Badge>
            <span className="sr-only">{t("header.cart")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side={sheetSide}
          className="flex flex-col w-[350px] sm:w-[450px]"
        >
          <CartSheet />
        </SheetContent>
      </Sheet>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side={sheetSide}>
          <SheetHeader>
            <SheetTitle>BME Pharma</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8 px-4">
            {navItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Link
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-primary py-2"
                >
                  {item.title}
                </Link>
                <Separator />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
