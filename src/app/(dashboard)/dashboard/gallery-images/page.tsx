"use client";

import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/actions/gallery-actions";
import { getGalleryCategories } from "@/actions/gallery-page-actions";
import { toast } from "sonner";
import type { GalleryImage, GalleryCategory } from "@/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

export default function GalleryImagesPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAlt, setNewAlt] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<string>("none");

  const loadData = useCallback(async () => {
    const [imagesRes, categoriesRes] = await Promise.all([
      getGalleryImages(),
      getGalleryCategories(),
    ]);

    if (imagesRes.success && imagesRes.data) {
      setImages(imagesRes.data);
    }
    if (categoriesRes.success && categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpload = async (url: string) => {
    const response = await createGalleryImage({
      url,
      alt: newAlt || null,
      categoryId: newCategoryId === "none" ? null : parseInt(newCategoryId),
    });

    if (response.success && response.data) {
      toast.success("Image uploaded successfully");
      setNewAlt("");
      loadData();
    } else {
      toast.error("Failed to upload image");
    }
  };

  const handleDelete = async (id: number) => {
    const response = await deleteGalleryImage(id);
    if (response.success) {
      toast.success("Image deleted successfully");
      setImages(images.filter((img) => img.id !== id));
    } else {
      toast.error("Failed to delete image");
    }
  };

  const handleUpdateCategory = async (id: number, categoryId: string) => {
    const cId = categoryId === "none" ? null : parseInt(categoryId);
    const response = await updateGalleryImage(id, { categoryId: cId });
    if (response.success) {
      toast.success("Category updated");
      setImages(
        images.map((img) =>
          img.id === id ? { ...img, categoryId: cId } : img,
        ),
      );
    } else {
      toast.error("Failed to update category");
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
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Gallery Images</h3>
        <p className="text-sm text-muted-foreground">
          Manage your gallery image library. Categorize images to help with
          filtering on the marketing site.
        </p>
      </div>
      <Separator />

      {/* Upload Section */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Add New Image</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="gallery-category">Category</Label>
            <Select value={newCategoryId} onValueChange={setNewCategoryId}>
              <SelectTrigger id="gallery-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None / Uncategorized</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.english_name} / {cat.arabic_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery-alt">
              Alt Text (optional, for accessibility)
            </Label>
            <Input
              id="gallery-alt"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="e.g. Laboratory Research"
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Upload Image</Label>
            <CloudinaryUploadWidget
              value=""
              onUpload={handleUpload}
              onRemove={() => {}}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Images Grid */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold">All Images ({images.length})</h4>

        {images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No gallery images yet. Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card
                key={image.id}
                className="group relative overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.alt || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p
                      className="text-xs font-medium truncate mb-1"
                      title={image.alt || "No alt text"}
                    >
                      {image.alt || "No alt text"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">
                      Category
                    </Label>
                    <Select
                      value={image.categoryId?.toString() || "none"}
                      onValueChange={(val) =>
                        handleUpdateCategory(image.id, val)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Uncategorized</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.english_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
