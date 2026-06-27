"use client";

import { useLanguage } from "@/context/language-context";
import {
  Award,
  Globe,
  Users,
  Headset,
  Heart,
  Shield,
  Star,
  Target,
  Zap,
  Clock,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Package,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type {
  WhoWeAreSection as WhoWeAreSectionModel,
  WhoWeAreContent as WhoWeAreContentModel,
} from "@/generated/prisma/client";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Globe,
  Users,
  Headset,
  Heart,
  Shield,
  Star,
  Target,
  Zap,
  Clock,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Package,
  Truck,
};

type WhoWeAreSectionWithContents = WhoWeAreSectionModel & {
  contents: WhoWeAreContentModel[];
};

type WhoWeAreSectionProps = {
  whoWeAreSection?: WhoWeAreSectionWithContents | null;
};

const defaultFeatures = [
  {
    key: "quality",
    icon: "Award",
    title: { en: "Certified Quality", ar: "جودة معتمدة" },
    description: {
      en: "ISO certified products ensuring the highest standards.",
      ar: "منتجات حاصلة على شهادة ISO تضمن أعلى المعايير.",
    },
  },
  {
    key: "global",
    icon: "Globe",
    title: { en: "Global Reach", ar: "وصول عالمي" },
    description: {
      en: "Delivering health solutions to over 50 countries.",
      ar: "تقديم حلول صحية لأكثر من 50 دولة.",
    },
  },
  {
    key: "expert",
    icon: "Users",
    title: { en: "Expert Team", ar: "فريق خبير" },
    description: {
      en: "Dedicated professionals with decades of experience.",
      ar: "محترفون متخصصون يتمتعون بعقود من الخبرة.",
    },
  },
  {
    key: "support",
    icon: "Headset",
    title: { en: "24/7 Support", ar: "دعم 24/7" },
    description: {
      en: "Always here to answer your questions and concerns.",
      ar: "موجودون دائمًا للإجابة على أسئلتكم واستفساراتكم.",
    },
  },
];

export const WhoWeAreSection = ({ whoWeAreSection }: WhoWeAreSectionProps) => {
  const { language } = useLanguage();

  const header = whoWeAreSection
    ? language === "ar"
      ? whoWeAreSection.arabic_header
      : whoWeAreSection.english_header
    : language === "ar"
      ? "من نحن"
      : "Who We Are";

  const description = whoWeAreSection
    ? language === "ar"
      ? whoWeAreSection.arabic_description
      : whoWeAreSection.english_description
    : language === "ar"
      ? "بي إم إي فارما هي شركة رائدة في مجال المستحضرات الدوائية، ملتزمة بتحسين الصحة العالمية من خلال الابتكار والجودة والنزاهة."
      : "BME Pharma is a leading pharmaceutical company committed to improving global health through innovation, quality, and integrity.";

  const backgroundImage =
    whoWeAreSection?.backgroundImage ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1920&auto=format&fit=crop";

  const contents =
    whoWeAreSection && whoWeAreSection.contents.length > 0
      ? whoWeAreSection.contents.map((c) => ({
          key: String(c.id),
          icon: c.icon || "Award",
          title:
            language === "ar" ? c.arabic_title || "" : c.english_title || "",
          subtitle:
            language === "ar"
              ? c.arabic_subtitle || ""
              : c.english_subtitle || "",
        }))
      : defaultFeatures.map((f) => ({
          key: f.key,
          icon: f.icon,
          title: language === "ar" ? f.title.ar : f.title.en,
          subtitle: language === "ar" ? f.description.ar : f.description.en,
        }));

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="BME Pharma Background"
          fill
          className="object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="container relative z-10 mx-auto px-10 ">
        <div className="text-center max-w-3xl mx-auto mb-16 text-white">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {header}
          </h2>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contents.map((item) => {
            const Icon = ICON_MAP[item.icon] || Award;
            return (
              <div
                key={item.key}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:bg-white/20 hover:-translate-y-2 transition-all duration-500 text-center group"
                tabIndex={0}
                role="article"
                aria-label={item.title}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">{item.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
