"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function NavHeader() {
  const { t } = useLanguage();

  const navItems = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.store"), href: "/store" },
    { title: t("nav.about"), href: "/about-us" },
    { title: t("nav.contact"), href: "/contact-us" },
    { title: t("nav.gallery"), href: "/gallery" },
  ];

  return (
    <div className="hidden md:block border-b bg-background">
      <div className="container mx-auto flex h-12 items-center">
        {/* Desktop Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="transition-colors hover:text-primary text-foreground/80 hover:underline underline-offset-4"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
