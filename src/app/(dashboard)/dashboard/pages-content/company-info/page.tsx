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
import {
  getCompanyInfo,
  updateCompanyInfo,
} from "@/actions/company-info-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function CompanyInfoPage() {
  const { data: companyInfo } = await getCompanyInfo();

  async function handleSubmit(formData: FormData) {
    "use server";

    const data = {
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      arabic_address: formData.get("arabic_address") as string,
      english_address: formData.get("english_address") as string,
      arabic_workingDays: formData.get("arabic_workingDays") as string,
      english_workingDays: formData.get("english_workingDays") as string,
      facebook: formData.get("facebook") as string,
      twitter: formData.get("twitter") as string,
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      youtube: formData.get("youtube") as string,
    };

    const result = await updateCompanyInfo(data);

    if (result.success) {
      revalidatePath("/dashboard/pages-content/company-info");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Company Information</h3>
        <p className="text-sm text-muted-foreground">
          Manage your company`&apos;`s contact details, address, and social
          media links.
        </p>
      </div>
      <Separator />

      <form action={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>
                Enter the primary contact information for the company.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={companyInfo?.email || ""}
                  placeholder="info@company.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={companyInfo?.phone || ""}
                  placeholder="+1 234 567 890"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address & Working Hours</CardTitle>
              <CardDescription>
                Provide location and operational hours in both languages.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="english_address">Address (English)</Label>
                  <Textarea
                    id="english_address"
                    name="english_address"
                    defaultValue={companyInfo?.english_address || ""}
                    placeholder="123 Street Name, City, Country"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="english_workingDays">
                    Working Days (English)
                  </Label>
                  <Input
                    id="english_workingDays"
                    name="english_workingDays"
                    defaultValue={companyInfo?.english_workingDays || ""}
                    placeholder="Mon - Fri: 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <div className="grid gap-2">
                  <Label htmlFor="arabic_address">العنوان (بالعربي)</Label>
                  <Textarea
                    id="arabic_address"
                    name="arabic_address"
                    defaultValue={companyInfo?.arabic_address || ""}
                    placeholder="اسم الشارع، المدينة، الدولة"
                    className="text-right"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="arabic_workingDays">
                    أيام العمل (بالعربي)
                  </Label>
                  <Input
                    id="arabic_workingDays"
                    name="arabic_workingDays"
                    defaultValue={companyInfo?.arabic_workingDays || ""}
                    placeholder="الأحد - الخميس: ٩:٠٠ ص - ٥:٠٠ م"
                    className="text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Links to your company`&apos;`s social media profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    defaultValue={companyInfo?.facebook || ""}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter">Twitter (X)</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    defaultValue={companyInfo?.twitter || ""}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    defaultValue={companyInfo?.instagram || ""}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    defaultValue={companyInfo?.linkedin || ""}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    defaultValue={companyInfo?.youtube || ""}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
