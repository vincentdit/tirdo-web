"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-secondary/50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-teal" />
        <p className="font-semibold text-primary">Thank you — your message has been received.</p>
        <p className="text-sm text-muted-foreground">The TIRDO team will get back to you shortly.</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>Send another</Button>
      </div>
    );
  }

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-sm font-medium">Full name</label>
          <input id="cf-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className="mb-1 block text-sm font-medium">Subject</label>
        <input id="cf-subject" name="subject" required className={input} />
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1 block text-sm font-medium">Message</label>
        <textarea id="cf-message" name="message" required rows={5} className={input} />
      </div>
      {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
      <Button type="submit" variant="accent" disabled={status === "sending"} className="w-full justify-center">
        {status === "sending" ? "Sending…" : <>Send message <Send className="h-4 w-4" /></>}
      </Button>
    </form>
  );
}
