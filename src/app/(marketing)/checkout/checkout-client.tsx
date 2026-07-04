"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/store-context";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowRight,
  CreditCard,
  Wallet,
  Banknote,
  ShoppingBag,
  Truck,
  Tag,
  Gift,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder, OrderInput } from "@/actions/order-actions";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";
import { calculateShippingFee } from "@/actions/shipping-actions";
import { validatePromoCode, ValidatePromoResult } from "@/actions/promo-code-actions";
import { TicketPercent, X as XIcon, CheckCircle } from "lucide-react";

// Helper: compute per-item effective paid quantity for BUY_X_GET_Y
function computePaidItems(
  quantity: number,
  discountType: string | undefined,
  buyX: number | undefined,
  getY: number | undefined,
): { paidQty: number; freeQty: number } {
  if (discountType === "BUY_X_GET_Y" && buyX && getY) {
    const freeQty = Math.floor(quantity / buyX) * getY;
    const paidQty = quantity;
    return { paidQty, freeQty };
  }
  return { paidQty: quantity, freeQty: 0 };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CheckoutClient({ companyInfo }: { companyInfo?: any }) {
  const router = useRouter();
  const { cart, setCart } = useStore();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const { language } = useLanguage();

  const codEnabled = companyInfo?.codEnabled ?? true;
  const manualEnabled = companyInfo?.manualEnabled ?? false;

  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [shippingLabel, setShippingLabel] = useState<{
    en: string | null;
    ar: string | null;
  } | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MANUAL">((() => {
    const isCod = companyInfo?.codEnabled ?? true;
    const isManual = companyInfo?.manualEnabled ?? false;
    if (!isCod && isManual) return "MANUAL";
    return "COD";
  })());
  const [receiptImage, setReceiptImage] = useState<string>("");

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<Extract<ValidatePromoResult, { success: true }> | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const getConvertedPrice = (price: number, baseCurrency: "USD" | "EGP" = "USD") => {
    if (currency === baseCurrency) return price;
    if (currency === "EGP" && baseCurrency === "USD") return price * exchangeRate;
    if (currency === "USD" && baseCurrency === "EGP") return price / exchangeRate;
    return price;
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.price || 0;
    const discountType = item.discountType || "PERCENTAGE";
    const itemCurrency = (item.currency as "USD" | "EGP") || "USD";

    let effectiveLineTotal = 0;

    if (discountType === "PERCENTAGE") {
      const pct = item.discount || 0;
      const discountedPrice = price - (price * pct) / 100;
      effectiveLineTotal = discountedPrice * item.quantity;
    } else if (discountType === "BUY_X_GET_Y") {
      effectiveLineTotal = price * item.quantity;
    } else {
      effectiveLineTotal = price * item.quantity;
    }

    return sum + getConvertedPrice(effectiveLineTotal, itemCurrency);
  }, 0);

  // Total cart item count including free items
  const cartItemCount = cart.reduce((sum, item) => {
    const freeQty =
      item.discountType === "BUY_X_GET_Y" && item.buyXQuantity && item.getYQuantity
        ? Math.floor(item.quantity / item.buyXQuantity) * item.getYQuantity
        : 0;
    return sum + item.quantity + freeQty;
  }, 0);

  // Fetch shipping fee dynamically based on cart state
  useEffect(() => {
    if (cart.length === 0) return;
    let cancelled = false;
    const fetchShipping = async () => {
      setIsLoadingShipping(true);
      const res = await calculateShippingFee({
        currency: currency as "EGP" | "USD",
        cartItemCount,
        cartSubtotal: subtotal,
      });
      if (!cancelled) {
        if (res.success && res.data) {
          setShippingFee(res.data.fee);
          setShippingLabel(
            res.data.label as { en: string | null; ar: string | null } | null,
          );
        } else {
          // Fallback
          setShippingFee(currency === "EGP" ? 100 : 2);
          setShippingLabel(null);
        }
        setIsLoadingShipping(false);
      }
    };
    fetchShipping();
    return () => {
      cancelled = true;
    };
  }, [cart, currency, cartItemCount, subtotal]);

  const getPromoDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === "PERCENTAGE") {
      return (subtotal * appliedPromo.discountValue) / 100;
    }
    // FIXED
    const EXCHANGE_RATE = 50;
    let fixedAmount = appliedPromo.discountValue;
    if (currency === "EGP" && appliedPromo.currency === "USD") {
      fixedAmount = appliedPromo.discountValue * EXCHANGE_RATE;
    } else if (currency === "USD" && appliedPromo.currency === "EGP") {
      fixedAmount = appliedPromo.discountValue / EXCHANGE_RATE;
    }
    return Math.min(fixedAmount, subtotal);
  };

  const promoDiscount = getPromoDiscount();
  const total = subtotal + (shippingFee ?? 0) - promoDiscount;

  const clearCart = () => setCart([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setAppliedPromo(null);
    const res = await validatePromoCode(promoInput.trim(), currency, subtotal);
    setPromoLoading(false);
    if (res.success) {
      setAppliedPromo(res);
      toast.success(language === "ar" ? "تم تطبيق كود الخصم!" : "Promo code applied!");
    } else {
      setPromoError(res.error);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error(
        language === "ar" ? "سلة المشتريات فارغة" : "Your cart is empty",
      );
      return;
    }

    if (paymentMethod === "MANUAL" && !receiptImage) {
      toast.error(
        language === "ar"
          ? "الرجاء إرفاق صورة إيصال التحويل"
          : "Please upload the transfer receipt image",
      );
      return;
    }

    setIsLoading(true);

    const orderData: OrderInput = {
      ...formData,
      paymentMethod,
      receiptImage,
      currency,
      promoCode: appliedPromo?.code,
      items: cart.map((item) => ({
        productId: parseInt(item.id, 10),
        quantity: item.quantity,
      })),
    };

    const res = await createOrder(orderData);

    setIsLoading(false);

    if (res.success) {
      toast.success(
        language === "ar"
          ? "تم تسجيل طلبك بنجاح!"
          : "Order placed successfully!",
      );
      clearCart();
      router.push("/checkout/success");
    } else {
      toast.error(
        res.error || (language === "ar" ? "حدث خطأ" : "Something went wrong"),
      );
    }
  };


  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {language === "ar" ? "السلة فارغة" : "Your Cart is Empty"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === "ar"
            ? "يبدو أنك لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد."
            : "Looks like you haven't added any products to your cart yet."}
        </p>
        <Button
          onClick={() => router.push("/store")}
          size="lg"
          className="w-full"
        >
          {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {language === "ar" ? "إتمام الطلب" : "Checkout"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-12 gap-8 lg:gap-12"
      >
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Shipping Information */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              {language === "ar" ? "بيانات الشحن" : "Shipping Information"}
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {language === "ar" ? "الاسم الكامل" : "Full Name"} *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">
                      {language === "ar" ? "رقم الواتساب" : "WhatsApp Number"} *
                    </Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      required
                      type="tel"
                      placeholder={language === "ar" ? "مثال: 01000000000" : "e.g. 01000000000"}
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {language === "ar"
                        ? "سنقوم بالتواصل معك عبر هذا الرقم على الواتساب."
                        : "We will contact you via WhatsApp on this number."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">
                    {language === "ar" ? "البريد الإلكتروني" : "Email Address"}{" "}
                    *
                  </Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    required
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">
                    {language === "ar"
                      ? "عنوان الشحن مفصلاً"
                      : "Full Shipping Address"}{" "}
                    *
                  </Label>
                  <Textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    required
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder={
                      language === "ar"
                        ? "اسم الشارع، رقم المبنى، الشقة..."
                        : "Street name, building num, apartment..."
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    {language === "ar"
                      ? "المدينة/المحافظة"
                      : "City/Governorate"}{" "}
                    *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 2. Payment Method */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              {language === "ar" ? "طريقة الدفع" : "Payment Method"}
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {!codEnabled && !manualEnabled && (
                    <div className="text-center p-4 border border-dashed rounded-xl bg-destructive/5 text-destructive font-medium">
                      {language === "ar"
                        ? "لم يتم تفعيل أي وسيلة دفع حالياً. يرجى الاتصال بنا لإتمام طلبك."
                        : "No payment methods are currently active. Please contact us to complete your order."}
                    </div>
                  )}

                  {codEnabled && (
                    <div
                      className={`flex items-start space-x-3 rtl:space-x-reverse border p-4 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === "COD"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "COD" ? "border-primary" : "border-muted-foreground"}`}>
                          {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Label
                          className="text-base font-bold cursor-pointer flex items-center gap-2"
                        >
                          <Banknote className="w-5 h-5 text-green-600" />
                          {language === "ar"
                            ? "الدفع عند الاستلام (COD)"
                            : "Cash on Delivery (COD)"}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === "ar"
                            ? "قم بالدفع نقداً لمندوب التوصيل عند استلام طلبك."
                            : "Pay in cash to the delivery agent upon receiving your order."}
                        </p>
                      </div>
                    </div>
                  )}

                  {manualEnabled && (
                    <div
                      className={`flex items-start space-x-3 rtl:space-x-reverse border p-4 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === "MANUAL"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("MANUAL")}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "MANUAL" ? "border-primary" : "border-muted-foreground"}`}>
                          {paymentMethod === "MANUAL" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Label
                          className="text-base font-bold cursor-pointer flex items-center gap-2"
                        >
                          <Wallet className="w-5 h-5 text-primary" />
                          {language === "ar"
                            ? "تحويل بنكي / محفظة إلكترونية"
                            : "Bank Transfer / E-Wallet"}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          {language === "ar"
                            ? "حول المبلغ لأحد الحسابات الموضحة، ثم ارفع صورة إيصال التحويل لتأكيد الطلب."
                            : "Transfer the amount to the provided details, then upload the receipt to confirm."}
                        </p>

                        {/* Manual Transfer Details (Only shows when selected) */}
                        {paymentMethod === "MANUAL" && (
                          <div
                            className="bg-background/80 p-4 rounded-lg border mt-2 space-y-4 animate-in fade-in slide-in-from-top-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="text-sm space-y-3">
                              <p className="font-semibold">
                                {language === "ar"
                                  ? "تفاصيل التحويل المتاحة:"
                                  : "Available Transfer Details:"}
                              </p>
                              <div className="space-y-2 text-muted-foreground">
                                {companyInfo?.bankAccountNo && (
                                  <div className="border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-semibold text-foreground block text-xs uppercase">
                                      {language === "ar" ? "الحساب البنكي:" : "Bank Account:"}
                                    </span>
                                    <div className="grid grid-cols-1 gap-1 mt-1 font-mono text-xs text-foreground">
                                      {companyInfo?.bankName && (
                                        <div>{language === "ar" ? "البنك:" : "Bank:"} <span className="font-sans font-medium">{companyInfo.bankName}</span></div>
                                      )}
                                      <div>{language === "ar" ? "رقم الحساب:" : "Account No:"} <span className="font-medium break-all">{companyInfo.bankAccountNo}</span></div>
                                      {companyInfo?.bankIban && (
                                        <div>{language === "ar" ? "الآيبان (IBAN):" : "IBAN:"} <span className="font-medium break-all">{companyInfo.bankIban}</span></div>
                                      )}
                                      {companyInfo?.bankSwift && (
                                        <div>{language === "ar" ? "سويفت كود (SWIFT):" : "SWIFT:"} <span className="font-medium break-all">{companyInfo.bankSwift}</span></div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {companyInfo?.instaPayId && (
                                  <div className="border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-semibold text-foreground block text-xs uppercase">
                                      {language === "ar" ? "عنوان إنستا باي (InstaPay):" : "InstaPay Address:"}
                                    </span>
                                    <span className="font-mono text-sm text-foreground font-medium block mt-0.5 break-all">
                                      {companyInfo.instaPayId}
                                    </span>
                                  </div>
                                )}

                                {companyInfo?.mobileWalletNo && (
                                  <div className="border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-semibold text-foreground block text-xs uppercase">
                                      {language === "ar" ? "محفظة إلكترونية (فودافون كاش / اتصالات / أورانج):" : "Mobile Wallet (Vodafone Cash / Orange / Etisalat):"}
                                    </span>
                                    <span className="font-mono text-sm text-foreground font-medium block mt-0.5 break-all">
                                      {companyInfo.mobileWalletNo}
                                    </span>
                                  </div>
                                )}

                                {!companyInfo?.bankAccountNo && !companyInfo?.instaPayId && !companyInfo?.mobileWalletNo && (
                                  <div>
                                    {language === "ar" ? "لا توجد تفاصيل دفع مدخلة حالياً." : "No payment details entered yet."}
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-amber-600 mt-2 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                                {language === "ar"
                                  ? "تنبيه: لن يتم شحن الطلب إلا بعد التأكد من الحوالة ورفع الإيصال."
                                  : "Note: Order will not be shipped until the transfer is verified and receipt is uploaded."}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t">
                              <Label>
                                {language === "ar"
                                  ? "صورة إيصال التحويل"
                                  : "Transfer Receipt Image"}{" "}
                                *
                              </Label>
                              <CloudinaryUploadWidget
                                value={receiptImage}
                                onUpload={(url) => setReceiptImage(url)}
                                onRemove={() => setReceiptImage("")}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 3. Additional Notes */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              {language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={
                    language === "ar"
                      ? "أي ملاحظات خاصة بالتوصيل أو الطلب..."
                      : "Any special notes for delivery or your order..."
                  }
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 pb-4 border-b">
                <CardTitle className="text-2xl">
                  {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                </CardTitle>
                <CardDescription>
                  {cart.length} {language === "ar" ? "منتجات" : "items"} —{" "}
                  {cartItemCount}{" "}
                  {language === "ar" ? "قطعة إجمالاً" : "total pieces"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Items List */}
                <div className="max-h-[40vh] overflow-y-auto p-6 space-y-4 scrollbar-thin">
                  {cart.map((item) => {
                    const price = item.price || 0;
                    const discountType = item.discountType || "PERCENTAGE";

                    // Compute display price
                    let displayLineTotal = 0;
                    let discountBadge: React.ReactNode = null;

                    if (discountType === "PERCENTAGE") {
                      const pct = item.discount || 0;
                      const discountedPrice = price - (price * pct) / 100;
                      displayLineTotal = discountedPrice * item.quantity;
                      if (pct > 0) {
                        discountBadge = (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-semibold">
                            <Tag className="w-2.5 h-2.5" />
                            -{pct}%
                          </span>
                        );
                      }
                    } else if (discountType === "BUY_X_GET_Y") {
                      const { paidQty, freeQty } = computePaidItems(
                        item.quantity,
                        discountType,
                        item.buyXQuantity,
                        item.getYQuantity,
                      );
                      displayLineTotal = price * paidQty;
                      if (freeQty > 0) {
                        discountBadge = (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                            <Gift className="w-2.5 h-2.5" />
                            {freeQty}{" "}
                            {language === "ar" ? "مجاناً" : "free"}
                          </span>
                        );
                      }
                    } else {
                      displayLineTotal = price * item.quantity;
                    }

                    return (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border bg-muted">
                          <Image
                            src={item.image || "/placeholder-product.png"}
                            alt="product"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {language === "ar" ? item.name.ar : item.name.en}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {discountBadge}
                          </div>
                          <p className="text-sm font-bold text-primary mt-1">
                            {formatPrice(
                              displayLineTotal,
                              item.currency as "EGP" | "USD",
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="p-6 bg-muted/30 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>

                  {/* Shipping Fee Row */}
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground flex flex-wrap items-center gap-1.5 min-w-0">
                      <Truck className="w-3.5 h-3.5" />
                      {language === "ar" ? "مصاريف الشحن" : "Shipping Fee"}
                      {shippingLabel && (
                        <span className="text-[10px] text-muted-foreground/70">
                          (
                          {language === "ar"
                            ? shippingLabel.ar
                            : shippingLabel.en}
                          )
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">
                      {isLoadingShipping ? (
                        <Loader2 className="w-3 h-3 animate-spin inline" />
                      ) : shippingFee === 0 ? (
                        <span className="text-green-600 font-bold">
                          {language === "ar" ? "مجاناً" : "Free"}
                        </span>
                      ) : (
                        formatPrice(shippingFee ?? 0, currency)
                      )}
                    </span>
                  </div>

                  {/* Shipping info banner */}
                  {!isLoadingShipping && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                      <Truck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        {language === "ar"
                          ? `إجمالي القطع: ${cartItemCount} قطعة — مصاريف الشحن المطبقة: ${formatPrice(shippingFee ?? 0, currency)}`
                          : `${cartItemCount} piece${cartItemCount !== 1 ? "s" : ""} in cart — Shipping: ${formatPrice(shippingFee ?? 0, currency)}`}
                      </span>
                    </div>
                  )}

                  {/* Promo Code Input */}
                  <div className="pt-2 space-y-2">
                    {appliedPromo ? (
                      /* Applied promo badge */
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <div className="text-xs">
                            <span className="font-mono font-bold">{appliedPromo.code}</span>
                            <span className="text-muted-foreground ml-1">
                              {language === "ar" ? "— خصم" : "— discount applied"}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                          title="Remove promo code"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Promo code input */
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <TicketPercent className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={language === "ar" ? "كود الخصم" : "Promo code"}
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                            className="pl-8 h-9 text-sm font-mono uppercase"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoInput.trim()}
                          className="h-9 px-3 text-xs whitespace-nowrap"
                        >
                          {promoLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            language === "ar" ? "تطبيق" : "Apply"
                          )}
                        </Button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-xs text-destructive px-1">{promoError}</p>
                    )}
                  </div>

                  {/* Promo Discount Row */}
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1.5">
                        <TicketPercent className="w-3.5 h-3.5" />
                        {language === "ar" ? "خصم الكوبون" : "Promo Discount"}
                      </span>
                      <span className="font-semibold">
                        − {formatPrice(promoDiscount, currency)}
                      </span>
                    </div>
                  )}


                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {language === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {isLoadingShipping ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        formatPrice(total, currency)
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0 bg-muted/30 pb-6 rounded-b-xl">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-6"
                    disabled={isLoading || isLoadingShipping}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {language === "ar" ? "تأكيد الطلب" : "Place Order"}
                        <ArrowRight className="w-5 h-5 ml-2 rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    {language === "ar"
                      ? "المعلومات الخاصة بك مشفرة وآمنة."
                      : "Your information is secure and encrypted."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
