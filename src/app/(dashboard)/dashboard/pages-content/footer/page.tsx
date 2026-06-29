import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCompanyInfo, updateCompanyInfo } from "@/actions/company-info-actions";
import { revalidatePath } from "next/cache";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  AlignLeft,
} from "lucide-react";

export default async function FooterPage() {
  const { data: companyInfo } = await getCompanyInfo();

  async function handleSubmit(formData: FormData) {
    "use server";

    const data = {
      // Contact
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,

      // Footer description
      english_description: formData.get("english_description") as string,
      arabic_description: formData.get("arabic_description") as string,

      // Address
      arabic_address: companyInfo?.arabic_address ?? null,
      english_address: companyInfo?.english_address ?? null,
      arabic_workingDays: companyInfo?.arabic_workingDays ?? null,
      english_workingDays: companyInfo?.english_workingDays ?? null,

      // Social
      facebook: formData.get("facebook") as string,
      twitter: formData.get("twitter") as string,
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      youtube: formData.get("youtube") as string,

      // Payment — preserve existing values
      codEnabled: companyInfo?.codEnabled ?? true,
      manualEnabled: companyInfo?.manualEnabled ?? false,
      bankName: companyInfo?.bankName ?? null,
      bankAccountNo: companyInfo?.bankAccountNo ?? null,
      bankIban: companyInfo?.bankIban ?? null,
      bankSwift: companyInfo?.bankSwift ?? null,
      instaPayId: companyInfo?.instaPayId ?? null,
      mobileWalletNo: companyInfo?.mobileWalletNo ?? null,
    };

    await updateCompanyInfo(data);
    revalidatePath("/dashboard/pages-content/footer");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Footer Content</h3>
        <p className="text-sm text-muted-foreground">
          Manage the text, contact details, and social links shown in the
          website footer.
        </p>
      </div>
      <Separator />

      <form action={handleSubmit}>
        <div className="grid gap-6">

          {/* ── Description / Tagline ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Footer Description</CardTitle>
              </div>
              <CardDescription>
                Short tagline or description shown below the logo in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="english_description">
                  Description (English)
                </Label>
                <Textarea
                  id="english_description"
                  name="english_description"
                  rows={4}
                  defaultValue={companyInfo?.english_description ?? ""}
                  placeholder="Dedicated to providing high-quality pharmaceutical products…"
                />
              </div>
              <div className="grid gap-2" dir="rtl">
                <Label htmlFor="arabic_description">الوصف (بالعربي)</Label>
                <Textarea
                  id="arabic_description"
                  name="arabic_description"
                  rows={4}
                  defaultValue={companyInfo?.arabic_description ?? ""}
                  placeholder="نلتزم بتقديم منتجات صيدلانية عالية الجودة…"
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Contact Details ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Contact Details</CardTitle>
              </div>
              <CardDescription>
                Email and phone number displayed in the footer contact column.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={companyInfo?.email ?? ""}
                  placeholder="info@company.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={companyInfo?.phone ?? ""}
                  placeholder="+20 123 456 7890"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Social Media ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Social Media Links</CardTitle>
              </div>
              <CardDescription>
                Links shown as icons in the footer. Leave blank to hide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    defaultValue={companyInfo?.facebook ?? ""}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-3.5 w-3.5 text-sky-500" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    defaultValue={companyInfo?.twitter ?? ""}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-3.5 w-3.5 text-pink-500" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    defaultValue={companyInfo?.instagram ?? ""}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    defaultValue={companyInfo?.linkedin ?? ""}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="h-3.5 w-3.5 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    defaultValue={companyInfo?.youtube ?? ""}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Preview hint ── */}
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              To update the <strong>address</strong> and{" "}
              <strong>working hours</strong> shown in the footer, go to{" "}
              <a
                href="/dashboard/pages-content/company-info"
                className="text-primary underline underline-offset-2"
              >
                Company Info
              </a>
              .
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Footer Content
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
