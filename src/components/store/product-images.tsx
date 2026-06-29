"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string; // video thumbnail
}

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
  videos?: { src: string; poster?: string }[];
  title: string;
}

export const ProductImageGallery = ({
  mainImage,
  images = [],
  videos = [],
  title,
}: ProductImageGalleryProps) => {
  // Build media list: main image first, then additional images, then videos
  const mediaItems: MediaItem[] = [
    { type: "image", src: mainImage },
    ...images
      .filter((img) => img !== mainImage)
      .map((src): MediaItem => ({ type: "image", src })),
    ...videos.map(
      (v): MediaItem => ({ type: "video", src: v.src, poster: v.poster }),
    ),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = mediaItems[activeIndex];

  return (
    <div className="w-full min-w-0 flex flex-col gap-3">
      {/* Main Display */}
      <div className="w-full rounded-2xl border-2 border-primary/20 bg-muted/30 p-3 overflow-hidden">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden">
          {activeMedia.type === "video" ? (
            <video
              src={activeMedia.src}
              poster={activeMedia.poster}
              controls
              className="w-full h-full object-contain rounded-xl"
              aria-label={`${title} video`}
            />
          ) : (
            <Image
              src={activeMedia.src}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          )}
        </div>
      </div>

      {/* Thumbnails Row — horizontal scrollable strip */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full pb-1">
          {mediaItems.map((media, index) => (
            <button
              key={index}
              type="button"
              tabIndex={0}
              aria-label={`${media.type === "video" ? "Video" : "Image"} ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative w-[64px] h-[64px] rounded-lg overflow-hidden shrink-0 transition-all border-2",
                activeIndex === index
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-primary/40",
              )}
            >
              {media.type === "video" ? (
                <>
                  {media.poster ? (
                    <Image
                      src={media.poster}
                      alt={`${title} video ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </>
              ) : (
                <Image
                  src={media.src}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
