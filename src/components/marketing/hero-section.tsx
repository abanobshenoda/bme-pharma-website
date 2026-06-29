"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import type { HeroSlide } from "@/generated/prisma/client";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  hero: HeroSlide | null;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const { language } = useLanguage();

  const getContent = (en: string | null, ar: string | null) =>
    language === "ar" ? ar || "" : en || "";

  const isRTL = language === "ar";

  if (!hero) {
    return (
      <section className="relative h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-lg tracking-widest uppercase text-sm">
          No hero content configured
        </p>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden flex items-center">
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.image}
          alt={getContent(hero.english_title, hero.arabic_title)}
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ transform: "scale(1.04)" }}
          priority
        />

        {/* Deep cinematic gradient — strong on the content side, fades to semi-transparent */}
        <div
          className={`absolute inset-0 ${
            isRTL
              ? "bg-gradient-to-l from-black/92 via-black/65 to-black/20"
              : "bg-gradient-to-r from-black/92 via-black/65 to-black/20"
          }`}
        />
        {/* Bottom fade so the section blends into page */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        {/* Top subtle vignette */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* ── Main Content ── */}
      <div className="container relative z-10 mx-auto px-6 md:px-14 h-full flex flex-col justify-center">
        <div
          className={`max-w-2xl flex flex-col gap-6 ${
            isRTL ? "ml-auto items-end text-right" : "mr-auto items-start text-left"
          }`}
          style={{ animation: "heroEntrance 0.9s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Badge / Subtitle */}
          {getContent(hero.english_subtitle, hero.arabic_subtitle) && (
            <div
              className="flex items-center gap-3"
              style={{ animation: "heroEntrance 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              {/* Accent bar */}
              <span
                className="block h-px w-10 bg-primary"
                style={{ boxShadow: "0 0 12px 2px oklch(0.65 0.15 230 / 0.8)" }}
              />
              <span className="text-primary font-semibold tracking-[0.18em] uppercase text-xs md:text-sm">
                {getContent(hero.english_subtitle, hero.arabic_subtitle)}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-[3.75rem] lg:text-7xl font-heading font-bold leading-[1.06] text-white"
            style={{
              animation: "heroEntrance 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 30px rgba(0,0,0,0.5)",
            }}
          >
            {getContent(hero.english_title, hero.arabic_title)}
          </h1>

          {/* Divider line */}
          <div
            className="flex items-center gap-3 w-full"
            style={{ animation: "heroEntrance 0.8s 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <span className="block h-[2px] w-16 rounded-full bg-primary opacity-80" />
            <span className="block h-px flex-1 max-w-[80px] rounded-full bg-white/15" />
          </div>

          {/* Description */}
          {getContent(hero.english_description, hero.arabic_description) && (
            <p
              className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg font-light"
              style={{ animation: "heroEntrance 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              {getContent(hero.english_description, hero.arabic_description)}
            </p>
          )}

          {/* CTA Button */}
          {getContent(hero.english_buttonText, hero.arabic_buttonText) && (
            <div
              className="flex items-center gap-4 mt-2"
              style={{ animation: "heroEntrance 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <Button
                asChild
                size="lg"
                className="relative group overflow-hidden rounded-full px-8 py-6 text-base font-semibold tracking-wide bg-primary hover:bg-primary text-primary-foreground border-0 shadow-[0_0_28px_oklch(0.65_0.15_230_/_0.45)] hover:shadow-[0_0_44px_oklch(0.65_0.15_230_/_0.65)] transition-all duration-300"
              >
                <Link
                  href={
                    getContent(hero.english_buttonLink, hero.arabic_buttonLink) || "#"
                  }
                  className="flex items-center gap-3"
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  {getContent(hero.english_buttonText, hero.arabic_buttonText)}
                  {isRTL ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </Link>
              </Button>

              {/* Secondary ghost link — optional scroll cue */}
              <a
                href="#categories"
                className="hidden md:flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors duration-200"
              >
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator dot line ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-40">
        <span className="block w-px h-10 bg-gradient-to-b from-white to-transparent" />
        <span className="block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>

    </section>
  );
}
