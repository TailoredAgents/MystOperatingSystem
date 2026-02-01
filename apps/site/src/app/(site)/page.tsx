import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { allAreas, allPages, allServices } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { BeforeAfterSlider, Button, Card, Section, Stat, Testimonials } from "@myst-os/ui";
import { HeroV2 } from "@/components/HeroV2";
import { LeadForm } from "@/components/LeadForm";
import { MdxContent } from "@/components/MdxContent";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { getPublicCompanyProfile } from "@/lib/company";
import { createPageMetadata } from "@/lib/metadata";
import { DEFAULT_LEAD_SERVICE_OPTIONS } from "@/lib/lead-services";

// Pressure washing hero/gallery assets can be added under /images/services

type ResultTile = {
  title: string;
  description: string;
  afterImage: string;
  beforeImage?: string;
};

const resultTiles: ResultTile[] = [
  {
    title: "Whole Home Soft-Wash",
    description: "Refresh siding, brick, and trim with surface-safe soft-wash methods.",
    afterImage: "/images/services/wash-house.jpg"
  },
  {
    title: "Driveway Cleaning",
    description: "Lift grime and stains from concrete and pavers for instant curb appeal.",
    afterImage: "/images/services/wash-driveway.jpg"
  },
  {
    title: "Deck & Patio Restore",
    description: "Brighten patios, porches, and decks with the right pressure for the material.",
    afterImage: "/images/services/wash-deck.jpg"
  }
];

const testimonials = [
  {
    quote: "Our driveway looks brand new again. Easy scheduling and great communication.",
    name: "Local customer",
    location: "Woodstock"
  },
  {
    quote: "Professional crew, careful around landscaping, and the house wash made a huge difference.",
    name: "Local customer",
    location: "Canton"
  },
  {
    quote: "Great results on our patio and walkways. Clear estimate and on-time arrival.",
    name: "Local customer",
    location: "Roswell"
  }
];

const stats = [
  { label: "Service", value: "Surface-safe", secondary: "Soft-wash and pressure washing options" },
  { label: "Scheduling", value: "Flexible", secondary: "Weekday and weekend windows" },
  { label: "Crew", value: "Insured", secondary: "Professional, careful, and respectful" }
];

export const metadata = createPageMetadata("home");

export default function HomePage() {
  const home = allPages.find((page) => page.slug === "home");
  if (!home) {
    notFound();
  }

  const company = getPublicCompanyProfile();
  const services = [...allServices].sort((a, b) => a.title.localeCompare(b.title));
  const areas = allAreas.filter((area) => area.slug !== "index").sort((a, b) => a.title.localeCompare(b.title));
  const serviceContentMap = new Map(services.map((service) => [service.slug, service]));
  const leadServiceOptions = DEFAULT_LEAD_SERVICE_OPTIONS.map((option) => {
    const content = serviceContentMap.get(option.slug);
    return {
      ...option,
      description: content?.short ?? option.description
    };
  });
  const leadFormServices = leadServiceOptions;

  return (
    <div className="relative flex flex-col gap-16 pb-24">
      <Section className="pt-10 md:pt-12">
        <HeroV2 variant="lean" />
      </Section>
      <Section className="relative" containerClassName="">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resultTiles.map((tile, index) => (
            <article
              key={tile.title}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-float"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tile.afterImage}
                    alt={`${tile.title} by ${company.name}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                    priority
                    quality={60}
                  />
                {tile.beforeImage ? (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 overflow-hidden transition duration-700 group-hover:translate-x-1"
                      style={{ clipPath: "inset(0 52% 0 0)" }}
                    >
                      <Image
                        src={tile.beforeImage}
                        alt={`${tile.title} before ${company.name} service`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                        priority={false}
                        quality={60}
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-[48%] w-px bg-white/80 shadow-[0_0_12px_rgba(15,23,42,0.35)]" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
                      <span>Before</span>
                    </div>
                    <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary-700/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
                      <span>After</span>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="space-y-2 px-6 py-5">
                <h3 className="text-lg font-semibold text-primary-900">{tile.title}</h3>
                <p className="text-sm text-neutral-600">{tile.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section containerClassName="gap-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>
        <div className="grid gap-8">
          <div className="rounded-xl border border-neutral-300/50 bg-white p-8 shadow-soft">
            <MdxContent code={home.body.code} />
          </div>
          <div id="schedule-estimate">
            <Suspense
              fallback={
                <div className="rounded-xl border border-neutral-300/50 bg-white p-8 text-sm text-neutral-600 shadow-soft">
                  Loading scheduler...
                </div>
              }
            >
              <LeadForm />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section className="mt-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-headline text-primary-800">Exterior services that fit your property</h2>
            <p className="mt-3 max-w-2xl text-body text-neutral-600">
              From soft-wash house cleaning to driveway and patio restoration, we build each visit around your surfaces and your schedule with clear, upfront estimates.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/services">Explore Services</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {leadFormServices.map((service) => {
            return (
              <Card key={service.slug} className="flex h-full flex-col gap-4">
              <div>
                <h3 className="text-xl font-semibold text-primary-800">{service.title}</h3>
                  {service.description ? (
                    <p className="mt-2 text-body text-neutral-600">{service.description}</p>
                  ) : null}
              </div>
              <Button variant="ghost" asChild className="mt-auto w-fit px-0 text-accent-700 hover:text-accent-800">
                  <Link href={`/services/${service.slug}`}>Learn more {"->"}</Link>
              </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Removed "Why Us?" section per request */}

      <Section>
        <div className="grid gap-6">
          <div>
            <h2 className="font-display text-headline text-primary-800">See the difference</h2>
            <p className="mt-3 text-body text-neutral-600">
              Slide to compare a real before-and-after result.
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage="/images/gallery/showcase/garage_before_aligned_16x9_1080p.jpg"
            afterImage="/images/gallery/showcase/garage_after_aligned_16x9_1080p.jpg"
            alt="Before and after exterior cleaning result"
          />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-headline text-primary-800">Homeowners and businesses love our results</h2>
            <p className="mt-2 max-w-2xl text-body text-neutral-600">
              Clear communication, careful work, and clean finishes on every visit.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/reviews">Read reviews</Link>
          </Button>
        </div>
        <Testimonials items={testimonials} />
      </Section>

      <Section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-headline text-primary-800">Serving North Metro communities</h2>
            <p className="mt-2 text-body text-neutral-600">
              Core coverage includes Woodstock, Towne Lake, Canton, Roswell, Alpharetta, and beyond. Extended travel options available up to 30 miles.
            </p>
          </div>
          <Button asChild>
            <Link href="/areas">View all areas</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.slice(0, 6).map((area) => (
            <Card key={area.slug} className="flex h-full flex-col gap-3">
              <h3 className="text-lg font-semibold text-primary-800">{area.title}</h3>
              {area.city ? <p className="text-sm text-neutral-500">{area.city}</p> : null}
              <Button variant="ghost" asChild className="mt-auto w-fit px-0 text-accent-700 hover:text-accent-800">
                <Link href={`/areas/${area.slug}`}>Explore area{" ->"}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>
      <StickyCtaBar />
    </div>
  );
}
