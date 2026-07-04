import { getPromoCodes } from "@/actions/promo-code-actions";
import { PromoCodesClient } from "./promo-codes-client";

export const metadata = {
  title: "Promo Codes | BME Dashboard",
};

export default async function PromoCodesPage() {
  const res = await getPromoCodes();
  const codes = res.success ? (res.data ?? []) : [];

  return <PromoCodesClient initialCodes={codes} />;
}
