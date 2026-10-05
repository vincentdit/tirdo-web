"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceAreas, feedbackTypes } from "@/lib/content";

export function FeedbackForm() {
  const params = useSearchParams();
  const presetService = params.get("service") || "";
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(form.entries()), rating };
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        setRating(0);
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-secondary/50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-teal" />
        <p className="font-semibold text-primary">Thank you — your feedback has been received.</p>
        <p className="text-sm text-muted-foreground">TIRDO uses your feedback to measure and improve its services.</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>Send more feedback</Button>
      </div>
    );
  }

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-type" className="mb-1 block text-sm font-medium">Type of feedback</label>
          <select id="fb-type" name="feedbackType" defaultValue="Suggestion" className={input}>
            {feedbackTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fb-service" className="mb-1 block text-sm font-medium">Service area</label>
          <select id="fb-service" name="serviceArea" defaultValue={presetService || serviceAreas[serviceAreas.length - 1]} className={input}>
            {serviceAreas.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Your rating of this service</span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Service rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-0.5 text-brand-gold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Star className={`h-7 w-7 ${(hover || rating) >= n ? "fill-brand-gold" : "fill-none"}`} />
            </button>
          ))}
          {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="mb-1 block text-sm font-medium">Full name</label>
          <input id="fb-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="fb-email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="fb-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="fb-org" className="mb-1 block text-sm font-medium">Organization <span className="font-normal text-muted-foreground">(optional)</span></label>
        <input id="fb-org" name="organization" autoComplete="organization" className={input} />
      </div>
      <div>
        <label htmlFor="fb-subject" className="mb-1 block text-sm font-medium">Subject</label>
        <input id="fb-subject" name="subject" className={input} />
      </div>
      <div>
        <label htmlFor="fb-message" className="mb-1 block text-sm font-medium">Your feedback</label>
        <textarea id="fb-message" name="message" required rows={5} className={input} />
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="fb-company">Company</label>
        <input id="fb-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
      <Button type="submit" variant="accent" disabled={status === "sending"} className="w-full justify-center">
        {status === "sending" ? "Sending…" : <>Submit feedback <Send className="h-4 w-4" /></>}
      </Button>
    </form>
  );
}
