"use client";

import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface CloudinaryResult {
  info: {
    secure_url: string;
    [key: string]: unknown;
  };
  event: string;
}

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  value: string;
  disabled?: boolean;
}

export default function CloudinaryUploadWidget({
  onUpload,
  onRemove,
  value,
  disabled,
}: CloudinaryUploadWidgetProps) {
  // Use a ref so the Cloudinary widget always calls the latest onUpload,
  // even if the widget caches the onSuccess callback from mount time.
  const onUploadRef = useRef(onUpload);

  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  const onUploadSuccess = useCallback((result: unknown) => {
    const widgetResult = result as CloudinaryResult;
    if (
      widgetResult &&
      widgetResult.info &&
      typeof widgetResult.info === "object" &&
      "secure_url" in widgetResult.info
    ) {
      const url = (widgetResult.info as { secure_url: string }).secure_url;
      const optimizedUrl = url.replace("/upload/", "/upload/f_auto,q_auto/");
      onUploadRef.current(optimizedUrl);
    }
  }, []);

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          console.log("Cloudinary Upload Success:", result);
          onUploadSuccess(result);
        }}
        options={{
          maxFiles: 1,
          maxFileSize: 2000000, // 2MB limit
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
        {({ open }) => {
          return (
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
                  onClick={() => !disabled && open()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && !disabled && open()}
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
                  onClick={() => !disabled && open()}
                  disabled={disabled}
                  className="flex flex-col items-center justify-center gap-2 h-full w-full cursor-pointer hover:opacity-70 transition bg-transparent border-0 outline-none"
                >
                  <ImagePlus className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload an Image</p>
                  <span className="text-xs text-muted-foreground">
                    Max size: 2MB. Auto-cropped to 16:9.
                  </span>
                </button>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
