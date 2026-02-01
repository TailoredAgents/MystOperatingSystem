export type LeadServiceOption = {
  slug: string;
  title: string;
  description?: string;
};

export const DEFAULT_LEAD_SERVICE_OPTIONS: LeadServiceOption[] = [
  { slug: "house-wash", title: "Whole Home Soft-Wash", description: "Siding, brick, and trim — surface-safe cleaning" },
  { slug: "driveway", title: "Driveway Cleaning", description: "Concrete and pavers cleaned and brightened" },
  { slug: "surface-cleaning", title: "Surface Cleaning", description: "Patios, sidewalks, and pool decks — deep clean concrete" },
  { slug: "roof", title: "Roof Soft-Wash", description: "Algae and streaking treated with low-pressure methods" },
  { slug: "deck", title: "Deck & Patio Restore", description: "Patios, porches, and decks cleaned carefully" },
  { slug: "gutter", title: "Gutter Clear & Flush", description: "Hand-clear gutters and flush downspouts" },
  { slug: "fence-wash", title: "Fence Washing", description: "Gentle wash for vinyl and treated wood fences" },
  { slug: "window-cleaning", title: "Exterior Window Cleaning", description: "Exterior glass cleaning for accessible windows" },
  { slug: "commercial", title: "Commercial Exterior", description: "Storefronts and shared spaces — custom quotes" }
];
