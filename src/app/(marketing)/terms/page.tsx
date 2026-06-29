"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { FileText, ArrowLeft, ArrowRight } from "lucide-react";

const content = {
  en: {
    title: "Terms & Conditions",
    lastUpdated: "Last updated: June 2025",
    intro:
      "Please read these Terms & Conditions carefully before using the BME Pharma website. By accessing or using our website, you agree to be bound by these terms.",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing and using this website, you accept and agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our website.",
      },
      {
        heading: "2. Use of the Website",
        body: "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the website. Prohibited conduct includes transmitting harmful, offensive, or disruptive content, attempting to gain unauthorized access to our systems, and engaging in any activity that may damage or impair the website.",
      },
      {
        heading: "3. Products and Orders",
        body: "All products displayed on the website are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion.",
      },
      {
        heading: "4. Payments",
        body: "We accept Cash on Delivery and bank / e-wallet transfers where applicable. All transactions are processed securely. You agree to provide accurate and complete payment information. We are not liable for errors caused by incorrect information provided by you.",
      },
      {
        heading: "5. Shipping and Delivery",
        body: "Shipping times are estimates and not guarantees. BME Pharma is not responsible for delays caused by courier services, customs, or other circumstances beyond our control. Risk of loss and title for products passes to you upon delivery.",
      },
      {
        heading: "6. Returns and Refunds",
        body: "Returns are accepted within 7 days of delivery for products in their original, unopened condition. Pharmaceutical products are non-returnable unless defective. Refunds will be processed within 14 business days of receiving the returned item.",
      },
      {
        heading: "7. Intellectual Property",
        body: "All content on this website, including text, images, logos, and graphics, is the property of BME Pharma and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our prior written consent.",
      },
      {
        heading: "8. Limitation of Liability",
        body: "BME Pharma shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or products. Our total liability to you shall not exceed the amount paid for the specific order giving rise to the claim.",
      },
      {
        heading: "9. Governing Law",
        body: "These Terms & Conditions are governed by and construed in accordance with the laws of Egypt. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Cairo, Egypt.",
      },
      {
        heading: "10. Changes to Terms",
        body: "We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes are posted constitutes your acceptance of the revised terms.",
      },
      {
        heading: "11. Contact Us",
        body: "If you have any questions about these Terms & Conditions, please contact us at: info@bmepharma.com",
      },
    ],
  },
  ar: {
    title: "الشروط والأحكام",
    lastUpdated: "آخر تحديث: يونيو 2025",
    intro:
      "يرجى قراءة الشروط والأحكام هذه بعناية قبل استخدام موقع BME Pharma. باستخدامك لموقعنا، فإنك توافق على الالتزام بهذه الشروط.",
    sections: [
      {
        heading: "١. قبول الشروط",
        body: "بالوصول إلى هذا الموقع واستخدامه، فإنك تقبل وتوافق على الالتزام بهذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام موقعنا.",
      },
      {
        heading: "٢. استخدام الموقع",
        body: "توافق على استخدام هذا الموقع لأغراض مشروعة فقط وبطريقة لا تنتهك حقوق الآخرين. يشمل السلوك المحظور نقل محتوى ضار أو مسيء، ومحاولة الوصول غير المصرح به إلى أنظمتنا، والانخراط في أي نشاط قد يضر بالموقع.",
      },
      {
        heading: "٣. المنتجات والطلبات",
        body: "جميع المنتجات المعروضة على الموقع تخضع للتوفر. نحتفظ بحق إيقاف أي منتج في أي وقت. الأسعار عرضة للتغيير دون إشعار مسبق. نحتفظ بالحق في رفض أو إلغاء أي طلب وفقًا لتقديرنا.",
      },
      {
        heading: "٤. المدفوعات",
        body: "نقبل الدفع عند الاستلام والتحويل البنكي أو من خلال المحافظ الإلكترونية حيثما ينطبق. تتم معالجة جميع المعاملات بأمان. توافق على تقديم معلومات دفع دقيقة وكاملة.",
      },
      {
        heading: "٥. الشحن والتسليم",
        body: "مواعيد الشحن تقديرية وليست ضمانات. BME Pharma غير مسؤولة عن التأخيرات الناجمة عن خدمات الشحن أو الجمارك أو ظروف أخرى خارجة عن سيطرتنا. تنتقل المسؤولية إليك عند التسليم.",
      },
      {
        heading: "٦. الإرجاع والاسترداد",
        body: "يُقبل الإرجاع خلال 7 أيام من التسليم للمنتجات في حالتها الأصلية غير المفتوحة. المنتجات الصيدلانية غير قابلة للإرجاع إلا في حالة وجود عيب. ستتم معالجة المبالغ المستردة خلال 14 يوم عمل من استلام العنصر المُرجع.",
      },
      {
        heading: "٧. الملكية الفكرية",
        body: "جميع المحتويات على هذا الموقع، بما في ذلك النصوص والصور والشعارات، هي ملك لـ BME Pharma ومحمية بموجب قوانين حقوق الطبع والنشر. لا يجوز إعادة إنتاجها أو توزيعها دون موافقتنا الخطية المسبقة.",
      },
      {
        heading: "٨. تحديد المسؤولية",
        body: "لن تكون BME Pharma مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة ناشئة عن استخدامك للموقع أو المنتجات. لن تتجاوز مسؤوليتنا الإجمالية تجاهك المبلغ المدفوع للطلب المحدد.",
      },
      {
        heading: "٩. القانون الحاكم",
        body: "تخضع هذه الشروط والأحكام وتُفسَّر وفقًا لقوانين جمهورية مصر العربية. تخضع أي نزاعات تنشأ عن هذه الشروط للاختصاص الحصري لمحاكم القاهرة، مصر.",
      },
      {
        heading: "١٠. التغييرات على الشروط",
        body: "نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. تسري التغييرات فور نشرها على الموقع. استمرارك في استخدام الموقع بعد نشر التغييرات يُعدّ قبولًا منك للشروط المعدَّلة.",
      },
      {
        heading: "١١. اتصل بنا",
        body: "إذا كانت لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا على: info@bmepharma.com",
      },
    ],
  },
};

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-primary" />
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
