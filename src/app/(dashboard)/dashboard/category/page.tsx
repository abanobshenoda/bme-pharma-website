"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/category-actions";
import { toast } from "sonner";
import { Category } from "@/generated/prisma/client";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

type CategoryWithProducts = Category & {
  products: any[];
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Partial<Category> | null>(null);
  const [formData, setFormData] = useState({
    english_name: "",
    arabic_name: "",
    image: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.success && response.data) {
      setCategories(response.data as CategoryWithProducts[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      const response = await getCategories();
      if (!isMounted) return;
      if (response.success && response.data) {
        setCategories(response.data as CategoryWithProducts[]);
      }
      setIsLoading(false);
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        english_name: category.english_name || "",
        arabic_name: category.arabic_name || "",
        image: category.image,
      });
    } else {
      setEditingCategory(null);
      setFormData({ english_name: "", arabic_name: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ english_name: "", arabic_name: "", image: "" });
  };

  const handleSave = async () => {
    if (!formData.english_name.trim() && !formData.arabic_name.trim()) {
      toast.error("At least one category name is required");
      return;
    }

    setIsSaving(true);

    let response;
    if (editingCategory?.id) {
      response = await updateCategory(editingCategory.id, formData);
    } else {
      response = await createCategory(formData);
    }

    setIsSaving(false);

    if (response.success) {
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully",
      );
      handleCloseDialog();
      fetchCategories();
    } else {
      toast.error(response.error || "Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    const response = await deleteCategory(id);
    if (response.success) {
      toast.success("Category deleted successfully");
      fetchCategories();
    } else {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories for your store.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          modal={false}
        >
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            onInteractOutside={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category details below."
                  : "Fill in the details to create a new category."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* English Name */}
              <div className="grid gap-2">
                <Label htmlFor="english_name">English Name</Label>
                <Input
                  id="english_name"
                  value={formData.english_name}
                  onChange={(e) =>
                    setFormData({ ...formData, english_name: e.target.value })
                  }
                  placeholder="Category name in English"
                />
              </div>
              {/* Arabic Name */}
              <div className="grid gap-2">
                <Label htmlFor="arabic_name">
                  Arabic Name / الاسم بالعربية
                </Label>
                <Input
                  id="arabic_name"
                  dir="rtl"
                  value={formData.arabic_name}
                  onChange={(e) =>
                    setFormData({ ...formData, arabic_name: e.target.value })
                  }
                  placeholder="اسم الفئة بالعربية"
                />
              </div>
              {/* Image Upload */}
              <div className="grid gap-2">
                <Label>Image</Label>
                <CloudinaryUploadWidget
                  value={formData.image}
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                  onRemove={() => setFormData({ ...formData, image: "" })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No categories yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first category.
          </p>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden group">
              <div className="relative aspect-video">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={
                      category.english_name ||
                      category.arabic_name ||
                      "Category"
                    }
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleOpenDialog(category)}
                      aria-label="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          aria-label="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            {category.english_name || category.arabic_name}
                            &quot;? This action cannot be undone and will also
                            delete all products in this category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">
                  {category.english_name || category.arabic_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.products.length} product
                  {category.products.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
