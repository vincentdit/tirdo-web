import { describe, it, expect } from "vitest";
import {
  featuredEvents,
  isCurrentEvent,
  notificationEvents,
  eventNoticeHref,
  shortNoticeTitle,
  eventToFloatingNotice,
  mergeFloatingNotices,
  newsToFloatingNotice,
  nextFloatingNotice,
  parseDismissedNotices,
  isPublicPartner,
  partners,
  safeWebsiteUrl,
  isOpen,
  projectAreaSlug,
  researchAreaName,
  researchAreas,
  vacancies,
  tenders,
  technologies,
  technologySectors,
  technologySectorName,
  technologyMaturities,
  laboratory,
  consultancy,
  training,
  serviceCharter,
  serviceAreas,
  feedbackTypes,
  eServiceOpen,
  safeServiceHref,
  type Project,
} from "@/lib/content";
import { eventDateBadge } from "@/lib/utils";

describe("event date badge", () => {
  it("splits a date into day and short month", () => {
    expect(eventDateBadge(new Date(2026, 10, 15))).toEqual({ day: "15", month: "NOV" });
  });
});

describe("featured events", () => {
  const now = new Date("2026-10-22T12:00:00Z");
  const sample = {
    slug: "sample",
    title: "Sample",
    date: "2026-11-01",
    location: "Dar es Salaam",
    category: "Training",
    description: "A training.",
  };

  it("treats a future date as current", () => {
    expect(isCurrentEvent(sample, now)).toBe(true);
  });

  it("treats a past date as not current", () => {
    expect(isCurrentEvent({ ...sample, date: "2025-01-01" }, now)).toBe(false);
  });

  it("pins current events first", () => {
    const list = featuredEvents(
      [
        { ...sample, slug: "later", date: "2026-12-01" },
        { ...sample, slug: "pinned-past", date: "2025-01-01", pinned: true },
      ],
      now
    );
    expect(list[0].slug).toBe("pinned-past");
    expect(list.map((e) => e.slug)).toContain("later");
  });

  it("keeps website notifications only when switched on", () => {
    const list = notificationEvents(
      [
        { ...sample, slug: "on", notifyOnSite: true },
        { ...sample, slug: "off", notifyOnSite: false },
        { ...sample, slug: "unset" },
      ],
      now
    );
    expect(list.map((e) => e.slug)).toEqual(["on"]);
  });

  it("hides expired notifications even if they were featured", () => {
    const list = notificationEvents(
      [
        { ...sample, slug: "expired", date: "2025-01-01", notifyOnSite: true, pinned: true },
        { ...sample, slug: "live", date: "2026-11-01", notifyOnSite: true },
      ],
      now
    );
    expect(list.map((e) => e.slug)).toEqual(["live"]);
  });

  it("shows pinned notices first", () => {
    const list = notificationEvents(
      [
        { ...sample, slug: "later", date: "2026-12-01", notifyOnSite: true },
        { ...sample, slug: "priority", date: "2026-11-20", notifyOnSite: true, pinned: true },
      ],
      now
    );
    expect(list[0].slug).toBe("priority");
  });
});

describe("floating notices", () => {
  it("keeps a notice title to four words", () => {
    expect(shortNoticeTitle("Biomass Briquettes Production Training for industry")).toBe("Biomass Briquettes Production Training");
    expect(shortNoticeTitle("Public notice")).toBe("Public notice");
  });

  const sample = {
    slug: "sample",
    title: "Sample",
    date: "2026-11-01",
    location: "Dar es Salaam",
    category: "Training",
    description: "A training.",
    notifyOnSite: true,
  };

  it("opens the event page even if a contact register link is set", () => {
    expect(eventNoticeHref(sample)).toEqual({ href: "/events/sample", label: "Learn more", external: false });
    expect(eventNoticeHref({ ...sample, registerUrl: "/contact" })).toEqual({
      href: "/events/sample",
      label: "Learn more",
      external: false,
    });
  });

  it("uses a configured action link for staff misconduct without inventing an API", () => {
    expect(eventNoticeHref({ ...sample, title: "Report Staff Misconduct", registerUrl: "/feedback" })).toEqual({
      href: "/feedback",
      label: "Report",
      external: false,
    });
    expect(eventNoticeHref({ ...sample, title: "Report Staff Misconduct", registerUrl: "javascript:alert(1)" }).href).toBe(
      "/events/sample"
    );
  });

  it("skips dismissed notices and ignores malformed session data", () => {
    const notices = [eventToFloatingNotice(sample), eventToFloatingNotice({ ...sample, slug: "second", title: "Second" })];
    expect(nextFloatingNotice(notices, ["event:sample"])?.id).toBe("event:second");
    expect(nextFloatingNotice(notices, ["event:sample", "event:second"])).toBeNull();
    expect(parseDismissedNotices("not-json")).toEqual([]);
  });

  it("merges a published announcement notice behind a pinned event", () => {
    const list = mergeFloatingNotices(
      [{ ...sample, pinned: true }],
      [
        {
          slug: "public-notice",
          title: "Public notice",
          excerpt: "Please read.",
          category: "Announcement",
          date: "2026-10-20",
          notifyOnSite: true,
        },
      ],
      new Date("2026-10-22T12:00:00Z")
    );
    expect(list.map((item) => item.id)).toEqual(["event:sample", "news:public-notice"]);
    expect(newsToFloatingNotice({ slug: "x", title: "X", excerpt: "", category: "News", date: "2026-01-01" }).actionLabel).toBe(
      "Read more"
    );
  });
});

describe("isOpen (vacancy/tender auto-archive)", () => {
  const now = new Date("2026-09-06T12:00:00Z");

  it("is open on a future closing date", () => {
    expect(isOpen("2026-12-31", now)).toBe(true);
  });

  it("is open through the whole closing day (end of day)", () => {
    expect(isOpen("2026-09-06", now)).toBe(true);
  });

  it("is closed the day after the closing date", () => {
    expect(isOpen("2026-09-05", now)).toBe(false);
  });

  it("treats an unparseable date as open (fail-safe)", () => {
    expect(isOpen("not-a-date", now)).toBe(true);
  });
});

describe("projectAreaSlug (department -> research area)", () => {
  const p = (department: string, extra: Partial<Project> = {}): Project => ({
    slug: "x", title: "X", summary: "", department, status: "Ongoing", ...extra,
  });

  it("prefers an explicit researchArea", () => {
    expect(projectAreaSlug(p("Whatever", { researchArea: "materials" }))).toBe("materials");
  });

  it("maps energy divisions", () => {
    expect(projectAreaSlug(p("Energy Technology Division"))).toBe("energy");
    expect(projectAreaSlug(p("Energy"))).toBe("energy");
  });

  it("maps environment, food/biotech, ICT and transfer", () => {
    expect(projectAreaSlug(p("Environmental Technology & Occupational Safety Division"))).toBe("environment");
    expect(projectAreaSlug(p("Food & Biotechnology"))).toBe("food-biotechnology");
    expect(projectAreaSlug(p("Information & Communication Technologies Division"))).toBe("ict");
    expect(projectAreaSlug(p("Technology Transfer"))).toBe("technology-transfer");
  });

  it("returns undefined for an unmapped department", () => {
    expect(projectAreaSlug(p("Corporate Services"))).toBeUndefined();
  });
});

describe("researchAreaName", () => {
  it("resolves a known slug", () => {
    expect(researchAreaName("energy")).toBe("Energy");
  });
  it("returns undefined for unknown/undefined", () => {
    expect(researchAreaName("nope")).toBeUndefined();
    expect(researchAreaName(undefined)).toBeUndefined();
  });
  it("every area maps back to a name", () => {
    for (const a of researchAreas) expect(researchAreaName(a.slug)).toBe(a.name);
  });
});

describe("sample content integrity", () => {
  it("vacancies have required fields and unique slugs", () => {
    const slugs = new Set<string>();
    for (const v of vacancies) {
      expect(v.slug).toBeTruthy();
      expect(v.title).toBeTruthy();
      expect(v.closingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slugs.has(v.slug)).toBe(false);
      slugs.add(v.slug);
    }
  });
  it("tenders have references and unique slugs", () => {
    const slugs = new Set<string>();
    for (const t of tenders) {
      expect(t.reference).toBeTruthy();
      expect(t.closingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slugs.has(t.slug)).toBe(false);
      slugs.add(t.slug);
    }
  });
});


describe("technology catalogue (FR-TECH)", () => {
  it("entries have unique slugs, a known sector and maturity", () => {
    const slugs = new Set<string>();
    const sectors = new Set(technologySectors.map((s) => s.slug));
    for (const t of technologies) {
      expect(t.slug).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.summary).toBeTruthy();
      expect(sectors.has(t.sector), `unknown sector ${t.sector}`).toBe(true);
      expect(technologyMaturities).toContain(t.maturity);
      expect(slugs.has(t.slug)).toBe(false);
      slugs.add(t.slug);
    }
  });

  it("technologySectorName resolves known slugs and rejects unknown", () => {
    for (const s of technologySectors) expect(technologySectorName(s.slug)).toBe(s.name);
    expect(technologySectorName("nope")).toBeUndefined();
    expect(technologySectorName(undefined)).toBeUndefined();
  });

  it("any relatedServiceSlug is a non-empty string", () => {
    for (const t of technologies) if (t.relatedServiceSlug) expect(typeof t.relatedServiceSlug).toBe("string");
  });
});

describe("section content (FR-LAB / FR-CON / FR-TRN)", () => {
  it("laboratory has intro, accreditation, test groups and a process", () => {
    expect(laboratory.intro.length).toBeGreaterThan(0);
    expect(laboratory.accreditation).toBeTruthy();
    expect(laboratory.groups.length).toBeGreaterThan(0);
    for (const g of laboratory.groups) expect(g.tests.length).toBeGreaterThan(0);
    expect(laboratory.process.length).toBe(4);
  });

  it("consultancy has service lines with icons and a process", () => {
    expect(consultancy.lines.length).toBeGreaterThan(0);
    for (const l of consultancy.lines) { expect(l.title).toBeTruthy(); expect(l.icon).toBeTruthy(); }
    expect(consultancy.process.length).toBe(4);
  });

  it("training has courses and a process", () => {
    expect(training.courses.length).toBeGreaterThan(0);
    for (const c of training.courses) { expect(c.title).toBeTruthy(); expect(c.area).toBeTruthy(); }
    expect(training.process.length).toBe(4);
  });
});


describe("feedback & service charter (FR-FEEDBACK / FR-CHARTER)", () => {
  it("service areas and feedback types are non-empty", () => {
    expect(serviceAreas.length).toBeGreaterThan(0);
    for (const a of serviceAreas) expect(a).toBeTruthy();
    expect(feedbackTypes).toContain("Complaint");
    expect(feedbackTypes.length).toBe(4);
  });
  it("service charter has intro, standards with turnarounds, rights and responsibilities", () => {
    expect(serviceCharter.intro.length).toBeGreaterThan(0);
    expect(serviceCharter.standards.length).toBeGreaterThan(0);
    for (const s of serviceCharter.standards) {
      expect(s.service).toBeTruthy();
      expect(s.standard).toBeTruthy();
      expect(s.turnaround).toBeTruthy();
    }
    expect(serviceCharter.rights.length).toBeGreaterThan(0);
    expect(serviceCharter.responsibilities.length).toBeGreaterThan(0);
  });
});

describe("public partners", () => {
  const now = new Date("2026-10-22T12:00:00Z");
  const base = partners[0];

  it("keeps active partners without dates visible", () => {
    expect(isPublicPartner(base, now)).toBe(true);
  });

  it("hides inactive partners", () => {
    expect(isPublicPartner({ ...base, active: false }, now)).toBe(false);
  });

  it("hides partners after the end date", () => {
    expect(isPublicPartner({ ...base, endDate: "2026-01-01" }, now)).toBe(false);
  });

  it("rejects unsafe websites", () => {
    expect(safeWebsiteUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeWebsiteUrl("https://www.costech.or.tz")).toBe("https://www.costech.or.tz");
  });
});

describe("e-service links", () => {
  it("opens an http(s) or site-relative URL when Super Admin has set one", () => {
    expect(safeServiceHref("javascript:alert(1)")).toBeUndefined();
    expect(eServiceOpen({ title: "CIAP", href: "https://ciap.example.go.tz" })).toEqual({
      href: "https://ciap.example.go.tz",
      external: true,
      label: "Open",
    });
    expect(eServiceOpen({ title: "LIMS", href: "/industrial-information-centre" }).label).toBe("Open");
  });

  it("falls back to Contact when the system URL is still blank", () => {
    const open = eServiceOpen({ title: "Client Portal", href: "" });
    expect(open.label).toBe("Request access");
    expect(open.href).toBe("/contact?service=Client%20Portal");
  });
});
