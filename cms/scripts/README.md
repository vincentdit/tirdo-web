# CMS scripts

## `gen-seed.mjs` — real-content seed generator

Generates `cms/src/seed-data.generated.json` from the site's single source of
truth, `frontend/src/lib/content.ts`, so the CMS can seed the **real** TIRDO
content (news, departments, services, projects, publications, technologies,
vacancies, tenders) on first boot — published, and through the Strapi document
service (no API token, correct Strapi v5 publish semantics).

### Regenerate the seed

```bash
# from the repo root (Node >= 22)
node cms/scripts/gen-seed.mjs
# Node 22 / 23.5 and older need the type-stripping flag:
node --experimental-strip-types cms/scripts/gen-seed.mjs
```

It writes `cms/src/seed-data.generated.json` and prints per-type counts. Re-run
it whenever `content.ts` changes. A generated copy is committed so you can seed
without running the generator first.

### Seed a database

Seeding runs **only** on an empty collection (`SEED_DATA=true`, idempotent —
each content type is skipped if it already has entries). `cms/src/index.js`
prefers `seed-data.generated.json` and falls back to the bundled demo
`seed-data.js` when the generated file is absent.

```bash
# one-off seed against the configured database, then exit
docker compose run --rm -e SEED_DATA=true cms

# or set it for a normal boot on a fresh DB
SEED_DATA=true docker compose up -d cms
```

After seeding, the CMS bootstrap reindexes OpenSearch automatically, so search
reflects the new content. Verify a few entries in the admin panel, then unset
`SEED_DATA` for subsequent boots.

### Notes

- Only fields present on each content type's schema are emitted, so the
  document service accepts every entry without validation errors.
- `body` fields render as Markdown (richtext); `content.ts` paragraph arrays
  are joined with blank lines. Department sub-sections are appended to the
  department body as bold headings.
- Images reference `/media/...` paths served from `frontend/public/media`;
  they are stored as `imageUrl`/`fileUrl` strings (not uploaded media), matching
  how the frontend getters resolve them.
- Kiswahili translations are seeded separately — see
  `docs/translations/sw-content.md`.
