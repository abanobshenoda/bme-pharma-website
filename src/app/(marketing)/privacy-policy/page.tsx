"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";

const content = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: June 2025",
    intro:
      "At BME Pharma, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you place an order. We may also automatically collect certain technical data such as your IP address, browser type, and pages visited through cookies and similar technologies.",
      },
      {
        heading: "2. How We Use Your Information",
        body: "We use the information we collect to process your orders, communicate with you about your purchases, send promotional communications (with your consent), improve our website and services, comply with legal obligations, and prevent fraud.",
      },
      {
        heading: "3. Sharing of Information",
        body: "We do not sell or rent your personal data to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving our users — all of whom are bound by confidentiality obligations.",
      },
      {
        heading: "4. Data Security",
        body: "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet is 100% secure.",
      },
      {
        heading: "5. Cookies",
        body: "Our website uses cookies to enhance your browsing experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our site may not function properly without cookies.",
      },
      {
        heading: "6. Your Rights",
        body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at the email address below. We will respond to your request within 30 days.",
      },
      {
        heading: "7. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the 'Last Updated' date.",
      },
      {
        heading: "8. Contact Us",
        body: "If you have any questions about this Privacy Policy, please contact us at: info@bmepharma.com",
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: يونيو 2025",
    intro:
      "في BME Pharma، نلتزم بحماية معلوماتك الشخصية وحقك في الخصوصية. توضح سياسة الخصوصية هذه كيفية جمع بياناتك واستخدامها وحمايتها عند زيارة موقعنا الإلكتروني أو إجراء عملية شراء.",
    sections: [
      {
        heading: "١. المعلومات التي نجمعها",
        body: "نجمع المعلومات التي تقدمها لنا مباشرةً، مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وعنوان الشحن عند تقديم طلب. قد نجمع أيضًا بيانات تقنية معينة تلقائيًا مثل عنوان IP ونوع المتصفح والصفحات التي تمت زيارتها.",
      },
      {
        heading: "٢. كيف نستخدم معلوماتك",
        body: "نستخدم المعلومات التي نجمعها لمعالجة طلباتك والتواصل معك بشأن مشترياتك وإرسال الاتصالات الترويجية (بموافقتك) وتحسين موقعنا وخدماتنا والامتثال للالتزامات القانونية ومنع الاحتيال.",
      },
      {
        heading: "٣. مشاركة المعلومات",
        body: "نحن لا نبيع بياناتك الشخصية أو نؤجرها لأطراف ثالثة. قد نشارك معلوماتك مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا أو إدارة أعمالنا أو خدمة مستخدمينا.",
      },
      {
        heading: "٤. أمان البيانات",
        body: "نطبق معايير أمان صناعية لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الإفصاح أو التغيير أو الإتلاف. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100%.",
      },
      {
        heading: "٥. ملفات تعريف الارتباط",
        body: "يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط، ومع ذلك قد لا تعمل بعض ميزات موقعنا بشكل صحيح بدونها.",
      },
      {
        heading: "٦. حقوقك",
        body: "يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت. للإستفادة من هذه الحقوق، يرجى التواصل معنا على عنوان البريد الإلكتروني أدناه وسنرد على طلبك خلال 30 يومًا.",
      },
      {
        heading: "٧. التغييرات على هذه السياسة",
        body: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنبلغك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ 'آخر تحديث'.",
      },
      {
        heading: "٨. اتصل بنا",
        body: "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على: info@bmepharma.com",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const c = isRTL ? content.ar : content.en;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container mx-auto px-6 md:px-12 py-20 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{c.lastUpdated}</p>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                {c.title}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
            {c.intro}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {c.sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <span className="block h-5 w-1 rounded-full bg-primary" />
                {section.heading}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[15px] ps-4">
                {section.body}
              </p>
            </div>
          ))}

          {/* Back link */}
          <div className="pt-8 border-t">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4 text-sm font-medium"
            >
              {isRTL ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
              {isRTL ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
