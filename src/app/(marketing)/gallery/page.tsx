import { getGalleryImages } from "@/actions/gallery-actions";
import {
  getGalleryPage,
  getGalleryCategories,
} from "@/actions/gallery-page-actions";
import { GalleryClientPage } from "./gallery-client-page";

export default async function GalleryPage() {
  const [galleryRes, pageRes, categoriesRes] = await Promise.all([
    getGalleryImages(),
    getGalleryPage(),
    getGalleryCategories(),
  ]);

  const images = galleryRes.success && galleryRes.data ? galleryRes.data : [];
  const pageDetails = pageRes.success && pageRes.data ? pageRes.data : null;
  const categories =
    categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

  return (
    <GalleryClientPage
      initialImages={images as any}
      pageDetails={pageDetails}
      categories={categories as any}
    />
  );
}
