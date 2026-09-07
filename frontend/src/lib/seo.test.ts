import { describe, it, expect } from "vitest";
import { absoluteUrl, siteUrl, siteKeywords, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

describe("absoluteUrl", () => {
  it("joins a rooted path", () => {
    expect(absoluteUrl("/news")).toBe(`${siteUrl}/news`);
  });
  it("adds a missing leading slash", () => {
    expect(absoluteUrl("news")).toBe(`${siteUrl}/news`);
  });
  it("defaults to the site root", () => {
    expect(absoluteUrl()).toBe(`${siteUrl}/`);
  });
  it("siteUrl has no trailing slash", () => {
    expect(siteUrl.endsWith("/")).toBe(false);
  });
});

describe("structured data", () => {
  it("keywords include the org name and key services", () => {
    expect(siteKeywords).toContain("TIRDO");
    expect(siteKeywords.some((k) => /energy/i.test(k))).toBe(true);
  });
  it("organization JSON-LD is a GovernmentOrganization with a logo and address", () => {
    const o = organizationJsonLd();
    expect(o["@type"]).toBe("GovernmentOrganization");
    expect(o.url).toBe(siteUrl);
    expect(o.logo).toContain(siteUrl);
    expect((o.address as { addressCountry: string }).addressCountry).toBe("TZ");
  });
  it("website JSON-LD exposes a SearchAction pointing at /search", () => {
    const w = websiteJsonLd();
    const action = w.potentialAction as { target: { urlTemplate: string } };
    expect(w["@type"]).toBe("WebSite");
    expect(action.target.urlTemplate).toContain("/search?q=");
  });
});
