"use client";

import { useState } from "react";
import { useStore } from "@/context/store-context";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder, OrderInput } from "@/actions/order-actions";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

export function CheckoutClient() {
  const router = useRouter();
  const { cart, cartTotal, setCart } = useStore();
  const { formatPrice, currency } = useCurrency();
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MANUAL">("COD");
  const [receiptImage, setReceiptImage] = useState<string>("");

  const subtotal = cartTotal;
  // Fixed shipping fee logic matching server side (this could be synced better ideally)
  const shippingFee = currency === "EGP" ? 100 : 2;
  const total = subtotal + shippingFee;

  const clearCart = () => setCart([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      router.push("/store"); // Or a dedicated success page
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
              <CardContent className="p-6 space-y-4">
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
                      {language === "ar" ? "رقم الهاتف" : "Phone Number"} *
                    </Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      required
                      type="tel"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                    />
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
              <CardContent className="p-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val: "COD" | "MANUAL") =>
                    setPaymentMethod(val)
                  }
                  className="space-y-4"
                >
                  {/* COD Option */}
                  <div
                    className={`flex items-start space-x-3 rtl:space-x-reverse border p-4 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <RadioGroupItem value="COD" id="cod" className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor="cod"
                        className="text-base font-bold cursor-pointer flex items-center gap-2"
                      >
                        <Banknote className="w-5 h-5 text-green-600" />
                        {language === "ar"
                          ? "الدفع عند الاستلام (COD)"
                          : "Cash on Delivery (COD)"}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "ar"
                          ? "قم بلدفع نقداً لمندوب التوصيل عند استلام طلبك."
                          : "Pay in cash to the delivery agent upon receiving your order."}
                      </p>
                    </div>
                  </div>

                  {/* Manual Transfer Option */}
                  <div
                    className={`flex items-start space-x-3 rtl:space-x-reverse border p-4 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "MANUAL"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("MANUAL")}
                  >
                    <RadioGroupItem
                      value="MANUAL"
                      id="manual"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="manual"
                        className="text-base font-bold cursor-pointer flex items-center gap-2"
                      >
                        <Wallet className="w-5 h-5 text-primary" />
                        {language === "ar"
                          ? "تحويل بنكي / محفظة إلكترونية"
                          : "Bank Transfer / E-Wallet"}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        {language === "ar"
                          ? "حول المبلغ لأحد الأرقام الموضحة، ثم ارفع صورة إيصال التحويل لتأكيد الطلب."
                          : "Transfer the amount to the provided details, then upload the receipt to confirm."}
                      </p>

                      {/* Manual Transfer Details (Only shows when selected) */}
                      {paymentMethod === "MANUAL" && (
                        <div className="bg-background/80 p-4 rounded-lg border mt-2 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="text-sm space-y-2">
                            <p className="font-semibold">
                              {language === "ar"
                                ? "أرقام التحويل المتاحة:"
                                : "Available Transfer Numbers:"}
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                              <li>
                                InstaPay / Vodafone Cash:{" "}
                                <span className="font-mono text-foreground font-medium">
                                  01000000000
                                </span>
                              </li>
                              <li>
                                Bank Account Number (CIB):{" "}
                                <span className="font-mono text-foreground font-medium">
                                  100029384756
                                </span>
                              </li>
                            </ul>
                            <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
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
                </RadioGroup>
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
              <CardContent className="p-6">
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
                  {cart.length} {language === "ar" ? "منتجات" : "items"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Items List */}
                <div className="max-h-[40vh] overflow-y-auto p-6 space-y-4 scrollbar-thin">
                  {cart.map((item) => {
                    const price = item.price || 0;
                    const discount = item.discount || 0;
                    const discountedPrice = price - (price * discount) / 100;

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
                          <p className="text-sm font-bold text-primary mt-1">
                            {formatPrice(
                              discountedPrice * item.quantity,
                              item.currency,
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
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === "ar" ? "مصاريف الشحن" : "Shipping Fee"}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {language === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0 bg-muted/30 pb-6 rounded-b-xl">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-6"
                    disabled={isLoading}
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
