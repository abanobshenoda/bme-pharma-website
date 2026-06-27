"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2, Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";

import {
  getGalleryPage,
  createGalleryPage,
  updateGalleryPage,
  getGalleryCategories,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
} from "@/actions/gallery-page-actions";

import type { GalleryPage, GalleryCategory } from "@/generated/prisma/client";

export default function GalleryContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState<GalleryPage | null>(null);
  const [categories, setCategories] = useState<
    (GalleryCategory & { _count: { images: number } })[]
  >([]);
  const [isPageSaving, setIsPageSaving] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);

  // Form states for Page Header
  const [pageForm, setPageForm] = useState({
    arabic_header: "",
    english_header: "",
    arabic_description: "",
    english_description: "",
  });

  // Form states for Category
  const [categoryForm, setCategoryForm] = useState({
    id: null as number | null,
    arabic_name: "",
    english_name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [pageRes, categoriesRes] = await Promise.all([
        getGalleryPage(),
        getGalleryCategories(),
      ]);

      if (pageRes.success && pageRes.data) {
        setPageData(pageRes.data);
        setPageForm({
          arabic_header: pageRes.data.arabic_header || "",
          english_header: pageRes.data.english_header || "",
          arabic_description: pageRes.data.arabic_description || "",
          english_description: pageRes.data.english_description || "",
        });
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data as any);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSavePage = async () => {
    setIsPageSaving(true);
    const res = pageData
      ? await updateGalleryPage(pageData.id, pageForm)
      : await createGalleryPage(pageForm);

    if (res.success) {
      setPageData(res.data || null);
      toast.success("Gallery page details saved");
    } else {
      toast.error("Failed to save gallery page details");
    }
    setIsPageSaving(false);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.arabic_name || !categoryForm.english_name) {
      toast.error("Please fill in both Arabic and English names");
      return;
    }

    setIsCategorySaving(true);
    const res = categoryForm.id
      ? await updateGalleryCategory(categoryForm.id, {
          arabic_name: categoryForm.arabic_name,
          english_name: categoryForm.english_name,
        })
      : await createGalleryCategory({
          arabic_name: categoryForm.arabic_name,
          english_name: categoryForm.english_name,
        });

    if (res.success) {
      toast.success(categoryForm.id ? "Category updated" : "Category created");
      setCategoryForm({ id: null, arabic_name: "", english_name: "" });
      // Refresh categories
      const categoriesRes = await getGalleryCategories();
      if (categoriesRes.success) setCategories(categoriesRes.data as any);
    } else {
      toast.error("Failed to save category");
    }
    setIsCategorySaving(false);
  };

  const handleEditCategory = (cat: any) => {
    setCategoryForm({
      id: cat.id,
      arabic_name: cat.arabic_name,
      english_name: cat.english_name,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Images assigned to it will become uncategorized.",
      )
    )
      return;

    const res = await deleteGalleryCategory(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } else {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Gallery Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your gallery page header, description, and categories.
        </p>
      </div>
      <Separator />

      {/* 1. Gallery Page Header Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Page Header & Description</CardTitle>
          <Button onClick={handleSavePage} disabled={isPageSaving} size="sm">
            {isPageSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Header (English)</Label>
              <Input
                value={pageForm.english_header}
                onChange={(e) =>
                  setPageForm({ ...pageForm, english_header: e.target.value })
                }
                placeholder="Media Gallery"
              />
            </div>
            <div className="space-y-2 text-right">
              <Label>العنوان (عربي)</Label>
              <Input
                value={pageForm.arabic_header}
                onChange={(e) =>
                  setPageForm({ ...pageForm, arabic_header: e.target.value })
                }
                dir="rtl"
                placeholder="معرض الصور"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Description (English)</Label>
              <Textarea
                value={pageForm.english_description}
                onChange={(e) =>
                  setPageForm({
                    ...pageForm,
                    english_description: e.target.value,
                  })
                }
                placeholder="Explore our moments..."
                rows={3}
              />
            </div>
            <div className="space-y-2 text-right">
              <Label>الوصف (عربي)</Label>
              <Textarea
                value={pageForm.arabic_description}
                onChange={(e) =>
                  setPageForm({
                    ...pageForm,
                    arabic_description: e.target.value,
                  })
                }
                dir="rtl"
                placeholder="استكشف لحظاتنا..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Category Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>
              {categoryForm.id ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name (English)</Label>
              <Input
                value={categoryForm.english_name}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    english_name: e.target.value,
                  })
                }
                placeholder="Events, Facilities, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>العنوان (عربي)</Label>
              <Input
                value={categoryForm.arabic_name}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    arabic_name: e.target.value,
                  })
                }
                dir="rtl"
                placeholder="الفعاليات، المرافق، إلخ."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveCategory}
                disabled={isCategorySaving}
                className="w-full"
              >
                {isCategorySaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : categoryForm.id ? (
                  <Edit2 className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {categoryForm.id ? "Update" : "Add"}
              </Button>
              {categoryForm.id && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCategoryForm({
                      id: null,
                      arabic_name: "",
                      english_name: "",
                    })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No categories found.
              </p>
            ) : (
              <div className="divide-y">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="py-4 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-medium">
                        {category.english_name} / {category.arabic_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {category._count.images} images assigned
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
