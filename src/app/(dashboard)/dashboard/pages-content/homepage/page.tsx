"use client";

import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { getHero, createSlide, updateSlide } from "@/actions/homepage-actions";
import {
  getCategorySection,
  createCategorySection,
  updateCategorySection,
} from "@/actions/category-section-actions";
import {
  getFeaturedProductsSection,
  createFeaturedProductsSection,
  updateFeaturedProductsSection,
} from "@/actions/featured-products-section-actions";
import {
  getWhoWeAreSection,
  createWhoWeAreSection,
  updateWhoWeAreSection,
  createWhoWeAreContent,
  updateWhoWeAreContent,
  deleteWhoWeAreContent,
} from "@/actions/who-we-are-section-actions";
import {
  getGallerySectionConfig,
  createGallerySectionConfig,
  updateGallerySectionConfig,
} from "@/actions/gallery-section-actions";
import { getGalleryImages } from "@/actions/gallery-actions";
import { toast } from "sonner";
import { getStatisticsSection } from "@/actions/statistics-section-actions";
import { StatisticsSectionForm } from "./statistics-section-form";
import type {
  HeroSlide,
  CategorySection,
  FeaturedProductsSection,
  WhoWeAreSection,
  WhoWeAreContent,
  GallerySectionConfig,
  GalleryImage,
  StatisticsSection,
  StatisticsItem,
} from "@/generated/prisma/client";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

interface StatisticsSectionWithItems extends StatisticsSection {
  items: StatisticsItem[];
}

const ICON_OPTIONS = [
  { value: "Award", label: "Award" },
  { value: "Globe", label: "Globe" },
  { value: "Users", label: "Users" },
  { value: "Headset", label: "Headset" },
  { value: "Heart", label: "Heart" },
  { value: "Shield", label: "Shield" },
  { value: "Star", label: "Star" },
  { value: "Target", label: "Target" },
  { value: "Zap", label: "Zap" },
  { value: "Clock", label: "Clock" },
  { value: "CheckCircle", label: "CheckCircle" },
  { value: "Lightbulb", label: "Lightbulb" },
  { value: "TrendingUp", label: "TrendingUp" },
  { value: "Package", label: "Package" },
  { value: "Truck", label: "Truck" },
];

type WhoWeAreSectionWithContents = WhoWeAreSection & {
  contents: WhoWeAreContent[];
};

type EditingContentItem = {
  id?: number;
  icon: string;
  arabic_title: string;
  english_title: string;
  arabic_subtitle: string;
  english_subtitle: string;
};

export default function HomepageContent() {
  const [hero, setHero] = useState<HeroSlide | null>(null);
  const [editingHero, setEditingHero] = useState<Partial<HeroSlide>>({});
  const [categorySection, setCategorySection] =
    useState<CategorySection | null>(null);
  const [editingCategorySection, setEditingCategorySection] = useState<
    Partial<CategorySection>
  >({});
  const [featuredProductsSection, setFeaturedProductsSection] =
    useState<FeaturedProductsSection | null>(null);
  const [editingFeaturedProductsSection, setEditingFeaturedProductsSection] =
    useState<Partial<FeaturedProductsSection>>({});
  const [whoWeAreSection, setWhoWeAreSection] =
    useState<WhoWeAreSectionWithContents | null>(null);
  const [editingWhoWeAreSection, setEditingWhoWeAreSection] = useState<
    Partial<WhoWeAreSection>
  >({});
  const [editingWhoWeAreContents, setEditingWhoWeAreContents] = useState<
    EditingContentItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [categorySectionLoading, setCategorySectionLoading] = useState(false);
  const [featuredProductsSectionLoading, setFeaturedProductsSectionLoading] =
    useState(false);
  const [whoWeAreSectionLoading, setWhoWeAreSectionLoading] = useState(false);
  const [gallerySectionConfig, setGallerySectionConfig] =
    useState<GallerySectionConfig | null>(null);
  const [editingGallerySection, setEditingGallerySection] = useState<
    Partial<GallerySectionConfig>
  >({});
  const [gallerySectionLoading, setGallerySectionLoading] = useState(false);
  const [allGalleryImages, setAllGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [statisticsSection, setStatisticsSection] =
    useState<StatisticsSectionWithItems | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchHero = useCallback(async () => {
    const response = await getHero();
    if (response.success && response.data) {
      setHero(response.data);
      setEditingHero(response.data);
    } else {
      // No hero exists yet, initialize with empty values
      setHero(null);
      setEditingHero({
        image: "",
        arabic_subtitle: "",
        english_subtitle: "",
        arabic_title: "",
        english_title: "",
        arabic_description: "",
        english_description: "",
        arabic_buttonText: "",
        english_buttonText: "",
        arabic_buttonLink: "",
        english_buttonLink: "",
      });
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHero = async () => {
      const response = await getHero();
      if (!isMounted) return;

      if (response.success && response.data) {
        setHero(response.data);
        setEditingHero(response.data);
      } else {
        setHero(null);
        setEditingHero({
          image: "",
          arabic_subtitle: "",
          english_subtitle: "",
          arabic_title: "",
          english_title: "",
          arabic_description: "",
          english_description: "",
          arabic_buttonText: "",
          english_buttonText: "",
          arabic_buttonLink: "",
          english_buttonLink: "",
        });
      }
      setIsInitialized(true);
    };

    const loadCategorySection = async () => {
      const response = await getCategorySection();
      if (!isMounted) return;

      if (response.success && response.data) {
        setCategorySection(response.data);
        setEditingCategorySection(response.data);
      } else {
        setCategorySection(null);
        setEditingCategorySection({
          arabic_header: "",
          english_header: "",
          arabic_description: "",
          english_description: "",
        });
      }
    };

    const loadFeaturedProductsSection = async () => {
      const response = await getFeaturedProductsSection();
      if (!isMounted) return;

      if (response.success && response.data) {
        setFeaturedProductsSection(response.data);
        setEditingFeaturedProductsSection(response.data);
      } else {
        setFeaturedProductsSection(null);
        setEditingFeaturedProductsSection({
          arabic_header: "",
          english_header: "",
          arabic_description: "",
          english_description: "",
        });
      }
    };

    const loadWhoWeAreSection = async () => {
      const response = await getWhoWeAreSection();
      if (!isMounted) return;

      if (response.success && response.data) {
        setWhoWeAreSection(response.data);
        setEditingWhoWeAreSection(response.data);
        setEditingWhoWeAreContents(
          response.data.contents.map((c) => ({
            id: c.id,
            icon: c.icon || "Award",
            arabic_title: c.arabic_title || "",
            english_title: c.english_title || "",
            arabic_subtitle: c.arabic_subtitle || "",
            english_subtitle: c.english_subtitle || "",
          })),
        );
      } else {
        setWhoWeAreSection(null);
        setEditingWhoWeAreSection({
          arabic_header: "",
          english_header: "",
          arabic_description: "",
          english_description: "",
          backgroundImage: "",
        });
        setEditingWhoWeAreContents([]);
      }
    };

    const loadGallerySection = async () => {
      const configResponse = await getGallerySectionConfig();
      const imagesResponse = await getGalleryImages();
      if (!isMounted) return;

      if (imagesResponse.success && imagesResponse.data) {
        setAllGalleryImages(imagesResponse.data);
      }

      if (configResponse.success && configResponse.data) {
        setGallerySectionConfig(configResponse.data);
        setEditingGallerySection(configResponse.data);
        setSelectedImageIds(configResponse.data.selectedImageIds);
      } else {
        setGallerySectionConfig(null);
        setEditingGallerySection({
          arabic_header: "",
          english_header: "",
          arabic_description: "",
          english_description: "",
        });
        setSelectedImageIds([]);
      }
    };

    const loadStatisticsSection = async () => {
      const response = await getStatisticsSection();
      if (!isMounted) return;

      if (response.success && response.data) {
        setStatisticsSection(response.data);
      } else {
        setStatisticsSection(null);
      }
    };

    loadHero();
    loadCategorySection();
    loadFeaturedProductsSection();
    loadWhoWeAreSection();
    loadGallerySection();
    loadStatisticsSection();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!editingHero) return;
    setLoading(true);

    let response;
    if (hero?.id) {
      // Update existing hero
      response = await updateSlide(hero.id, editingHero);
    } else {
      // Create new hero
      response = await createSlide({
        image: editingHero.image || "",
        arabic_subtitle: editingHero.arabic_subtitle || null,
        english_subtitle: editingHero.english_subtitle || null,
        arabic_title: editingHero.arabic_title || null,
        english_title: editingHero.english_title || null,
        arabic_description: editingHero.arabic_description || null,
        english_description: editingHero.english_description || null,
        arabic_buttonText: editingHero.arabic_buttonText || null,
        english_buttonText: editingHero.english_buttonText || null,
        arabic_buttonLink: editingHero.arabic_buttonLink || null,
        english_buttonLink: editingHero.english_buttonLink || null,
      });
    }

    setLoading(false);

    if (response.success) {
      toast.success("Hero saved successfully");
      fetchHero();
    } else {
      toast.error("Failed to save hero");
    }
  };

  const handleSaveCategorySection = async () => {
    if (!editingCategorySection) return;
    setCategorySectionLoading(true);

    let response;
    if (categorySection?.id) {
      response = await updateCategorySection(
        categorySection.id,
        editingCategorySection,
      );
    } else {
      response = await createCategorySection({
        arabic_header: editingCategorySection.arabic_header || null,
        english_header: editingCategorySection.english_header || null,
        arabic_description: editingCategorySection.arabic_description || null,
        english_description: editingCategorySection.english_description || null,
      });
    }

    setCategorySectionLoading(false);

    if (response.success && response.data) {
      toast.success("Category section saved successfully");
      setCategorySection(response.data);
      setEditingCategorySection(response.data);
    } else {
      toast.error("Failed to save category section");
    }
  };

  const handleSaveFeaturedProductsSection = async () => {
    if (!editingFeaturedProductsSection) return;
    setFeaturedProductsSectionLoading(true);

    let response;
    if (featuredProductsSection?.id) {
      response = await updateFeaturedProductsSection(
        featuredProductsSection.id,
        editingFeaturedProductsSection,
      );
    } else {
      response = await createFeaturedProductsSection({
        arabic_header: editingFeaturedProductsSection.arabic_header || null,
        english_header: editingFeaturedProductsSection.english_header || null,
        arabic_description:
          editingFeaturedProductsSection.arabic_description || null,
        english_description:
          editingFeaturedProductsSection.english_description || null,
      });
    }

    setFeaturedProductsSectionLoading(false);

    if (response.success && response.data) {
      toast.success("Featured products section saved successfully");
      setFeaturedProductsSection(response.data);
      setEditingFeaturedProductsSection(response.data);
    } else {
      toast.error("Failed to save featured products section");
    }
  };

  const handleAddContentItem = () => {
    setEditingWhoWeAreContents([
      ...editingWhoWeAreContents,
      {
        icon: "Award",
        arabic_title: "",
        english_title: "",
        arabic_subtitle: "",
        english_subtitle: "",
      },
    ]);
  };

  const handleRemoveContentItem = async (index: number) => {
    const item = editingWhoWeAreContents[index];
    if (item.id) {
      const response = await deleteWhoWeAreContent(item.id);
      if (!response.success) {
        toast.error("Failed to delete content item");
        return;
      }
    }
    setEditingWhoWeAreContents(
      editingWhoWeAreContents.filter((_, i) => i !== index),
    );
    toast.success("Content item removed");
  };

  const handleUpdateContentItem = (
    index: number,
    field: keyof EditingContentItem,
    value: string,
  ) => {
    const updated = [...editingWhoWeAreContents];
    updated[index] = { ...updated[index], [field]: value };
    setEditingWhoWeAreContents(updated);
  };

  const handleSaveWhoWeAreSection = async () => {
    if (!editingWhoWeAreSection) return;
    setWhoWeAreSectionLoading(true);

    try {
      let sectionResponse;
      let sectionId: number;

      if (whoWeAreSection?.id) {
        sectionResponse = await updateWhoWeAreSection(whoWeAreSection.id, {
          arabic_header: editingWhoWeAreSection.arabic_header,
          english_header: editingWhoWeAreSection.english_header,
          arabic_description: editingWhoWeAreSection.arabic_description,
          english_description: editingWhoWeAreSection.english_description,
          backgroundImage: editingWhoWeAreSection.backgroundImage,
        });
        sectionId = whoWeAreSection.id;
      } else {
        sectionResponse = await createWhoWeAreSection({
          arabic_header: editingWhoWeAreSection.arabic_header || null,
          english_header: editingWhoWeAreSection.english_header || null,
          arabic_description: editingWhoWeAreSection.arabic_description || null,
          english_description:
            editingWhoWeAreSection.english_description || null,
          backgroundImage: editingWhoWeAreSection.backgroundImage || null,
        });
        if (!sectionResponse.success || !sectionResponse.data) {
          toast.error("Failed to save who we are section");
          setWhoWeAreSectionLoading(false);
          return;
        }
        sectionId = sectionResponse.data.id;
      }

      // Save content items
      for (const item of editingWhoWeAreContents) {
        if (item.id) {
          await updateWhoWeAreContent(item.id, {
            icon: item.icon,
            arabic_title: item.arabic_title,
            english_title: item.english_title,
            arabic_subtitle: item.arabic_subtitle,
            english_subtitle: item.english_subtitle,
          });
        } else {
          const res = await createWhoWeAreContent({
            icon: item.icon,
            arabic_title: item.arabic_title,
            english_title: item.english_title,
            arabic_subtitle: item.arabic_subtitle,
            english_subtitle: item.english_subtitle,
            sectionId,
          });
          if (res.success && res.data) {
            item.id! = res.data.id;
          }
        }
      }

      // Reload section data
      const reloadResponse = await getWhoWeAreSection();
      if (reloadResponse.success && reloadResponse.data) {
        setWhoWeAreSection(reloadResponse.data);
        setEditingWhoWeAreSection(reloadResponse.data);
        setEditingWhoWeAreContents(
          reloadResponse.data.contents.map((c) => ({
            id: c.id,
            icon: c.icon || "Award",
            arabic_title: c.arabic_title || "",
            english_title: c.english_title || "",
            arabic_subtitle: c.arabic_subtitle || "",
            english_subtitle: c.english_subtitle || "",
          })),
        );
      }

      toast.success("Who we are section saved successfully");
    } catch (_error) {
      toast.error("Failed to save who we are section");
    }

    setWhoWeAreSectionLoading(false);
  };

  const handleToggleGalleryImage = (imageId: number) => {
    setSelectedImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId],
    );
  };

  const handleSaveGallerySection = async () => {
    if (!editingGallerySection) return;
    setGallerySectionLoading(true);

    try {
      let response;
      if (gallerySectionConfig?.id) {
        response = await updateGallerySectionConfig(gallerySectionConfig.id, {
          arabic_header: editingGallerySection.arabic_header,
          english_header: editingGallerySection.english_header,
          arabic_description: editingGallerySection.arabic_description,
          english_description: editingGallerySection.english_description,
          selectedImageIds,
        });
      } else {
        response = await createGallerySectionConfig({
          arabic_header: editingGallerySection.arabic_header || null,
          english_header: editingGallerySection.english_header || null,
          arabic_description: editingGallerySection.arabic_description || null,
          english_description:
            editingGallerySection.english_description || null,
          selectedImageIds,
        });
      }

      if (response.success && response.data) {
        toast.success("Gallery section saved successfully");
        setGallerySectionConfig(response.data);
        setEditingGallerySection(response.data);
        setSelectedImageIds(response.data.selectedImageIds);
      } else {
        toast.error("Failed to save gallery section");
      }
    } catch (_error) {
      toast.error("Failed to save gallery section");
    }

    setGallerySectionLoading(false);
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h3 className="text-lg font-medium">Homepage</h3>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Homepage</h3>
        <p className="text-sm text-muted-foreground">
          Manage content for the main landing page.
        </p>
      </div>
      <Separator />

      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold">Hero Section</h4>
          <Button onClick={handleSave} className="gap-2" disabled={loading}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Hero
              </>
            )}
          </Button>
        </div>

        {/* Hero Image Preview */}
        <Card className="relative aspect-[21/9] overflow-hidden">
          {editingHero.image ? (
            <Image
              src={editingHero.image}
              alt="Hero Image"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>No hero image uploaded</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm opacity-80">{editingHero.english_subtitle}</p>
            <h2 className="text-2xl font-bold">
              {editingHero.english_title || "Hero Title"}
            </h2>
          </div>
        </Card>

        {/* Hero Image Upload */}
        <div className="grid gap-2">
          <Label>Hero Image</Label>
          <CloudinaryUploadWidget
            value={editingHero.image || ""}
            onUpload={(url) => setEditingHero({ ...editingHero, image: url })}
            onRemove={() => setEditingHero({ ...editingHero, image: "" })}
          />
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Content */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              English Content
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="en-subtitle">Subtitle</Label>
              <Input
                id="en-subtitle"
                value={editingHero.english_subtitle || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    english_subtitle: e.target.value,
                  })
                }
                placeholder="e.g. Advanced Healthcare"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="en-title">Title</Label>
              <Input
                id="en-title"
                value={editingHero.english_title || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    english_title: e.target.value,
                  })
                }
                placeholder="Hero Title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="en-description">Description</Label>
              <Textarea
                id="en-description"
                value={editingHero.english_description || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    english_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="Short description text..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="en-btn-text">Button Text</Label>
              <Input
                id="en-btn-text"
                value={editingHero.english_buttonText || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    english_buttonText: e.target.value,
                  })
                }
                placeholder="About Us"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="en-btn-link">Button Link</Label>
              <Input
                id="en-btn-link"
                value={editingHero.english_buttonLink || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    english_buttonLink: e.target.value,
                    arabic_buttonLink: e.target.value,
                  })
                }
                placeholder="/about-us"
              />
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4 border p-4 rounded-lg" dir="rtl">
            <h4 className="font-medium text-sm text-muted-foreground mb-2 text-right">
              المحتوى العربي
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="ar-subtitle">العنوان الفرعي</Label>
              <Input
                id="ar-subtitle"
                value={editingHero.arabic_subtitle || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    arabic_subtitle: e.target.value,
                  })
                }
                placeholder="مثال: رعاية صحية متقدمة"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ar-title">العنوان</Label>
              <Input
                id="ar-title"
                value={editingHero.arabic_title || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    arabic_title: e.target.value,
                  })
                }
                placeholder="عنوان الهيرو"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ar-description">الوصف</Label>
              <Textarea
                id="ar-description"
                value={editingHero.arabic_description || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    arabic_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="نص وصف قصير..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ar-btn-text">نص الزر</Label>
              <Input
                id="ar-btn-text"
                value={editingHero.arabic_buttonText || ""}
                onChange={(e) =>
                  setEditingHero({
                    ...editingHero,
                    arabic_buttonText: e.target.value,
                  })
                }
                placeholder="عن الشركة"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Category Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold">Category Section</h4>
          <Button
            onClick={handleSaveCategorySection}
            className="gap-2"
            disabled={categorySectionLoading}
          >
            {categorySectionLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Section
              </>
            )}
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Content */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              English Content
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="cat-en-header">Header</Label>
              <Input
                id="cat-en-header"
                value={editingCategorySection.english_header || ""}
                onChange={(e) =>
                  setEditingCategorySection({
                    ...editingCategorySection,
                    english_header: e.target.value,
                  })
                }
                placeholder="e.g. Our Categories"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-en-description">Description</Label>
              <Textarea
                id="cat-en-description"
                value={editingCategorySection.english_description || ""}
                onChange={(e) =>
                  setEditingCategorySection({
                    ...editingCategorySection,
                    english_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="Brief description of the categories..."
              />
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4 border p-4 rounded-lg" dir="rtl">
            <h4 className="font-medium text-sm text-muted-foreground mb-2 text-right">
              المحتوى العربي
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="cat-ar-header">العنوان</Label>
              <Input
                id="cat-ar-header"
                value={editingCategorySection.arabic_header || ""}
                onChange={(e) =>
                  setEditingCategorySection({
                    ...editingCategorySection,
                    arabic_header: e.target.value,
                  })
                }
                placeholder="مثال: فئاتنا"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-ar-description">الوصف</Label>
              <Textarea
                id="cat-ar-description"
                value={editingCategorySection.arabic_description || ""}
                onChange={(e) =>
                  setEditingCategorySection({
                    ...editingCategorySection,
                    arabic_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="وصف مختصر للفئات..."
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Featured Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold">Featured Products Section</h4>
          <Button
            onClick={handleSaveFeaturedProductsSection}
            className="gap-2"
            disabled={featuredProductsSectionLoading}
          >
            {featuredProductsSectionLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Section
              </>
            )}
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Content */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              English Content
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="fp-en-header">Header</Label>
              <Input
                id="fp-en-header"
                value={editingFeaturedProductsSection.english_header || ""}
                onChange={(e) =>
                  setEditingFeaturedProductsSection({
                    ...editingFeaturedProductsSection,
                    english_header: e.target.value,
                  })
                }
                placeholder="e.g. Featured Products"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fp-en-description">Description</Label>
              <Textarea
                id="fp-en-description"
                value={editingFeaturedProductsSection.english_description || ""}
                onChange={(e) =>
                  setEditingFeaturedProductsSection({
                    ...editingFeaturedProductsSection,
                    english_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="Brief description of the featured products..."
              />
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4 border p-4 rounded-lg" dir="rtl">
            <h4 className="font-medium text-sm text-muted-foreground mb-2 text-right">
              المحتوى العربي
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="fp-ar-header">العنوان</Label>
              <Input
                id="fp-ar-header"
                value={editingFeaturedProductsSection.arabic_header || ""}
                onChange={(e) =>
                  setEditingFeaturedProductsSection({
                    ...editingFeaturedProductsSection,
                    arabic_header: e.target.value,
                  })
                }
                placeholder="مثال: المنتجات المميزة"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fp-ar-description">الوصف</Label>
              <Textarea
                id="fp-ar-description"
                value={editingFeaturedProductsSection.arabic_description || ""}
                onChange={(e) =>
                  setEditingFeaturedProductsSection({
                    ...editingFeaturedProductsSection,
                    arabic_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="وصف مختصر للمنتجات المميزة..."
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Who We Are Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold">Who We Are Section</h4>
          <Button
            onClick={handleSaveWhoWeAreSection}
            className="gap-2"
            disabled={whoWeAreSectionLoading}
          >
            {whoWeAreSectionLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Section
              </>
            )}
          </Button>
        </div>

        {/* Background Image */}
        <div className="grid gap-2">
          <Label>Background Image</Label>
          {editingWhoWeAreSection.backgroundImage && (
            <Card className="relative aspect-[21/9] overflow-hidden mb-2">
              <Image
                src={editingWhoWeAreSection.backgroundImage}
                alt="Who We Are Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </Card>
          )}
          <CloudinaryUploadWidget
            value={editingWhoWeAreSection.backgroundImage || ""}
            onUpload={(url) =>
              setEditingWhoWeAreSection({
                ...editingWhoWeAreSection,
                backgroundImage: url,
              })
            }
            onRemove={() =>
              setEditingWhoWeAreSection({
                ...editingWhoWeAreSection,
                backgroundImage: "",
              })
            }
          />
        </div>

        {/* Header & Description Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Content */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              English Content
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="wwa-en-header">Header</Label>
              <Input
                id="wwa-en-header"
                value={editingWhoWeAreSection.english_header || ""}
                onChange={(e) =>
                  setEditingWhoWeAreSection({
                    ...editingWhoWeAreSection,
                    english_header: e.target.value,
                  })
                }
                placeholder="e.g. Who We Are"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wwa-en-description">Description</Label>
              <Textarea
                id="wwa-en-description"
                value={editingWhoWeAreSection.english_description || ""}
                onChange={(e) =>
                  setEditingWhoWeAreSection({
                    ...editingWhoWeAreSection,
                    english_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="Brief description about who we are..."
              />
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4 border p-4 rounded-lg" dir="rtl">
            <h4 className="font-medium text-sm text-muted-foreground mb-2 text-right">
              المحتوى العربي
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="wwa-ar-header">العنوان</Label>
              <Input
                id="wwa-ar-header"
                value={editingWhoWeAreSection.arabic_header || ""}
                onChange={(e) =>
                  setEditingWhoWeAreSection({
                    ...editingWhoWeAreSection,
                    arabic_header: e.target.value,
                  })
                }
                placeholder="مثال: من نحن"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wwa-ar-description">الوصف</Label>
              <Textarea
                id="wwa-ar-description"
                value={editingWhoWeAreSection.arabic_description || ""}
                onChange={(e) =>
                  setEditingWhoWeAreSection({
                    ...editingWhoWeAreSection,
                    arabic_description: e.target.value,
                  })
                }
                className="min-h-[100px]"
                placeholder="وصف مختصر عن من نحن..."
              />
            </div>
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold">Content Items</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddContentItem}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>

          {editingWhoWeAreContents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No content items yet. Click &quot;Add Item&quot; to create one.
            </p>
          )}

          {editingWhoWeAreContents.map((item, index) => (
            <Card key={item.id || `new-${index}`} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveContentItem(index)}
                  className="gap-1"
                  aria-label={`Remove content item ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </div>

              {/* Icon Selector */}
              <div className="grid gap-2">
                <Label>Icon</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={item.icon}
                  onChange={(e) =>
                    handleUpdateContentItem(index, "icon", e.target.value)
                  }
                  aria-label="Select icon"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* English */}
                <div className="space-y-3 border p-3 rounded-lg">
                  <h6 className="text-xs font-medium text-muted-foreground">
                    English
                  </h6>
                  <div className="grid gap-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={item.english_title}
                      onChange={(e) =>
                        handleUpdateContentItem(
                          index,
                          "english_title",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Certified Quality"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Subtitle</Label>
                    <Textarea
                      value={item.english_subtitle}
                      onChange={(e) =>
                        handleUpdateContentItem(
                          index,
                          "english_subtitle",
                          e.target.value,
                        )
                      }
                      className="min-h-[60px]"
                      placeholder="Short description..."
                    />
                  </div>
                </div>

                {/* Arabic */}
                <div className="space-y-3 border p-3 rounded-lg" dir="rtl">
                  <h6 className="text-xs font-medium text-muted-foreground">
                    العربية
                  </h6>
                  <div className="grid gap-1">
                    <Label className="text-xs">العنوان</Label>
                    <Input
                      value={item.arabic_title}
                      onChange={(e) =>
                        handleUpdateContentItem(
                          index,
                          "arabic_title",
                          e.target.value,
                        )
                      }
                      placeholder="مثال: جودة معتمدة"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">الوصف الفرعي</Label>
                    <Textarea
                      value={item.arabic_subtitle}
                      onChange={(e) =>
                        handleUpdateContentItem(
                          index,
                          "arabic_subtitle",
                          e.target.value,
                        )
                      }
                      className="min-h-[60px]"
                      placeholder="وصف مختصر..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ==================== Gallery Section ==================== */}
      <Separator className="my-6" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Gallery Section</h3>
            <p className="text-sm text-muted-foreground">
              Configure the homepage gallery section header, description, and
              select images to display.
            </p>
          </div>
          <Button
            onClick={handleSaveGallerySection}
            disabled={gallerySectionLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {gallerySectionLoading ? "Saving..." : "Save Gallery Section"}
          </Button>
        </div>

        {/* Header & Description */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>English Header</Label>
            <Input
              value={editingGallerySection.english_header || ""}
              onChange={(e) =>
                setEditingGallerySection({
                  ...editingGallerySection,
                  english_header: e.target.value,
                })
              }
              placeholder="Our Gallery"
            />
          </div>
          <div className="grid gap-2">
            <Label>Arabic Header</Label>
            <Input
              dir="rtl"
              value={editingGallerySection.arabic_header || ""}
              onChange={(e) =>
                setEditingGallerySection({
                  ...editingGallerySection,
                  arabic_header: e.target.value,
                })
              }
              placeholder="معرض الصور"
            />
          </div>
          <div className="grid gap-2">
            <Label>English Description</Label>
            <Textarea
              value={editingGallerySection.english_description || ""}
              onChange={(e) =>
                setEditingGallerySection({
                  ...editingGallerySection,
                  english_description: e.target.value,
                })
              }
              placeholder="Take a look at our facilities..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Arabic Description</Label>
            <Textarea
              dir="rtl"
              value={editingGallerySection.arabic_description || ""}
              onChange={(e) =>
                setEditingGallerySection({
                  ...editingGallerySection,
                  arabic_description: e.target.value,
                })
              }
              placeholder="ألقِ نظرة على مرافقنا..."
            />
          </div>
        </div>

        {/* Image Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Select Images to Display ({selectedImageIds.length} selected)
          </Label>
          {allGalleryImages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No gallery images found. Go to{" "}
                <a
                  href="/dashboard/gallery-images"
                  className="text-primary underline"
                >
                  Gallery Images
                </a>{" "}
                to upload some.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {allGalleryImages.map((image) => {
                const isSelected = selectedImageIds.includes(image.id);
                return (
                  <div
                    key={image.id}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={isSelected}
                    aria-label={`Select image ${image.alt || image.id}`}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    onClick={() => handleToggleGalleryImage(image.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleGalleryImage(image.id);
                      }
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Separator className="my-8" />

      {/* Statistics Section */}
      <StatisticsSectionForm
        key={statisticsSection?.id ?? "new"}
        initialData={statisticsSection}
      />

      <div className="h-10" />
    </div>
  );
}
