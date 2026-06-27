"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import type { HeroSlide } from "@/generated/prisma/client";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface HeroSectionProps {
  hero: HeroSlide | null;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const { language } = useLanguage();

  // Helper to get content based on language
  const getContent = (en: string | null, ar: string | null) => {
    return language === "ar" ? ar || "" : en || "";
  };

  const isRTL = language === "ar";

  if (!hero) {
    return (
      <section className="relative h-[80vh] min-h-[600px] w-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-lg">No hero image configured</p>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden flex items-center">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
        <Image
          src={hero.image}
          alt={getContent(hero.english_title, hero.arabic_title)}
          fill
          sizes="100vw"
          className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          priority
        />
        {/* Advanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent dark:from-black/90 dark:via-black/70 dark:to-black/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
        <div
          className={`max-w-3xl glass p-8 md:p-14 rounded-[2rem] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 ${
            isRTL ? "ml-auto text-right" : "mr-auto text-left"
          }`}
        >
          {getContent(hero.english_subtitle, hero.arabic_subtitle) && (
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold tracking-wide text-sm mb-6 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {getContent(hero.english_subtitle, hero.arabic_subtitle)}
            </span>
          )}
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-[1.1] text-white">
            {getContent(hero.english_title, hero.arabic_title)}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light">
            {getContent(hero.english_description, hero.arabic_description)}
          </p>
          
          {getContent(hero.english_buttonText, hero.arabic_buttonText) && (
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-7 rounded-full shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 group bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link
                href={
                  getContent(hero.english_buttonLink, hero.arabic_buttonLink) ||
                  "#"
                }
                className="flex items-center gap-3"
              >
                {getContent(hero.english_buttonText, hero.arabic_buttonText)}
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
