"use client";

import { MediaField } from "@/components/tirdo-auth/media-field";
import { type DepartmentUnit, unitSlug } from "@/lib/portal";

function emptyUnit(): DepartmentUnit {
  return {
    title: "",
    slug: "",
    kind: "division",
    items: "",
    headName: "",
    headEmail: "",
    headTitle: "",
    headPhoto: null,
  };
}

export function DepartmentUnitsField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: DepartmentUnit[]) => void;
}) {
  const units = Array.isArray(value) ? (value as DepartmentUnit[]) : [];

  function update(index: number, patch: Partial<DepartmentUnit>) {
    onChange(units.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3">
      <div>
        <span className="font-medium text-slate-700">Divisions and sections</span>
        <p className="mt-1 text-xs text-slate-500">
          Example: ICT &amp; Technology Development has the ICT division, Electronics, and Technology Transfer. Each can have a different head who approves publish for that unit. Upload a passport-style photo for the icon.
        </p>
      </div>
      {units.map((unit, index) => (
        <div key={unit.id ?? index} className="rounded-lg border bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#0A192F]">
              {unit.kind === "section" ? "Section" : "Division"} {index + 1}
            </p>
            <button
              type="button"
              className="text-xs text-red-700 hover:underline"
              onClick={() => onChange(units.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Name</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.title || ""}
                onChange={(e) => {
                  const title = e.target.value;
                  update(index, { title, slug: unit.slug || unitSlug(title) });
                }}
                placeholder="Information & Communication Technologies"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Type</span>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.kind || "division"}
                onChange={(e) => update(index, { kind: e.target.value === "section" ? "section" : "division" })}
              >
                <option value="division">Division</option>
                <option value="section">Section</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Head name</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.headName || ""}
                onChange={(e) => update(index, { headName: e.target.value })}
                placeholder="Ms. Elizabeth Mtegwa"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Head email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.headEmail || ""}
                onChange={(e) => update(index, { headEmail: e.target.value })}
                placeholder="used to assign the approver role"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Head title</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.headTitle || ""}
                onChange={(e) => update(index, { headTitle: e.target.value })}
                placeholder="Head of division"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">URL slug</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={unit.slug || ""}
                onChange={(e) => update(index, { slug: unitSlug(e.target.value) })}
                placeholder="ict"
              />
            </label>
          </div>
          <div className="mt-3">
            <MediaField
              label="Head passport photo"
              value={unit.headPhoto}
              accept="image/jpeg,image/png,image/webp"
              portrait
              onChange={(next) => update(index, { headPhoto: next })}
            />
          </div>
          <label className="mt-3 block text-sm">
            <span className="font-medium text-slate-700">Units inside this division (one per line, optional)</span>
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={2}
              value={unit.items || ""}
              onChange={(e) => update(index, { items: e.target.value })}
              placeholder="Personnel&#10;Training"
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="rounded-md border px-3 py-2 text-sm font-semibold text-[#0A192F] hover:bg-slate-50"
        onClick={() => onChange([...units, emptyUnit()])}
      >
        Add a division or section
      </button>
    </div>
  );
}
