import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShopExperience, ShopFromParams } from "@/components/shop/ShopExperience";
import { getFrames } from "@/lib/catalog";
import { frameListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frames in 360° — Eyeglasses & Sunglasses",
  description:
    "Explore our eyeglasses and sunglasses in 3D. Filter by shape, material, gender, brand and price, then try them on in store.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const frames = await getFrames();

  return (
    <>
      <JsonLd data={frameListSchema(frames)} />
      {/* The fallback is fully rendered HTML (all frames), so the page is static and crawlable;
          URL filters apply as soon as the client takes over. */}
      <Suspense fallback={<ShopExperience frames={frames} initialQuery="" />}>
        <ShopFromParams frames={frames} />
      </Suspense>
    </>
  );
}
