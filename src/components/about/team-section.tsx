"use client";

import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import type { AboutTeamMember, AboutHeroItem } from "@/generated/prisma/client";

// ── Types ──

type PersonItem = {
  id: number;
  image: string | null;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
};

type TeamSectionProps = {
  title?: { en: string; ar: string };
  description?: { en: string; ar: string };
  members?: AboutTeamMember[] | AboutHeroItem[] | null;
};

// Default mock data
const defaultMembers: PersonItem[] = [
  {
    id: 1,
    name: { en: "Dr. Ahmed Hassan", ar: "د. أحمد حسن" },
    role: { en: "CEO & Founder", ar: "الرئيس التنفيذي والمؤسس" },
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: { en: "Sarah Johnson", ar: "سارة جونسون" },
    role: { en: "Head of Research", ar: "رئيس قسم الأبحاث" },
    image:
      "https://images.unsplash.com/photo-1573496359-136d9198758a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: { en: "Mohamed Ali", ar: "محمد علي" },
    role: { en: "Operations Manager", ar: "مدير العمليات" },
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: { en: "Emily Davis", ar: "إميلي ديفيس" },
    role: { en: "Quality Assurance", ar: "ضمان الجودة" },
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
];

const isTeamMember = (
  item: AboutTeamMember | AboutHeroItem,
): item is AboutTeamMember => {
  return "arabic_name" in item;
};

export const TeamSection = ({
  title,
  description,
  members,
}: TeamSectionProps) => {
  const { t, language } = useLanguage();

  const sectionTitle = title
    ? language === "ar"
      ? title.ar
      : title.en
    : t("about.teamTitle") || (language === "ar" ? "أبطالنا" : "Our Heroes");

  const sectionDesc = description
    ? language === "ar"
      ? description.ar
      : description.en
    : t("about.teamDesc") ||
      (language === "ar"
        ? "تعرف على الفريق المتميز الذي يقود ابتكاراتنا ونجاحنا."
        : "Meet the dedicated team driving our innovation and success.");

  // Normalize DB members or use defaults
  const normalizedMembers: PersonItem[] =
    members && members.length > 0
      ? members.map((m) => {
          if (isTeamMember(m)) {
            return {
              id: m.id,
              image: m.image,
              name: {
                en: m.english_name || "",
                ar: m.arabic_name || "",
              },
              role: {
                en: m.english_title || "",
                ar: m.arabic_title || "",
              },
            };
          }
          // AboutHeroItem mapping fallback
          const heroItem = m as AboutHeroItem;
          return {
            id: heroItem.id,
            image: heroItem.image,
            name: {
              en: "",
              ar: "",
            },
            role: {
              en: "",
              ar: "",
            },
          };
        })
      : defaultMembers;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-10 ">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sectionDesc}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {normalizedMembers.map((member) => (
            <div key={member.id} className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-muted group-hover:border-primary transition-colors">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={language === "ar" ? member.name.ar : member.name.en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-3xl font-bold">
                    {(language === "ar"
                      ? member.name.ar
                      : member.name.en
                    ).charAt(0) || "?"}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">
                {language === "ar" ? member.name.ar : member.name.en}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? member.role.ar : member.role.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
