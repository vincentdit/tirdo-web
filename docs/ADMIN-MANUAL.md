# CMS administrator & editor manual

For staff who manage content in the Strapi CMS. The public website reads its
content from here; changes appear on the site within about a minute (content is
cached for ~60s).

## Signing in

Open `http://<host>:1337/admin` and sign in with your Strapi admin account.
Roles and permissions are managed under **Settings → Administration Panel →
Roles**. (For public-facing staff SSO the site uses Keycloak; the CMS panel is a
separate admin login.)

## Draft & publish

Every content type has **Draft** and **Published** states. Editing creates a
draft; the site shows only **Published** entries. Save your work as a draft,
review, then **Publish**. This is the approval gate — see the editorial roles
note below.

## Content types

Content Manager lists each type. Common fields: **Title**, **Slug** (auto-filled
from the title — keep it stable once published; it is the page URL), a summary
and a rich-text body where present.

- **Article (News)** — news & announcements. Fields include category, date,
  cover image, excerpt. Appears under `/news`.
- **Research Project** — status (Ongoing / Completed / Featured), department,
  research area, year, funder, cover. Appears under `/projects` (filterable by
  research area and status).
- **Publication** — type, year, and metadata: abstract, authors, keywords
  (a JSON list), DOI, citation, and the file. Appears under `/publications`.
- **Service** — the services catalogue (`/services`).
- **Department** — divisions and their sections (`/departments`).
- **Vacancy** — category, department, location, description, body (JSON list of
  bullet points), **closing date**, apply URL. Appears under `/careers`.
- **Tender** — reference, category, description, **closing date**, document.
  Appears under `/tenders`.
- **Page** — simple standalone pages.

### Auto-archive (vacancies & tenders)

A vacancy or tender is shown as **Open** until the end of its **closing date**,
then automatically becomes **Closed** and drops out of the default list (site
visitors can still reveal closed items with a toggle). Set the closing date
correctly — no manual archiving is needed.

## Media & files

Upload images and documents via the media field on each entry or the **Media
Library**. Files are stored in MinIO. Use descriptive file names and add
**alternative text** to images for accessibility.

## Keeping search fresh

Content edits are indexed for search automatically. After a large import, force
a full rebuild: `POST http://<host>/api/search/reindex` (include
`x-reindex-token` if `AUDIT`/`SEARCH_ADMIN_TOKEN` is set).

## The audit log

Every create / edit / delete / publish is recorded in an **append-only, tamper-
evident Audit Log** (Content Manager → Audit Log, read-only) with who did what
and when. It cannot be edited or deleted. Integrity can be checked at
`GET /api/audit-log/verify`. See `docs/AUDIT-LOG.md`.

## Bilingual content

The site interface is bilingual (English / Kiswahili). Long-form page bodies are
currently English; when Kiswahili translations are provided they are maintained
as translated fields in the CMS (see `docs/I18N.md`). Coordinate with the ICT
team before authoring large amounts of content so translations are captured.

## Editorial workflow & roles

Recommended flow: **Author** creates and edits drafts → **Editor/Approver**
reviews and **Publishes**. Configure these under Settings → Roles: an Author
role with create/update but not publish, and an Editor role that can publish.
The audit log is the record of who published what. (Multi-stage review
automation is a Strapi Enterprise feature; the draft/publish gate plus the audit
trail covers the Community Edition.)

## Common tasks

- **Post news**: Content Manager → Article → Create → fill title, excerpt, body,
  date, cover → Save → Publish.
- **Advertise a vacancy**: Vacancy → Create → set category, department, closing
  date, apply URL → Publish. It shows under `/careers` and auto-archives.
- **Publish a tender**: Tender → set reference, category, closing date, upload
  the document → Publish.
- **Add a publication**: Publication → set type, year, authors, abstract,
  keywords, DOI, upload the PDF → Publish.
- **Unpublish**: open the entry → **Unpublish** (it disappears from the site but
  stays in the CMS and the audit log).
