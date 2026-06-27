"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/store-context";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { toast } from "sonner";

// Steps definition
const STEPS = [
  { id: 1, title: { en: "Shipping", ar: "الشحن" } },
  { id: 2, title: { en: "Payment", ar: "الدفع" } },
  { id: 3, title: { en: "Review", ar: "المراجعة" } },
];

export function CheckoutForm() {
  const router = useRouter();
  const { cart, cartTotal } = useStore();
  const { formatPrice: formatCurrency } = useCurrency();
  const { language } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "visa" | "paypal">(
    "cod",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  // In a real app we'd use useEffect, but let's handle it gracefully in UI
  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">
          {language === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h2>
        <Button asChild>
          <Link href="/store">
            {language === "ar" ? "العودة للمتجر" : "Return to Store"}
          </Link>
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Basic validation
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.address
      ) {
        toast.error(
          language === "ar"
            ? "يرجى ملء جميع الحقول المطلوبة"
            : "Please fill in all required fields",
        );
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(
      language === "ar"
        ? "تم استلام طلبك بنجاح!"
        : "Order placed successfully!",
    );

    // Here we would clear cart and redirect to success page
    // For now, redirect to home
    router.push("/");
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -z-10" />
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 bg-background px-2 ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                ${
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "border-primary text-primary"
                      : "border-muted bg-background"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span className="text-sm font-medium">
                {language === "ar" ? step.title.ar : step.title.en}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "ar" ? "معلومات الشحن" : "Shipping Information"}
                </CardTitle>
                <CardDescription>
                  {language === "ar"
                    ? "الرجاء إدخال تفاصيل الاتصال والعنوان الخاص بك."
                    : "Please enter your contact and address details."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {language === "ar" ? "الاسم الأول" : "First Name"} *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {language === "ar" ? "اسم العائلة" : "Last Name"} *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === "ar" ? "رقم الهاتف" : "Phone Number"} *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    {language === "ar" ? "العنوان" : "Address"} *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      {language === "ar" ? "المدينة" : "City"} *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      {language === "ar" ? "الرمز البريدي" : "Zip Code"}
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                </CardTitle>
                <CardDescription>
                  {language === "ar"
                    ? "اختر طريقة الدفع المفضلة لديك."
                    : "Choose your preferred payment method."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val: "cod" | "visa" | "paypal") =>
                    setPaymentMethod(val)
                  }
                >
                  {/* Cash on Delivery */}
                  <div
                    className={`flex items-center space-x-4 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === "cod" ? "border-primary bg-muted/20" : ""}`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">
                          {language === "ar"
                            ? "الدفع عند الاستلام"
                            : "Cash on Delivery"}
                        </span>
                      </div>
                    </Label>
                  </div>

                  {/* Visa */}
                  <div
                    className={`flex flex-col space-y-4 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === "visa" ? "border-primary bg-muted/20" : ""}`}
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value="visa" id="visa" />
                      <Label
                        htmlFor="visa"
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">Visa / Mastercard</span>
                        </div>
                        <div className="flex gap-2">
                          {/* Icons could go here */}
                        </div>
                      </Label>
                    </div>

                    {/* Visa Details Inputs (Conditionally Rendered) */}
                    {paymentMethod === "visa" && (
                      <div className="pt-2 pl-8 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Card Number</Label>
                          <Input placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Expiry Date</Label>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">CVC</Label>
                            <Input placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <div
                    className={`flex flex-col space-y-4 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === "paypal" ? "border-primary bg-muted/20" : ""}`}
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label
                        htmlFor="paypal"
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">PayPal</span>
                        </div>
                      </Label>
                    </div>
                    {paymentMethod === "paypal" && (
                      <div className="pt-2 pl-8 text-sm text-balance text-muted-foreground animate-in fade-in slide-in-from-top-2">
                        {language === "ar"
                          ? "سيتم إعادة توجيهك إلى PayPal لإتمام عملية الدفع بشكل آمن."
                          : "You will be redirected to PayPal to complete your purchase securely."}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "ar" ? "مراجعة الطلب" : "Review Order"}
                </CardTitle>
                <CardDescription>
                  {language === "ar"
                    ? "يرجى مراجعة تفاصيل طلبك قبل التأكيد."
                    : "Please review your order details before confirming."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Info Summary */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                  <h4 className="font-semibold mb-2">
                    {language === "ar" ? "تفاصيل الشحن" : "Shipping Details"}
                  </h4>
                  <p>
                    <span className="text-muted-foreground">
                      {language === "ar" ? "الاسم:" : "Name:"}
                    </span>{" "}
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      {language === "ar" ? "الهاتف:" : "Phone:"}
                    </span>{" "}
                    {formData.phone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      {language === "ar" ? "العنوان:" : "Address:"}
                    </span>{" "}
                    {formData.address}, {formData.city}
                  </p>
                </div>

                {/* Payment Info Summary */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                  <h4 className="font-semibold mb-2">
                    {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </h4>
                  <p className="flex items-center gap-2">
                    {paymentMethod === "cod" && (
                      <>
                        <Truck className="w-4 h-4" />{" "}
                        {language === "ar"
                          ? "الدفع عند الاستلام"
                          : "Cash on Delivery"}
                      </>
                    )}
                    {paymentMethod === "visa" && (
                      <>
                        <CreditCard className="w-4 h-4" /> Visa / Mastercard
                      </>
                    )}
                    {paymentMethod === "paypal" && (
                      <>
                        <Wallet className="w-4 h-4" /> PayPal
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isProcessing}
            >
              <ChevronLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {language === "ar" ? "السابق" : "Back"}
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNextStep}>
                {language === "ar" ? "التالي" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
              </Button>
            ) : (
              <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing
                  ? language === "ar"
                    ? "جاري المعالجة..."
                    : "Processing..."
                  : language === "ar"
                    ? "تأكيد الطلب"
                    : "Place Order"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>
                {language === "ar" ? "ملخص الطلب" : "Order Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 rounded bg-muted shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt="product"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2 md:line-clamp-1">
                        {language === "ar" ? item.name.ar : item.name.en}
                      </p>
                      <div className="flex justify-between text-muted-foreground mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "ar" ? "الشحن" : "Shipping"}
                  </span>
                  <span>{language === "ar" ? "مجاني" : "Free"}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
