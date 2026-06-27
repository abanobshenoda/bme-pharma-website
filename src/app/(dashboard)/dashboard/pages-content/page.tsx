import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Info,
  Phone,
  Image as ImageIcon,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const contentPages = [
  {
    title: "Homepage",
    description: "Manage content for the main landing page.",
    icon: Home,
    href: "/dashboard/pages-content/homepage",
  },
  {
    title: "About Us",
    description: "Edit company history, mission, and team details.",
    icon: Info,
    href: "/dashboard/pages-content/about-us",
  },
  {
    title: "Contact Us",
    description: "Update contact information and map settings.",
    icon: Phone,
    href: "/dashboard/pages-content/contact-us",
  },
  {
    title: "Gallery",
    description: "Manage image galleries and media collections.",
    icon: ImageIcon,
    href: "/dashboard/pages-content/gallery",
  },
  {
    title: "Store",
    description: "Configure store settings, featured products, and layout.",
    icon: ShoppingBag,
    href: "/dashboard/pages-content/store",
  },
  {
    title: "Company Info",
    description: "Manage contact details, address, and social media links.",
    icon: Info,
    href: "/dashboard/pages-content/company-info",
  },
];

export default function PagesContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pages Content</h3>
        <p className="text-sm text-muted-foreground">
          Manage the content of your website pages.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contentPages.map((page) => (
          <Link key={page.title} href={page.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {page.title}
                </CardTitle>
                <page.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{page.description}</CardDescription>
                <div className="mt-4 flex items-center text-sm text-primary">
                  Manage <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
