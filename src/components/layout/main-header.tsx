"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { HeaderActions } from "./header-actions";
import { NavHeader } from "./nav-header";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 md:px-10 flex flex-col w-full bg-background border-b shadow-sm">
      {/* Top Main Header */}
      <div className="container mx-auto py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-12 w-32 sm:h-16 sm:w-40">
            <img
              src="/logo.png"
              alt="BME Pharma"
              className="object-contain object-left h-full w-full"
            />
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 w-full md:w-auto md:max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Actions */}
        <HeaderActions />
      </div>

      {/* Nav Header */}
      <NavHeader />
    </header>
  );
}
