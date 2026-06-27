"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { getContactUsSection } from "@/actions/contact-us-actions";
import { getCompanyInfo } from "@/actions/company-info-actions";
import type { ContactUsSection } from "@/generated/prisma/client";
import type { CompanyInfo } from "@/generated/prisma/client";

export default function ContactUsPage() {
  const { t, language } = useLanguage();

  const [section, setSection] = useState<ContactUsSection | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [sectionRes, companyRes] = await Promise.all([
        getContactUsSection(),
        getCompanyInfo(),
      ]);

      if (!mounted) return;

      if (sectionRes.success && sectionRes.data) setSection(sectionRes.data);
      if (companyRes.success && companyRes.data)
        setCompanyInfo(companyRes.data);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const headerTitle = section
    ? language === "ar"
      ? section.arabic_header
      : section.english_header
    : t("header.contact") || (language === "ar" ? "اتصل بنا" : "Contact Us");

  const headerDesc = section
    ? language === "ar"
      ? section.arabic_description
      : section.english_description
    : language === "ar"
      ? "نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو دعم."
      : "We are here to help. Reach out to us for any inquiries or support.";

  // Build map URL from DB coordinates or use default Cairo
  const lat = section?.latitude || "30.059618498418385";
  const lng = section?.longitude || "31.18842345579899";
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-muted py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{headerTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {headerDesc}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 flex-1 pb-16 space-y-12">
        {/* Contact Info Grid — data from CompanyInfo */}
        <ContactInfo companyInfo={companyInfo} />

        {/* Map and Form Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="h-full min-h-[400px] w-full bg-muted rounded-2xl overflow-hidden border relative">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
          </div>

          {/* Form */}
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
