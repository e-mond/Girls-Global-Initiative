import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminGalleryPage() {
  return (
    <ContentEntityManager
      entity="gallery_items"
      title="Gallery"
      description="Community gallery items. Upload an image file for each item."
      fields={[
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "e.g. Mentoring circle",
        },
        {
          name: "caption",
          label: "Caption",
          type: "textarea",
          placeholder: "Short caption shown with the image.",
        },
        {
          name: "location",
          label: "Location",
          placeholder: "Community or region",
        },
        {
          name: "imageUrl",
          label: "Image",
          type: "image",
          required: true,
          description: "Required gallery image (JPEG, PNG, WebP or GIF, max 5MB).",
        },
        {
          name: "badge",
          label: "Badge text",
          placeholder: "e.g. Community",
          description: "Optional small label on the gallery card.",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
        },
      ]}
      createDefaults={{ caption: "", sortOrder: 0 }}
    />
  );
}
