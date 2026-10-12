export const MEDIA_FOLDERS = [
  { value: "ggi", label: "General" },
  { value: "ggi/team", label: "Team" },
  { value: "ggi/gallery", label: "Gallery" },
  { value: "ggi/news", label: "News" },
  { value: "ggi/events", label: "Events" },
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number]["value"];

export function normalizeMediaFolder(
  raw: string | null | undefined,
): MediaFolder {
  const value = (raw ?? "").trim();
  const match = MEDIA_FOLDERS.find((folder) => folder.value === value);
  return match?.value ?? "ggi";
}
