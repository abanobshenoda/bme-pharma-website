"use client";

import { FaPhone, FaEnvelope } from "react-icons/fa";
import { companyContact } from "@/data/contact-info";
import { ModeToggle } from "@/components/mode-toggle";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";

export function InfoBar() {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 px-10 shadow-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-sm">
        {/* Contact Info */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-4">
          <a
            href={`tel:${companyContact.phone}`}
            className="flex items-center gap-2 hover:underline transition-all"
          >
            <FaPhone className="h-3 w-3" />
            <span dir="ltr">{companyContact.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${companyContact.email}`}
            className="flex items-center gap-2 hover:underline transition-all"
          >
            <FaEnvelope className="h-3 w-3" />
            <span>{companyContact.email}</span>
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Currency Switcher */}
          <div className="flex items-center bg-primary-foreground/10 rounded-md overflow-hidden border border-primary-foreground/20">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 transition-colors ${
                currency === "USD"
                  ? "bg-primary-foreground text-primary font-bold"
                  : "hover:bg-primary-foreground/20"
              }`}
            >
              $
            </button>
            <button
              onClick={() => setCurrency("EGP")}
              className={`px-3 py-1 transition-colors ${
                currency === "EGP"
                  ? "bg-primary-foreground text-primary font-bold"
                  : "hover:bg-primary-foreground/20"
              }`}
            >
              E£
            </button>
          </div>

          <div className="h-4 w-px bg-primary-foreground/30 mx-1" />

          {/* Language Switcher */}
          <div className="flex items-center bg-primary-foreground/10 rounded-md overflow-hidden border border-primary-foreground/20">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 transition-colors ${
                language === "en"
                  ? "bg-primary-foreground text-primary font-bold"
                  : "hover:bg-primary-foreground/20"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`px-3 py-1 transition-colors ${
                language === "ar"
                  ? "bg-primary-foreground text-primary font-bold"
                  : "hover:bg-primary-foreground/20"
              }`}
            >
              AR
            </button>
          </div>

          <div className="h-4 w-px bg-primary-foreground/30 mx-1" />

          {/* Theme Toggle - wrapper to style it for the dark header */}
          <div className="items-center flex [&_button]:h-8 [&_button]:w-8 [&_button]:bg-transparent [&_button]:text-primary-foreground [&_button]:border-primary-foreground/30 [&_button:hover]:bg-primary-foreground/20">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
