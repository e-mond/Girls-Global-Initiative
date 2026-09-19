import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminGalleryPage() {
  return (
    <ContentEntityManager
      entity="gallery_items"
      title="Gallery"
      description="Community / Where we work gallery items."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "location", label: "Location" },
        { name: "badge", label: "Badge text" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ caption: "", sortOrder: 0 }}
    />
  );
}
