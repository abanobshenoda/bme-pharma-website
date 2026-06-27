"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ImagePlus,
  Trash,
  Search,
  Check,
  Loader2,
  Images,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

interface CloudinaryResult {
  info: {
    secure_url: string;
    [key: string]: unknown;
  };
  event: string;
}

interface CloudinaryMediaPickerProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  value: string;
  disabled?: boolean;
}

export default function CloudinaryMediaPicker({
  onUpload,
  onRemove,
  value,
  disabled,
}: CloudinaryMediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>(
    []
  );
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("library");

  const onUploadRef = useRef(onUpload);
  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  const fetchCloudinaryImages = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const res = await fetch("/api/cloudinary/images");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCloudinaryImages(data.images || []);
      setFilteredImages(data.images || []);
    } catch {
      toast.error("Failed to load Cloudinary library");
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  const handleOpenPicker = () => {
    if (disabled) return;
    setIsOpen(true);
    setActiveTab("library");
    setSearchQuery("");
    setSelectedImage(null);
    fetchCloudinaryImages();
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredImages(cloudinaryImages);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredImages(
        cloudinaryImages.filter((img) =>
          img.public_id.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, cloudinaryImages]);

  const handleSelectFromLibrary = () => {
    if (!selectedImage) return;
    const optimizedUrl = selectedImage.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto/"
    );
    onUploadRef.current(optimizedUrl);
    setIsOpen(false);
    toast.success("Image selected from library");
  };

  const onUploadSuccess = useCallback((result: unknown) => {
    const widgetResult = result as CloudinaryResult;
    if (
      widgetResult?.info &&
      typeof widgetResult.info === "object" &&
      "secure_url" in widgetResult.info
    ) {
      const url = (widgetResult.info as { secure_url: string }).secure_url;
      const optimizedUrl = url.replace("/upload/", "/upload/f_auto,q_auto/");
      onUploadRef.current(optimizedUrl);
      setIsOpen(false);
    }
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* Main Trigger Area */}
      <div className="space-y-4 w-full flex flex-col items-center justify-center">
        <div className="relative border-dashed border-2 p-4 border-gray-300 flex flex-col items-center justify-center gap-4 h-60 w-full rounded-md overflow-hidden bg-muted/30">
          <div className="absolute top-2 right-2 z-10">
            {value && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>

          {value ? (
            <div
              className="relative w-full h-full cursor-pointer hover:opacity-70 transition"
              onClick={handleOpenPicker}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleOpenPicker()}
              aria-label="Change image"
            >
              <Image
                fill
                style={{ objectFit: "cover" }}
                src={value}
                alt="Upload"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition">
                <span className="text-white opacity-0 hover:opacity-100 font-medium">
                  Click to change
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenPicker}
              disabled={disabled}
              className="flex flex-col items-center justify-center gap-2 h-full w-full cursor-pointer hover:opacity-70 transition bg-transparent border-0 outline-none"
            >
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">
                Choose or Upload Image
              </p>
              <span className="text-xs text-muted-foreground">
                Browse your Cloudinary library or upload new
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Media Picker Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              Media Library
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="library" className="gap-2">
                <Images className="h-4 w-4" />
                Cloudinary Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload New
              </TabsTrigger>
            </TabsList>

            {/* Library Tab */}
            <TabsContent
              value="library"
              className="flex-1 flex flex-col overflow-hidden mt-0 px-6 pb-6 pt-4"
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Images Grid */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingImages ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Images className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">
                      {searchQuery
                        ? "No images match your search"
                        : "No images in your Cloudinary library"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredImages.map((img) => {
                      const isSelected =
                        selectedImage?.public_id === img.public_id;
                      return (
                        <button
                          key={img.public_id}
                          type="button"
                          onClick={() =>
                            setSelectedImage(isSelected ? null : img)
                          }
                          className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none group",
                            isSelected
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-transparent hover:border-primary/50"
                          )}
                        >
                          <Image
                            src={img.secure_url}
                            alt={img.public_id}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 20vw"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                          )}
                          {/* Size badge */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-[10px] truncate">
                              {formatBytes(img.bytes)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected image info + action */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {filteredImages.length} image
                  {filteredImages.length !== 1 ? "s" : ""} in library
                  {selectedImage && (
                    <span className="ml-2 text-foreground font-medium">
                      · Selected:{" "}
                      <span className="text-primary">
                        {selectedImage.public_id.split("/").pop()}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSelectFromLibrary}
                    disabled={!selectedImage}
                    size="sm"
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Use Selected Image
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent
              value="upload"
              className="flex-1 flex flex-col items-center justify-center px-6 pb-6 pt-4 mt-0"
            >
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result) => {
                  console.log("Cloudinary Upload Success:", result);
                  onUploadSuccess(result);
                }}
                options={{
                  maxFiles: 1,
                  maxFileSize: 2000000,
                  maxImageWidth: 1920,
                  maxImageHeight: 1080,
                  cropping: true,
                  croppingAspectRatio: 16 / 9,
                  croppingShowDimensions: true,
                  sources: ["local", "url", "camera"],
                }}
                onError={(err) => {
                  console.error("Cloudinary Widget Error:", err);
                  toast.error("Upload Failed. Check console.");
                }}
              >
                {({ open }) => (
                  <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-9 w-9 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Upload a New Image</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Max 2MB · Auto-cropped to 16:9 · Saved to Cloudinary
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => open()}
                      className="gap-2 w-full"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File to Upload
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Tip: Check the Library tab first to avoid uploading
                      duplicate images
                    </p>
                  </div>
                )}
              </CldUploadWidget>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
