import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";

// Compact "rate this service / give feedback" call-to-action used on service
// and section pages. Pre-selects the service area in the feedback form.
export function FeedbackCTA({ service }: { service?: string }) {
  const href = service ? `/feedback?service=${encodeURIComponent(service)}` : "/feedback";
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
      <div className="mb-1 flex items-center gap-2 font-semibold text-primary">
        <MessageSquare className="h-5 w-5 text-brand-teal" /> Rate this service
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Used this service? Tell us how we did — it helps TIRDO improve.
      </p>
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:gap-2">
        Give feedback <ArrowRight className="h-4 w-4 transition-all" />
      </Link>
    </div>
  );
}
