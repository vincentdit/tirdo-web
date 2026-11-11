"use client";

import { useSearchParams } from "next/navigation";
import { publicAuthNotice } from "@/lib/customer-error";

export function CustomerAuthNotice() {
  const search = useSearchParams();
  const message = publicAuthNotice({
    loginError: search.get("login_error"),
    denied: search.get("denied"),
    reason: search.get("reason"),
  });
  if (!message) return null;
  return (
    <div className="container-tirdo pt-4">
      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {message}
      </p>
    </div>
  );
}
