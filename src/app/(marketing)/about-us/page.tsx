"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { WhoWeAreSection } from "@/components/marketing/who-we-are-section";
import { VisionMissionSection } from "@/components/about/vision-mission";
import { TeamSection } from "@/components/about/team-section";
import {
  getAboutMainHeader,
  getAboutVisionSection,
  getAboutTeamSection,
  getAboutHeroesSection,
} from "@/actions/about-page-actions";
import { getWhoWeAreSection } from "@/actions/who-we-are-section-actions";
import type {
  AboutMainHeader,
  AboutVisionSection as AboutVisionSectionType,
  AboutVisionItem,
  AboutTeamSection as AboutTeamSectionType,
  AboutTeamMember,
  AboutHeroesSection as AboutHeroesSectionType,
  AboutHeroItem,
} from "@/generated/prisma/client";
import type {
  WhoWeAreSection as WhoWeAreSectionModel,
  WhoWeAreContent,
} from "@/generated/prisma/client";

type VisionWithItems = AboutVisionSectionType & { items: AboutVisionItem[] };
type TeamWithItems = AboutTeamSectionType & { items: AboutTeamMember[] };
type HeroesWithItems = AboutHeroesSectionType & { items: AboutHeroItem[] };
type WhoWeAreWithContents = WhoWeAreSectionModel & {
  contents: WhoWeAreContent[];
};

export default function AboutUsPage() {
  const { t, language } = useLanguage();

  const [mainHeader, setMainHeader] = useState<AboutMainHeader | null>(null);
  const [whoWeAre, setWhoWeAre] = useState<WhoWeAreWithContents | null>(null);
  const [visionSection, setVisionSection] = useState<VisionWithItems | null>(
    null,
  );
  const [teamSection, setTeamSection] = useState<TeamWithItems | null>(null);
  const [heroesSection, setHeroesSection] = useState<HeroesWithItems | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [headerRes, whoWeAreRes, visionRes, teamRes, heroesRes] =
        await Promise.all([
          getAboutMainHeader(),
          getWhoWeAreSection(),
          getAboutVisionSection(),
          getAboutTeamSection(),
          getAboutHeroesSection(),
        ]);

      if (!mounted) return;

      if (headerRes.success && headerRes.data) setMainHeader(headerRes.data);
      if (whoWeAreRes.success && whoWeAreRes.data)
        setWhoWeAre(whoWeAreRes.data);
      if (visionRes.success && visionRes.data) setVisionSection(visionRes.data);
      if (teamRes.success && teamRes.data) setTeamSection(teamRes.data);
      if (heroesRes.success && heroesRes.data) setHeroesSection(heroesRes.data);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const headerTitle = mainHeader
    ? language === "ar"
      ? mainHeader.arabic_header
      : mainHeader.english_header
    : t("header.about") || (language === "ar" ? "من نحن" : "About Us");

  const headerDesc = mainHeader
    ? language === "ar"
      ? mainHeader.arabic_description
      : mainHeader.english_description
    : language === "ar"
      ? "تعرف على قصتنا، وقيمنا، والأشخاص الذين يقفون وراء نجاحنا."
      : "Discover our story, our values, and the people behind our success.";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-10  text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{headerTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {headerDesc}
          </p>
        </div>
      </div>

      <main className="flex-1">
        {/* Who We Are — from WhoWeAreSection DB */}
        <WhoWeAreSection whoWeAreSection={whoWeAre} />

        {/* Vision & Mission — from AboutVisionSection DB */}
        <VisionMissionSection visionSection={visionSection} />

        {/* Our Team */}
        <TeamSection
          title={{
            en: teamSection?.english_header || "Our Team",
            ar: teamSection?.arabic_header || "فريقنا",
          }}
          description={{
            en:
              teamSection?.english_description ||
              "Meet the dedicated team driving our innovation and success.",
            ar:
              teamSection?.arabic_description ||
              "تعرف على الفريق المتميز الذي يقود ابتكاراتنا ونجاحنا.",
          }}
          members={teamSection?.items}
        />

        {/* Our Heroes */}
        <TeamSection
          title={{
            en: heroesSection?.english_header || "Our Heroes",
            ar: heroesSection?.arabic_header || "أبطالنا",
          }}
          description={{
            en:
              heroesSection?.english_description ||
              "Honoring the heroes who make a difference every day.",
            ar:
              heroesSection?.arabic_description ||
              "تكريم الأبطال الذين يصنعون الفرق كل يوم.",
          }}
          members={heroesSection?.items}
        />
      </main>
    </div>
  );
}
