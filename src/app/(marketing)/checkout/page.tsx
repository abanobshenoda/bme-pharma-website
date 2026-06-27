import { CheckoutClient } from "./checkout-client";

export const metadata = {
  title: "Checkout | BME Pharma",
  description: "Secure checkout for your BME Pharma order",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
