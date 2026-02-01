'use client';

import * as React from "react";
import { availabilityWindows } from "@myst-os/pricing";
import { Button, cn } from "@myst-os/ui";
import { Check } from "lucide-react";
import { DEFAULT_LEAD_SERVICE_OPTIONS } from "@/lib/lead-services";
import { trackGoogleAdsConversion } from "@/lib/google-ads";
import { useUTM } from "@/lib/use-utm";

type EstimateFormContext = "default" | "commercial";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeServiceList(value: unknown): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  const normalized: string[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed.length) continue;
    if (!normalized.includes(trimmed)) normalized.push(trimmed);
  }
  return normalized;
}

export function EstimateRequestForm({
  className,
  initialServices,
  initialNotes,
  context = "default"
}: {
  className?: string;
  initialServices?: string[];
  initialNotes?: string;
  context?: EstimateFormContext;
}) {
  const utm = useUTM();
  const trackedSubmitRef = React.useRef(false);

  const resolvedInitialServices = React.useMemo(() => {
    const normalized = normalizeServiceList(initialServices);
    if (context === "commercial" && normalized.length === 0) {
      return ["commercial"];
    }
    return normalized;
  }, [context, initialServices]);

  const [services, setServices] = React.useState<string[]>(resolvedInitialServices);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [addressLine1, setAddressLine1] = React.useState("");
  const [city, setCity] = React.useState("");
  const [stateField, setStateField] = React.useState("GA");
  const [postalCode, setPostalCode] = React.useState("");
  const [preferredDate, setPreferredDate] = React.useState("");
  const [timeWindow, setTimeWindow] = React.useState<string>("morning");
  const [alternateDate, setAlternateDate] = React.useState("");
  const [notes, setNotes] = React.useState(() => initialNotes ?? "");
  const [businessName, setBusinessName] = React.useState("");
  const [submitState, setSubmitState] = React.useState<SubmitState>({ status: "idle" });

  const apiBase = process.env["NEXT_PUBLIC_API_BASE_URL"]?.replace(/\/$/, "") ?? "";
  const phoneE164 = (process.env["NEXT_PUBLIC_COMPANY_PHONE_E164"] ?? "").trim();
  const phoneDisplay = (process.env["NEXT_PUBLIC_COMPANY_PHONE_DISPLAY"] ?? "").trim();
  const minDate = React.useMemo(() => todayIso(), []);

  const toggleService = (slug: string) => {
    setServices((prev) => (prev.includes(slug) ? prev.filter((entry) => entry !== slug) : [...prev, slug]));
  };

  const submit = async () => {
    if (!services.length) {
      setSubmitState({ status: "error", message: "Please select at least one service." });
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setSubmitState({ status: "error", message: "Please enter your name and mobile number." });
      return;
    }
    if (!addressLine1.trim() || !city.trim() || !stateField.trim() || !postalCode.trim()) {
      setSubmitState({ status: "error", message: "Please enter the service address (street, city, state, ZIP)." });
      return;
    }
    if (!preferredDate.trim() || !timeWindow.trim()) {
      setSubmitState({ status: "error", message: "Please choose a preferred date and time window." });
      return;
    }
    if (!apiBase) {
      setSubmitState({ status: "error", message: "Scheduling is unavailable right now. Please call or text us." });
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const noteLines: string[] = [];
      if (context === "commercial") {
        noteLines.push("Lead type: Commercial request");
        if (businessName.trim().length) noteLines.push(`Business: ${businessName.trim()}`);
      }

      const combinedNotes = [notes.trim(), noteLines.join("\n")].filter((part) => part.length > 0).join("\n");

      const payload = {
        services,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().length ? email.trim() : undefined,
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: stateField.trim().slice(0, 2).toUpperCase(),
        postalCode: postalCode.trim(),
        notes: combinedNotes.length ? combinedNotes.slice(0, 1000) : undefined,
        scheduling: {
          preferredDate: preferredDate.trim(),
          alternateDate: alternateDate.trim().length ? alternateDate.trim() : undefined,
          timeWindow: timeWindow.trim()
        },
        appointmentType: "web_lead",
        utm
      };

      const res = await fetch(`${apiBase}/api/web/lead-intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;

      if (!res.ok) {
        const message =
          (typeof data?.message === "string" && data.message.trim().length > 0 ? data.message : null) ??
          (typeof data?.error === "string" && data.error.trim().length > 0 ? data.error : null) ??
          `Request failed (HTTP ${res.status})`;
        throw new Error(message);
      }

      if (data?.ok === false) {
        const message =
          (typeof data?.message === "string" && data.message.trim().length > 0 ? data.message : null) ??
          "We couldn't submit your request. Please call or text us.";
        setSubmitState({ status: "error", message });
        return;
      }

      if (!trackedSubmitRef.current) {
        const sendTo = process.env["NEXT_PUBLIC_GOOGLE_ADS_CONTACT_SEND_TO"];
        if (typeof sendTo === "string" && sendTo.trim().length > 0) {
          trackedSubmitRef.current = true;
          trackGoogleAdsConversion(sendTo, { value: 1, currency: "USD" });
        }
      }

      setSubmitState({
        status: "success",
        message: "Request received. We'll follow up to confirm the exact time."
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "We couldn't submit your request. Please try again."
      });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className={cn("rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft", className)}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-800 ring-1 ring-primary-100">
            <Check className="h-5 w-5" strokeWidth={3} />
          </span>
          <div>
            <h2 className="font-display text-xl text-primary-900">You’re all set</h2>
            <p className="mt-1 text-sm text-neutral-600">{submitState.message}</p>
            <p className="mt-2 text-xs text-neutral-500">
              We’ll usually respond quickly by text/call.
              {phoneE164 && phoneDisplay ? (
                <>
                  {" "}
                  If you need help right now, call{" "}
                  <a className="font-semibold text-primary-800 hover:underline" href={`tel:${phoneE164}`}>
                    {phoneDisplay}
                  </a>
                  .
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft", className)}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Request a time window</p>
        <h2 className="font-display text-2xl text-primary-900">
          {context === "commercial" ? "Request a commercial quote" : "Schedule your estimate"}
        </h2>
        <p className="text-sm text-neutral-600">Pick a preferred date/time window and we’ll follow up to confirm. No obligation.</p>
      </div>

      {submitState.status === "error" ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
          {submitState.message}
        </div>
      ) : null}

      <form
        className="mt-5 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-800">What do you need cleaned?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {DEFAULT_LEAD_SERVICE_OPTIONS.map((option) => {
              const selected = services.includes(option.slug);
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => toggleService(option.slug)}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                    selected
                      ? "border-primary-600 bg-primary-50 shadow-sm ring-1 ring-primary-100"
                      : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/40"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold transition",
                      selected ? "border-primary-700 bg-white text-black" : "border-neutral-300 bg-white text-transparent"
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="space-y-0.5">
                    <span className="block font-semibold text-neutral-900">{option.title}</span>
                    {option.description ? <span className="block text-xs text-neutral-500">{option.description}</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {context === "commercial" ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-800">Business name (optional)</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="Company / property name"
              autoComplete="organization"
            />
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800">Mobile</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="(555) 555-5555"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-800">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-800">Address</label>
            <input
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="Street address"
              autoComplete="street-address"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
              placeholder="City"
              autoComplete="address-level2"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-neutral-800">State</label>
              <input
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
                placeholder="GA"
                autoComplete="address-level1"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-semibold text-neutral-800">ZIP</label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
                placeholder="ZIP"
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800">Preferred date</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={minDate}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800">Preferred time window</label>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
            >
              {availabilityWindows.map((window) => (
                <option key={window.id} value={window.id}>
                  {window.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-800">Alternate date (optional)</label>
            <input
              type="date"
              value={alternateDate}
              onChange={(e) => setAlternateDate(e.target.value)}
              min={minDate}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-neutral-800">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[110px] w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700"
            placeholder="Anything we should know? Photos help if you have them."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={submitState.status === "submitting"}>
            {submitState.status === "submitting" ? "Submitting..." : "Submit request"}
          </Button>
          <p className="text-xs text-neutral-500">We’ll confirm details by text/call before any work is scheduled.</p>
        </div>
      </form>
    </div>
  );
}

