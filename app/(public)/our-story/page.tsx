import type { Metadata } from "next";
import { OurStoryView } from "@/components/our-story/our-story-view";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "How Girls Global Initiative began — from a conversation between two young women to a youth-led organisation advancing the rights, health and potential of girls.",
};

export default function OurStoryPage() {
  return <OurStoryView />;
}
