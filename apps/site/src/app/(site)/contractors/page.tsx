import Link from "next/link";
import type { Metadata } from "next";
import { Badge, Button, Card, Section } from "@myst-os/ui";
import { getPublicCompanyProfile } from "@/lib/company";
import { absoluteUrl } from "@/lib/metadata";

const description =
  "Commercial pressure washing and soft washing for storefronts, office parks, HOA amenities, and shared spaces across North Metro Atlanta. Request a quote and we’ll confirm scope and scheduling.";

export const metadata: Metadata = {
  title: "Commercial pressure washing",
  description,
  openGraph: {
    title: "Commercial pressure washing",
    description,
    url: absoluteUrl("/contractors"),
    type: "website"
  },
  alternates: {
    canonical: absoluteUrl("/contractors")
  }
};

export default function CommercialPage() {
  const company = getPublicCompanyProfile();

  return (
    <Section>
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
          <div className="space-y-4">
            <Badge tone="highlight">Commercial</Badge>
            <h1 className="font-display text-display text-primary-800">Commercial pressure washing</h1>
            <p className="text-body text-neutral-600">
              Built for property managers and business owners. Share the address and what you want cleaned — we’ll follow up to confirm scope and a service window.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact?type=commercial">Request a commercial quote</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={`tel:${company.phoneE164}`}>Call {company.phoneDisplay}</a>
              </Button>
            </div>
            <p className="text-xs text-neutral-500">Serving North Metro Atlanta and nearby Georgia communities.</p>
          </div>

          <Card className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">What you can expect</p>
              <p className="text-lg font-semibold text-primary-900">Simple, property-manager friendly service</p>
            </div>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>Clear scope + quote before scheduling</li>
              <li>Surface-safe methods for concrete and building exteriors</li>
              <li>Flexible access windows when possible</li>
              <li>COIs and vendor onboarding available on request</li>
            </ul>
          </Card>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-2">
            <p className="text-sm font-semibold text-primary-900">Storefronts & sidewalks</p>
            <p className="text-sm text-neutral-600">Sidewalks, entryways, dumpster pads, and exterior touchpoints.</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-sm font-semibold text-primary-900">Office parks & shared spaces</p>
            <p className="text-sm text-neutral-600">Common areas, walkways, and exterior building surfaces.</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-sm font-semibold text-primary-900">HOA amenities</p>
            <p className="text-sm text-neutral-600">Clubhouses, pool decks, fences, and high-traffic concrete.</p>
          </Card>
        </section>

        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary-900">Ready for a quote?</p>
            <p className="text-sm text-neutral-600">Send details and photos (if available) and we’ll follow up.</p>
          </div>
          <Button asChild>
            <Link href="/contact?type=commercial">Request commercial quote</Link>
          </Button>
        </Card>
      </div>
    </Section>
  );
}

