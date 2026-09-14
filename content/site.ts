/**
 * Store details used across the site (header, footer, contact, SEO schema).
 * Everything marked PLACEHOLDER must be replaced with real details before launch.
 *
 * Phone, email and WhatsApp come from .env.local (NEXT_PUBLIC_ so client components can read them).
 */
const phone = process.env.NEXT_PUBLIC_PHONE ?? "";

export const site = {
  name: "Power Eyes Opticals",
  shortName: "Power Eyes",
  tagline: "Your Family's Vision Partner",
  description:
    "Power Eyes Opticals — computerised eye tests, prescription glasses, sunglasses and contact lenses. Explore our frames in 3D, then try them on in store.",
  url: "https://power-eye-opticals.vercel.app/", // PLACEHOLDER domain
  foundedYear: 1986, // PLACEHOLDER
  phone,
  phoneE164: phone.replace(/[^\d+]/g, ""),
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""), // digits only, with country code
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  address: {
    street: "2nd Block, PC2/7A 95, Mogappair West Main Road Mogappair West, Ambattur Industrial Estate", // PLACEHOLDER
    locality: "Mogappair", // PLACEHOLDER
    city: "Chennai", // PLACEHOLDER
    state: "Tamil Nadu", // PLACEHOLDER
    postalCode: "600037", // PLACEHOLDER
    country: "IN",
  },
  geo: { lat: 13.0821718, lng: 80.1687016 }, // PLACEHOLDER
  mapsUrl: "https://maps.app.goo.gl/yBJvHXuzUYgtQWQH6", // PLACEHOLDER — use your Google Business link
  /** Google Maps embed (no API key needed). Swap for the embed link from your Google Business profile. */
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1943.1341758567216!2d80.16870156274501!3d13.08217179489568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263006a36a837%3A0x3a91e77fdfb723a1!2sPower%20Eyes%20Opticals!5e0!3m2!1sen!2sin!4v1789394022176!5m2!1sen!2sin", // PLACEHOLDER
  
  landmark: "Opposite McDonald's, next to The Cake Point",
  parking: "Two-wheeler parking in front", // PLACEHOLDER
  hours: [
    { days: "Mon – Sun", opens: "10:00", closes: "21:30" },
  ], // PLACEHOLDER
  /** schema.org openingHoursSpecification — keep in sync with `hours` */
  hoursSchema: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
      opens: "10:00",
      closes: "21:30",
    },
  ],
  // optician: {
  //   name: "Dr. A. Kumar", // PLACEHOLDER
  //   credentials: "B.Optom, Registered Optometrist", // PLACEHOLDER
  //   registration: "Reg. No. XX-OPT-00000", // PLACEHOLDER
  //   experienceYears: 18, // PLACEHOLDER
  // },
  stats: {
    customers: "25,000+", // PLACEHOLDER
    googleRating: 5, // PLACEHOLDER
    // googleReviewCount: 640, // PLACEHOLDER
    framesInStore: "1,200+", // PLACEHOLDER
  },
} as const;

export const yearsInBusiness = () => new Date().getFullYear() - site.foundedYear;

export const fullAddress = () => {
  const a = site.address;
  return `${a.street}, ${a.locality}, ${a.city}, ${a.state} ${a.postalCode}`;
};

export const navLinks = [
  { href: "/shop", label: "Frames" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
