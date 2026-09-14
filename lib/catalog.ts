import { frames } from "@/content/frames";
import type { Frame } from "@/types/frame";

/**
 * Single data-access point for the catalog. Pages never import content/frames directly,
 * so moving to a CMS or database later only changes this file.
 */
export async function getFrames(): Promise<Frame[]> {
  return frames;
}

export async function getFeaturedFrames(): Promise<Frame[]> {
  return frames.filter((f) => f.featured);
}

export async function getFrame(slug: string): Promise<Frame | undefined> {
  return frames.find((f) => f.slug === slug);
}
