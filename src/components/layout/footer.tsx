"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import type { Category, CompanyInfo } from "@/generated/prisma/client";

interface FooterProps {
  categories?: Category[];
  companyInfo?: CompanyInfo | null;
}

export function Footer({ categories = [], companyInfo }: FooterProps) {
  const { t, language } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t pt-16 pb-8">
      <div className="container mx-auto px-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/logo.png"
                  alt="BME Pharma Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                BME Pharma
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer.description") ||
                (language === "ar"
                  ? "نلتزم بتقديم منتجات صيدلانية عالية الجودة لتحسين حياة الناس. ثقتكم هي أولويتنا."
                  : "Dedicated to providing high-quality pharmaceutical products to improve lives. Your trust is our priority.")}
            </p>
            <div className="flex gap-4">
              {companyInfo?.facebook && (
                <Link
                  href={companyInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {companyInfo?.twitter && (
                <Link
                  href={companyInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {companyInfo?.instagram && (
                <Link
                  href={companyInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {companyInfo?.linkedin && (
                <Link
                  href={companyInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="#about-us"
                  className="hover:text-primary transition-colors"
                >
                  {language === "ar" ? "من نحن" : "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href="#store"
                  className="hover:text-primary transition-colors"
                >
                  {language === "ar" ? "المتجر" : "Store"}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-primary transition-colors"
                >
                  {language === "ar" ? "اتصل بنا" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === "ar" ? "معلومات التواصل" : "Contact Info"}
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>
                  {language === "ar"
                    ? companyInfo?.arabic_address ||
                      "123 شارع الصيدلة، المنطقة الطبية، القاهرة، مصر"
                    : companyInfo?.english_address ||
                      "123 Pharmacy Street, Medical District, Cairo, Egypt"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span dir="ltr">
                  {companyInfo?.phone || "+20 123 456 7890"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{companyInfo?.email || "info@bmepharma.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} BME Pharma.{" "}
            {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">
              {t("footer.privacy") ||
                (language === "ar" ? "سياسة الخصوصية" : "Privacy Policy")}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              {t("footer.terms") ||
                (language === "ar" ? "الشروط والأحكام" : "Terms & Conditions")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
