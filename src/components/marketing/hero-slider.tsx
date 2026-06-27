"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeroSlide } from "./hero-slide";
import { useLanguage } from "@/context/language-context";
import { HeroSlide as HeroSlideType } from "@/generated/prisma/client";

interface HeroSliderProps {
  slides: HeroSlideType[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const { language } = useLanguage();

  console.log("HeroSlider slides:", slides);

  // Carousel direction (ltr/rtl) is handled by the Carousel component via dir prop or context
  // But Shadcn's carousel wraps Embla which supports direction.
  // We'll pass the direction to the Carousel div.

  return (
    <section className="w-full bg-muted">
      <Carousel
        opts={{
          loop: true,
          direction: language === "ar" ? "rtl" : "ltr",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={`slide-${slide.id}`}>
              <HeroSlide slide={slide} isFirst={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>
    </section>
  );
}
