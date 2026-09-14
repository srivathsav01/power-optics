/**
 * Services, lens options and FAQs. Prices and durations are PLACEHOLDERS.
 */
export type Service = {
  slug: string;
  title: string;
  /** Short label for the booking form */
  shortTitle: string;
  icon: "eye" | "contact-lens" | "prescription" | "lenses" | "insurance" | "repairs";
  summary: string;
  points: string[];
  duration?: string;
  price?: string;
  bookable: boolean;
};

export const services: Service[] = [
  {
    slug: "eye-exam",
    title: "Comprehensive eye test",
    shortTitle: "Eye test",
    icon: "eye",
    summary: "A thorough check of your vision by a registered optometrist — not just a quick computer reading.",
    points: [
      "Computerised auto-refraction plus manual subjective testing",
      "Near vision, binocular balance and eye-muscle checks",
      "Children's eye tests from age 4",
      "Referral to an ophthalmologist if we spot anything medical",
    ],
    duration: "20–30 min",
    price: "₹200 · free with any spectacle purchase",
    bookable: true,
  },
  {
    slug: "contact-lens-fitting",
    title: "Contact lens fitting",
    shortTitle: "Contact lenses",
    icon: "contact-lens",
    summary: "Find lenses that are comfortable all day, with a trial pair and hands-on training.",
    points: [
      "Daily, monthly, toric (for cylinder power) and coloured lenses",
      "Trial lenses before you buy",
      "Insertion, removal and lens-care training",
      "Follow-up check included",
    ],
    duration: "30–40 min",
    price: "₹300 · adjusted against lens purchase",
    bookable: true,
  },
  {
    slug: "prescription-update",
    title: "Prescription update & lens replacement",
    shortTitle: "Prescription check",
    icon: "prescription",
    summary: "Vision changed? Keep the frame you love and just replace the lenses.",
    points: [
      "Quick re-check of your existing power",
      "New lenses fitted into your current frame",
      "We can also read a prescription from your eye doctor",
    ],
    duration: "15 min",
    price: "Free check",
    bookable: true,
  },
  {
    slug: "lenses",
    title: "Lenses for every need",
    shortTitle: "Lenses",
    icon: "lenses",
    summary: "From simple single-vision to premium progressives, cut and fitted in-house.",
    points: [
      "Single vision, bifocal and progressive",
      "Blue-light filter and anti-glare coatings",
      "Photochromic (turns dark in sunlight) and polarised sun lenses",
      "Most lenses ready in 24–72 hours",
    ],
    bookable: false,
  },
  {
    slug: "insurance",
    title: "Insurance & reimbursement",
    shortTitle: "Insurance",
    icon: "insurance",
    summary: "We give you everything you need to claim spectacles through your employer or health policy.",
    points: [
      "Itemised GST invoice with frame and lens break-up",
      "Signed prescription from our optometrist",
      "Help with corporate reimbursement forms",
      "Cashless billing isn't available yet — ask us about current tie-ups",
    ],
    bookable: false,
  },
  {
    slug: "repairs",
    title: "Repairs & adjustments",
    shortTitle: "Repairs",
    icon: "repairs",
    summary: "Glasses sliding down, a loose screw or a broken nose pad? Walk in — most fixes take minutes.",
    points: [
      "Free fit adjustments for life, even if you bought elsewhere",
      "Screw, nose-pad and temple-tip replacement",
      "Frame soldering and major repairs in 3–5 days",
      "Ultrasonic cleaning while you wait",
    ],
    duration: "Walk in",
    bookable: false,
  },
];

export const lensOptions = [
  { name: "Single vision", bestFor: "Distance or reading only", from: "₹800" },
  { name: "Blue-light filter", bestFor: "Long hours on screens", from: "₹1,500" },
  { name: "Progressive", bestFor: "Distance + reading in one lens (40+)", from: "₹4,500" },
  { name: "Photochromic", bestFor: "Indoor/outdoor — darkens in sunlight", from: "₹2,500" },
  { name: "Sunglass tint / polarised", bestFor: "Driving, outdoors, glare", from: "₹1,800" },
] as const; // PLACEHOLDER prices

export const faqs = [
  {
    q: "Do I need an appointment for an eye test?",
    a: "Walk-ins are welcome, but booking a slot means no waiting — especially on weekends.",
  },
  {
    q: "How long do new glasses take?",
    a: "Most single-vision lenses are ready in 24 hours. Progressives and special powers take 2–4 days. We'll message you on WhatsApp when they're ready.",
  },
  {
    q: "Can I bring my own frame?",
    a: "Yes. We'll check the frame's condition and fit new lenses into it.",
  },
  {
    q: "Can you make glasses from my eye doctor's prescription?",
    a: "Absolutely. Bring the prescription (a photo on your phone is fine) and we'll take care of the rest.",
  },
  {
    q: "What should I bring to my eye test?",
    a: "Your current glasses or contact lenses, any old prescription, and a list of medicines you take regularly.",
  },
];
