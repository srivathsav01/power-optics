/**
 * PLACEHOLDER reviews. Replace with real customer reviews (ideally copied from your
 * Google Business profile with permission).
 */
export type Review = { name: string; area: string; rating: number; text: string; date: string };

export const reviews: Review[] = [
  {
    name: "Priya S.",
    area: "Indiranagar",
    rating: 5,
    text: "The eye test was the most thorough I've had. They explained my prescription clearly and helped me pick frames that actually suit my face.",
    date: "2026-07-12",
  },
  {
    name: "Rahul M.",
    area: "Koramangala",
    rating: 5,
    text: "Got progressive lenses here after two bad experiences elsewhere. Zero adjustment headache. Staff are patient and honest about options.",
    date: "2026-06-28",
  },
  {
    name: "Ananya R.",
    area: "HSR Layout",
    rating: 4,
    text: "Great collection for kids. My son broke his frame and they repaired it the same day without charging anything.",
    date: "2026-05-03",
  },
  {
    name: "Mohammed A.",
    area: "Whitefield",
    rating: 5,
    text: "Fair pricing, no pushy upselling. Blue-light lenses were ready in two days and they called on WhatsApp when it was done.",
    date: "2026-04-19",
  },
];
