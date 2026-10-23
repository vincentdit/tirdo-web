"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { displayUserName, emailKey, type PortalUser } from "@/lib/portal-users";

function staffLabel(user: PortalUser) {
  const inactive = user.isActive === false ? " — inactive" : "";
  return `${displayUserName(user)} (${user.email})${inactive}`;
}

export function StaffSearchSelect({
  users,
  value,
  onChange,
}: {
  users: PortalUser[];
  value: string;
  onChange: (email: string) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = users.find((u) => emailKey(u.email) === emailKey(value));

  useEffect(() => {
    if (!open) setQuery(selected ? staffLabel(selected) : "");
  }, [selected, open]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const matches = useMemo(() => {
    const browsingSelected = Boolean(selected && query === staffLabel(selected));
    const q = browsingSelected ? "" : query.trim().toLowerCase();
    const list = q
      ? users.filter((u) => staffLabel(u).toLowerCase().includes(q) || emailKey(u.email).includes(q))
      : users;
    return { list: list.slice(0, 40), total: list.length };
  }, [users, query, selected]);

  return (
    <div ref={boxRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-[#0A192F]">Staff user</label>
      <input
        type="search"
        autoComplete="off"
        className="w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Type a name or email to find staff"
        value={query}
        onFocus={(e) => {
          setOpen(true);
          e.currentTarget.select();
        }}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          setOpen(true);
          if (!next.trim()) onChange("");
        }}
        required={!value}
      />
      <input type="hidden" name="staffEmail" value={value} required />
      {open && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-md">
          {matches.list.length === 0 ? (
            <li className="px-3 py-2 text-slate-500">No staff match that search.</li>
          ) : (
            matches.list.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left hover:bg-slate-100 ${
                    emailKey(u.email) === emailKey(value) ? "bg-emerald-50" : ""
                  }`}
                  onClick={() => {
                    onChange(u.email);
                    setQuery(staffLabel(u));
                    setOpen(false);
                  }}
                >
                  {staffLabel(u)}
                </button>
              </li>
            ))
          )}
          {matches.total > matches.list.length ? (
            <li className="px-3 py-1 text-xs text-slate-500">
              Showing 40 of {matches.total}. Keep typing a name or email to find someone.
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
