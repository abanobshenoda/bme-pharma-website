"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Currency } from "@/types";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, baseCurrency?: Currency) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

const EXCHANGE_RATE = 50; // 1 USD = 50 EGP (Approximate)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency") as Currency;
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const formatPrice = (price: number, baseCurrency: Currency = "USD") => {
    // If user's selected site currency is the same as the product's base currency, no conversion needed.
    if (currency === baseCurrency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(price);
    }
    // If site is EGP but product is USD -> multiply
    else if (currency === "EGP" && baseCurrency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(price * EXCHANGE_RATE);
    }
    // If site is USD but product is EGP -> divide
    else if (currency === "USD" && baseCurrency === "EGP") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price / EXCHANGE_RATE);
    }

    // Fallback (shouldn't be reached)
    return `${price} ${baseCurrency}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        exchangeRate: EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
