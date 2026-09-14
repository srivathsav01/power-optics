/**
 * Store details used across the site (header, footer, contact, SEO schema).
 * Everything marked PLACEHOLDER must be replaced with real details before launch.
 */
export const site = {
  name: "Power Eyes Opticals",
  shortName: "Power Eyes",
  tagline: "Eye care & eyewear, done with precision.",
  description:
    "Power Eyes Opticals — computerised eye tests, prescription glasses, sunglasses and contact lenses. Explore our frames in 3D, then try them on in store.",
  url: "https://www.powereyesopticals.in", // PLACEHOLDER domain
  foundedYear: 2005, // PLACEHOLDER
  phone: "+91 98765 43210", // PLACEHOLDER
  phoneE164: "+919876543210", // PLACEHOLDER
  whatsapp: "919876543210", // PLACEHOLDER — digits only, with country code
  email: "hello@powereyesopticals.in", // PLACEHOLDER
  address: {
    street: "12, MG Road, Near City Centre", // PLACEHOLDER
    locality: "Indiranagar", // PLACEHOLDER
    city: "Bengaluru", // PLACEHOLDER
    state: "Karnataka", // PLACEHOLDER
    postalCode: "560038", // PLACEHOLDER
    country: "IN",
  },
  geo: { lat: 12.9716, lng: 77.6412 }, // PLACEHOLDER
  mapsUrl: "https://maps.google.com/?q=12.9716,77.6412", // PLACEHOLDER — use your Google Business link
  /** Google Maps embed (no API key needed). Swap for the embed link from your Google Business profile. */
  mapEmbedUrl: "https://www.google.com/maps?q=12.9716,77.6412&z=16&output=embed", // PLACEHOLDER
  landmark: "Opposite City Centre Mall, next to State Bank ATM", // PLACEHOLDER
  parking: "Two-wheeler parking in front; car parking in the mall basement.", // PLACEHOLDER
  hours: [
    { days: "Mon – Sat", opens: "10:00", closes: "21:00" },
    { days: "Sunday", opens: "11:00", closes: "19:00" },
  ], // PLACEHOLDER
  /** schema.org openingHoursSpecification — keep in sync with `hours` */
  hoursSchema: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:00",
    },
    { dayOfWeek: ["Sunday"], opens: "11:00", closes: "19:00" },
  ],
  optician: {
    name: "Dr. A. Kumar", // PLACEHOLDER
    credentials: "B.Optom, Registered Optometrist", // PLACEHOLDER
    registration: "Reg. No. XX-OPT-00000", // PLACEHOLDER
    experienceYears: 18, // PLACEHOLDER
  },
  stats: {
    customers: "25,000+", // PLACEHOLDER
    googleRating: 4.8, // PLACEHOLDER
    googleReviewCount: 640, // PLACEHOLDER
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
