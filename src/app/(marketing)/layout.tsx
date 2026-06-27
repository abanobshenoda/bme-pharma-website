import { InfoBar } from "@/components/layout/info-bar";
import { MainHeader } from "@/components/layout/main-header";
import { Footer } from "@/components/layout/footer";

import { getCategories } from "@/actions/category-actions";
import { getCompanyInfo } from "@/actions/company-info-actions";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoriesResponse = await getCategories();
  const categories = categoriesResponse.success
    ? (categoriesResponse.data ?? [])
    : [];

  const companyInfoResponse = await getCompanyInfo();
  const companyInfo = companyInfoResponse.success
    ? (companyInfoResponse.data ?? null)
    : null;

  return (
    <div className="flex flex-col min-h-screen ">
      <InfoBar />
      <MainHeader />
      <div className="flex-1">{children}</div>
      <Footer categories={categories} companyInfo={companyInfo} />
    </div>
  );
}
