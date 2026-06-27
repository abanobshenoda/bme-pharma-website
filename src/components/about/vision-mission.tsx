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
  Eye,
  Compass,
  Rocket,
  Flame,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  AboutVisionSection,
  AboutVisionItem,
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
  Eye,
  Compass,
  Rocket,
  Flame,
  BookOpen,
};

type VisionSectionWithItems = AboutVisionSection & {
  items: AboutVisionItem[];
};

type VisionMissionSectionProps = {
  visionSection?: VisionSectionWithItems | null;
};

// Default fallback data
const defaultItems = [
  {
    key: "vision",
    icon: "Lightbulb",
    title: {
      en: "Our Vision",
      ar: "رؤيتنا",
    },
    description: {
      en: "To be the leading pharmaceutical solutions provider in the region, recognized for our innovation, quality, and dedication to improving global health.",
      ar: "أن نكون الشركة الرائدة في مجال الحلول الصيدلانية في المنطقة، معترف بنا لابتكارنا وجودتنا وتفانينا في تحسين الصحة العالمية.",
    },
  },
  {
    key: "mission",
    icon: "Target",
    title: {
      en: "Our Mission",
      ar: "مهمتنا",
    },
    description: {
      en: "To provide high-quality, accessible healthcare products that enhance the well-being of the communities we serve, through ethical practices and continuous improvement.",
      ar: "توفير منتجات رعاية صحية عالية الجودة ويمكن الوصول إليها والتي تعزز رفاهية المجتمعات التي نخدمها، من خلال الممارسات الأخلاقية والتحسين المستمر.",
    },
  },
];

export const VisionMissionSection = ({
  visionSection,
}: VisionMissionSectionProps) => {
  const { language } = useLanguage();

  const items =
    visionSection && visionSection.items.length > 0
      ? visionSection.items.map((item) => ({
          key: String(item.id),
          icon: item.icon || "Lightbulb",
          title:
            language === "ar"
              ? item.arabic_title || ""
              : item.english_title || "",
          description:
            language === "ar"
              ? item.arabic_description || ""
              : item.english_description || "",
        }))
      : defaultItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          title: language === "ar" ? item.title.ar : item.title.en,
          description:
            language === "ar" ? item.description.ar : item.description.en,
        }));

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-10 ">
        <div
          className={`grid gap-8 ${items.length === 2 ? "md:grid-cols-2" : items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}
        >
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] || Award;
            return (
              <div
                key={item.key}
                className="bg-card p-8 rounded-2xl shadow-sm border flex flex-col items-center text-center"
                tabIndex={0}
                role="article"
                aria-label={item.title}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
