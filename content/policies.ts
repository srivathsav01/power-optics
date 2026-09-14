/** Short policy lines shown in the footer and on frame details. PLACEHOLDER terms. */
export const policyHighlights = [
  { title: "7-day exchange", detail: "Exchange frames within 7 days of delivery, unused and with invoice." },
  { title: "1-year warranty", detail: "Covers manufacturing defects on frames and lens coatings." },
  { title: "Free adjustments", detail: "Nose-pad, temple and fit adjustments free for life." },
] as const;

export type Policy = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

/**
 * Full policy pages at /policies/[slug]. PLACEHOLDER wording — have it reviewed
 * before launch so it matches how the store actually works.
 */
export const policies: Policy[] = [
  {
    slug: "returns",
    title: "Returns & exchange",
    updated: "2026-09-14",
    intro: "We want you to love your glasses. If something isn't right, here's how we'll make it right.",
    sections: [
      {
        heading: "Frame exchange within 7 days",
        body: [
          "You can exchange a frame within 7 days of delivery for any other frame of equal or higher value (you pay the difference).",
          "The frame must be unused, undamaged and returned with the original invoice and case.",
        ],
      },
      {
        heading: "Lenses",
        body: [
          "Prescription lenses are made specifically for you, so they can't be returned or exchanged.",
          "If you have trouble adapting to new lenses — especially progressives — come back within 15 days. We'll re-check your prescription and fitting, and remake the lenses free if the issue is on our side.",
        ],
      },
      {
        heading: "Not eligible",
        body: [
          "Contact lenses and solutions once opened, frames damaged after delivery, and items bought on clearance.",
        ],
      },
      {
        heading: "Refunds",
        body: ["We offer exchanges or store credit rather than cash refunds, except where a product is defective."],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty",
    updated: "2026-09-14",
    intro: "Every frame and lens we sell is covered against manufacturing defects.",
    sections: [
      {
        heading: "What's covered — 1 year",
        body: [
          "Frames: breakage at joints or hinges, peeling of plating or paint under normal use.",
          "Lenses: peeling or crazing of anti-glare, blue-light and hard coatings.",
        ],
      },
      {
        heading: "What isn't covered",
        body: [
          "Scratches, accidental damage, damage from heat (for example leaving glasses in a hot car), and repairs done elsewhere.",
        ],
      },
      {
        heading: "How to claim",
        body: [
          "Bring the glasses and your invoice to the store. We'll inspect them and repair or replace eligible items, usually within 3–7 days.",
        ],
      },
      {
        heading: "Free for life",
        body: ["Fit adjustments, screw tightening and cleaning are always free."],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-09-14",
    intro: "This website is designed to collect as little about you as possible.",
    sections: [
      {
        heading: "What this website stores",
        body: [
          "Nothing on our servers. Frames you save with the heart button are kept only in your own browser (local storage) and never sent to us.",
          "The booking form doesn't save your details. It prepares a WhatsApp message that you choose to send.",
        ],
      },
      {
        heading: "When you message us",
        body: [
          "If you contact us on WhatsApp or by phone, we use your name, number and any details you share only to respond, book your appointment and keep you updated on your order.",
          "WhatsApp messages are also subject to WhatsApp's own privacy policy.",
        ],
      },
      {
        heading: "Eye health records",
        body: [
          "Prescriptions and test results recorded in store are kept confidentially and used only for your eye care. We never sell or share them for marketing.",
          "In line with India's Digital Personal Data Protection Act, 2023, you can ask us to view, correct or delete your records.",
        ],
      },
      {
        heading: "Maps",
        body: ["Our contact page shows an embedded Google Map, which may set Google cookies when it loads."],
      },
      {
        heading: "Contact",
        body: ["For any privacy request, message us on WhatsApp or email the address in the footer."],
      },
    ],
  },
];
