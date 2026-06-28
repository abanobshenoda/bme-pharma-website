"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const isAr = language === "ar";

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-background border rounded-2xl p-8 md:p-12 shadow-xl border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.02] to-transparent relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-8 animate-bounce shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          {isAr ? "تم تسجيل طلبك بنجاح!" : "Order Placed Successfully!"}
        </h1>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg mx-auto">
          {isAr
            ? "شكراً لثقتك بنا! سنتواصل معك خلال 24 ساعة لتأكيد تفاصيل طلبك وإرسال التحديثات على رقم الواتساب الذي قمت بإدخاله."
            : "Thank you for your trust! We will contact you within 24 hours to confirm your order details and send updates via the WhatsApp number you provided."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => router.push("/store")}
            size="lg"
            className="w-full sm:w-auto text-base font-semibold px-8 py-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {isAr ? "متابعة التسوق" : "Continue Shopping"}
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
