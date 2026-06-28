import { CheckoutClient } from "./checkout-client";
import { getCompanyInfo } from "@/actions/company-info-actions";

export const metadata = {
  title: "Checkout | BME Pharma",
  description: "Secure checkout for your BME Pharma order",
};

export default async function CheckoutPage() {
  const { data: companyInfo } = await getCompanyInfo();

  return <CheckoutClient companyInfo={companyInfo} />;
}
