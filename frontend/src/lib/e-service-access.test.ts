import { describe, expect, it } from "vitest";
import {
  canAccessEService,
  canOpenContentManagement,
  launchTarget,
  oidcRolesFromPayload,
  workspaceServices,
} from "@/lib/e-service-access";
import { eservices } from "@/lib/content";

describe("e-service Keycloak access policy", () => {
  it("reads realm and client roles from the access token", () => {
    const roles = oidcRolesFromPayload({
      realm_access: { roles: ["staff"] },
      resource_access: { niims: { roles: ["user"] } },
    });
    expect(roles).toContain("staff");
    expect(roles).toContain("user");
    expect(roles).toContain("niims:user");
  });

  it("does not give a public user NIIMS or content management", () => {
    expect(canAccessEService("nilims", ["public"])).toBe(false);
    expect(canOpenContentManagement(["public"])).toBe(false);
    expect(canAccessEService("client-portal", ["public"])).toBe(true);
  });

  it("lets staff open institutional systems and editors open CMS", () => {
    expect(canAccessEService("nilims", ["staff"])).toBe(true);
    expect(canAccessEService("ciap", ["staff"])).toBe(true);
    expect(canAccessEService("eoffice", ["staff"])).toBe(true);
    expect(canOpenContentManagement(["staff"])).toBe(false);
    expect(canOpenContentManagement(["content-editor"])).toBe(true);
    expect(canAccessEService("lims", ["tirdo-admin"])).toBe(true);
  });

  it("builds a workspace of only authorised connected tiles", () => {
    const rows = workspaceServices(
      [
        ...eservices,
        { slug: "lims", title: "LIMS", description: "Lab", href: "https://lims.example", category: "Other", showOnPublic: true, showInPortal: true, displayOrder: 25, active: true },
      ],
      ["staff"]
    );
    expect(rows.some((r) => r.slug === "nilims")).toBe(true);
    expect(rows.find((r) => r.slug === "lims")?.launchPath).toBe("/api/e-services/launch/lims");
    expect(workspaceServices(eservices, ["public"])).toEqual([]);
  });

  it("blocks launch without a role and without a configured URL", () => {
    const ciap = eservices.find((e) => e.slug === "ciap")!;
    expect(launchTarget(undefined, ["staff"]).status).toBe(404);
    expect(launchTarget({ ...ciap, href: "https://ciap.tirdo.or.tz" }, ["public"]).status).toBe(403);
    expect(launchTarget({ ...ciap, href: "" }, ["staff"]).status).toBe(409);
    expect(launchTarget({ ...ciap, href: "https://ciap.tirdo.or.tz" }, ["staff"]).href).toBe("https://ciap.tirdo.or.tz");
  });
});
