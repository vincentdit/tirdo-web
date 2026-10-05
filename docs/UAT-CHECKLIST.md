# User acceptance testing (UAT) checklist

Run with TIRDO business representatives against the staging or pre-production
site before go-live. Mark each item Pass / Fail and log defects. Sign off at the
end. Test in at least Chrome and Firefox, on desktop and mobile, in both English
and Kiswahili.

Legend: ☐ Pass ☐ Fail — note defect ID where it fails.

## 1. Global navigation & layout

- ☐ Header, mega-menu and footer render correctly on desktop and mobile.
- ☐ Every top-level menu and sub-item opens the correct page.
- ☐ Logo/emblem, colours and typography match the approved TIRDO branding.
- ☐ Breadcrumbs on inner pages are correct.
- ☐ No broken links or missing images across the site.

## 2. Content sections

- ☐ **Home** — hero rotates and can be paused; stats, quick access, latest news.
- ☐ **About** — mission/vision, structure, board, administration, success
  stories, COMSATS all present and accurate.
- ☐ **Departments** — all divisions listed; each detail page reads correctly.
- ☐ **Services** — six services; each detail page opens; the three that have
  dedicated sections link through to them.
- ☐ **Technology Catalogue** — lists technologies; sector and maturity filters
  work; detail pages show benefits/applications and the transfer CTA.
- ☐ **Laboratory** — capabilities and process shown; NILIMS gateway points to the
  right system.
- ☐ **Consultancy** — service lines and process shown; CIAP gateway correct.
- ☐ **Training** — course catalogue and upcoming training shown; TeLTP gateway
  correct.
- ☐ **Research/Projects, Publications** — filters work; documents open/download.
- ☐ **News & Events, Gallery, Documents** — content current and correct.
- ☐ **Careers & Tenders** — open items listed; items past their closing date are
  archived automatically; apply/download links work.

## 3. Search

- ☐ Searching a known term returns relevant results with type facets.
- ☐ Type-ahead suggestions appear and are clickable.
- ☐ Results link to the correct pages; new sections (technology, laboratory,
  consultancy, training) are findable.

## 4. Bilingual (EN/SW)

- ☐ Language switch changes the interface language and persists across pages.
- ☐ Translated content displays where provided; untranslated entries fall back to
  English (no blank pages).
- ☐ Kiswahili copy reads naturally (native-speaker review).

## 5. Contact & enquiries

- ☐ Contact form validates required fields and rejects a malformed email.
- ☐ A valid submission shows the success state.
- ☐ The message appears in the CMS (Contact Messages) with phone/organization.
- ☐ The notification email reaches the configured recipient.

## 6. Accounts & e-Services

- ☐ Sign-in via Keycloak SSO works from the e-Services page.
- ☐ MFA (authenticator) is requested for privileged accounts.
- ☐ Role-appropriate tiles appear (staff/editor); editor can reach the CMS.
- ☐ Sign-out works; protected areas are not reachable when signed out.

## 7. Accessibility

- ☐ Keyboard-only navigation reaches all interactive elements; focus is visible.
- ☐ Colour contrast is adequate; text scales without breaking layout.
- ☐ Images have meaningful alt text; forms have labels.
- ☐ Reduced-motion setting pauses the hero animation.

## 8. Performance

- ☐ Key pages load quickly on a typical connection.
- ☐ Below-the-fold images defer without layout jumps.
- ☐ Lighthouse run meets the agreed budgets (`docs/PERFORMANCE.md`).

## 9. Security & privacy

- ☐ Site is served over HTTPS with a valid certificate; HTTP redirects.
- ☐ Admin consoles (CMS, Keycloak, OpenSearch Dashboards, MinIO, Matomo) are not
  publicly reachable.
- ☐ Security headers present; cookie/consent behaviour acceptable.
- ☐ Privacy and disclaimer pages present and accurate.

## 10. Cross-browser & responsive

- ☐ Chrome, Firefox, Edge, Safari — layout and function consistent.
- ☐ Mobile and tablet layouts usable; menu, tables and cards adapt.

## 11. Analytics

- ☐ Visits are recorded in Matomo via the first-party proxy (not blocked).
- ☐ The analytics page renders live figures.

## Defect log

| ID | Area | Description | Severity | Status |
|---|---|---|---|---|
| | | | | |

## Sign-off

| Role | Name | Decision (Accept / Accept with conditions / Reject) | Date |
|---|---|---|---|
| TIRDO business owner | | | |
| ICT / project lead | | | |
| Accessibility reviewer | | | |
| Kiswahili content reviewer | | | |
