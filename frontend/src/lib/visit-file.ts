import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { tmpdir } from "os";
import { applyUniqueVisit, emptyVisits, readVisitsForDisplay, type VisitCounts } from "@/lib/visit-store";

function filePath() {
  return process.env.VISITOR_DATA_PATH || join(tmpdir(), "tirdo-visits.json");
}

function load(): VisitCounts {
  try {
    const raw = JSON.parse(readFileSync(filePath(), "utf8")) as Partial<VisitCounts>;
    return {
      today: Number(raw.today) || 0,
      month: Number(raw.month) || 0,
      total: Number(raw.total) || 0,
      day: String(raw.day || ""),
      monthKey: String(raw.monthKey || ""),
    };
  } catch {
    return emptyVisits();
  }
}

function save(data: VisitCounts) {
  const path = filePath();
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(data), "utf8");
  } catch {
    try {
      const fallback = join(tmpdir(), "tirdo-visits.json");
      writeFileSync(fallback, JSON.stringify(data), "utf8");
    } catch {
      /* keep in-memory only for this request */
    }
  }
}

export function recordUniqueVisit() {
  const next = applyUniqueVisit(load());
  save(next);
  return readVisitsForDisplay(next);
}

export function currentVisits() {
  return readVisitsForDisplay(load());
}
