export type SeoTopic = {
  key: string;
  titleHint: string;
  primaryKeyword: string;
  relatedServiceSlugs: Array<
    "house-wash" | "driveway" | "roof" | "deck" | "gutter" | "commercial"
  >;
};

export const SEO_TOPICS: SeoTopic[] = [
  {
    key: "pressure-washing-prep",
    titleHint: "How to Prepare for Pressure Washing (North Metro Atlanta)",
    primaryKeyword: "how to prepare for pressure washing",
    relatedServiceSlugs: ["house-wash", "driveway"]
  },
  {
    key: "soft-wash-vs-pressure-wash",
    titleHint: "Soft Wash vs Pressure Wash: What’s Best for Your Home?",
    primaryKeyword: "soft wash vs pressure wash",
    relatedServiceSlugs: ["house-wash", "roof"]
  },
  {
    key: "driveway-cleaning-tips",
    titleHint: "Driveway Cleaning Tips: Get Better Results Without Damage",
    primaryKeyword: "driveway cleaning tips",
    relatedServiceSlugs: ["driveway"]
  },
  {
    key: "roof-soft-wash-guide",
    titleHint: "Roof Soft Washing: What to Know Before You Schedule",
    primaryKeyword: "roof soft wash",
    relatedServiceSlugs: ["roof"]
  },
  {
    key: "deck-patio-cleaning",
    titleHint: "Deck and Patio Cleaning: A Simple Maintenance Plan",
    primaryKeyword: "deck and patio cleaning",
    relatedServiceSlugs: ["deck"]
  },
  {
    key: "gutter-cleaning-basics",
    titleHint: "Gutter Cleaning Basics: When to Clear and Flush",
    primaryKeyword: "gutter cleaning",
    relatedServiceSlugs: ["gutter"]
  },
  {
    key: "commercial-pressure-washing",
    titleHint: "Commercial Pressure Washing: What Property Managers Should Expect",
    primaryKeyword: "commercial pressure washing",
    relatedServiceSlugs: ["commercial"]
  }
];

