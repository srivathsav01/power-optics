import { FeaturedFrames } from "@/components/home/FeaturedFrames";
import { LensHero } from "@/components/home/LensHero";
import { TrustAndReviews } from "@/components/home/TrustAndReviews";
import { ValueProps } from "@/components/home/ValueProps";
import { VisitStore } from "@/components/home/VisitStore";
import { getFeaturedFrames, getFrames } from "@/lib/catalog";

export default async function Home() {
  const [featured, all] = await Promise.all([getFeaturedFrames(), getFrames()]);

  return (
    <>
      <LensHero />
      <ValueProps />
      <FeaturedFrames featured={featured} all={all} />
      <TrustAndReviews />
      <VisitStore />
    </>
  );
}
