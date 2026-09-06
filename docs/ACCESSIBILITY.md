# Accessibility (WCAG 2.1 AA)

The public site targets **WCAG 2.1 Level AA**, an e-GA requirement for
Government of Tanzania digital services.

## Audit result

An automated audit with **axe-core** (WCAG 2.0/2.1 A & AA rule sets) across 15
key pages (home, about, board, departments + detail, services + detail,
projects, publications, careers, tenders, contact, search, news, analytics)
went from **81 violations to 0**.

Re-run it any time:

```bash
# terminal 1 — serve a production build
cd frontend && npm run build && npm run start

# terminal 2 — audit (uses playwright + @axe-core/playwright)
node audit.js            # see scripts/a11y or docs for the script
```

## What was fixed

**Colour contrast (77 nodes).** The brand gold (`#f2c500`) fails contrast as
text on white (ratio 1.66:1). Gold is now used only for fills (badges, buttons,
hero accents); gold *text on light backgrounds* was changed to the brand teal.
The teal token was darkened slightly (`#007e93` → `#006979`, `--primary` L29%→L25%)
so teal text clears 4.5:1 on white and on the pale section background. On the
teal page banners, low-opacity white text was raised to `text-white/90` and the
on-teal link hover uses gold.

**Form labels (4 nodes).** The contact form's `<label>`s are now associated
with their inputs via `htmlFor`/`id`, with `autoComplete` on name/email.

## Beyond the automated audit

- **Reduced motion (WCAG 2.3.3):** a global `prefers-reduced-motion` rule
  neutralises animations/transitions, and the hero carousel does not
  auto-advance for users who prefer reduced motion.
- **Pause control (WCAG 2.2.2):** the hero carousel has a visible pause/play
  button; auto-advancing content can be stopped.
- **Decorative images:** the hero background images use empty `alt` +
  `aria-hidden` (the headline is real text), and the carousel exposes
  `aria-roledescription`, per-dot `aria-label` and `aria-current`.
- Existing good practices retained: a skip-to-content link, `<html lang>` that
  follows the active locale, semantic landmarks (`header`/`nav`/`main`/`footer`),
  visible focus rings, and `aria-label`s on icon-only controls.

## Maintaining AA

- Don't use `text-accent` (gold) for text on light backgrounds — use
  `text-brand-teal` or `text-primary`. Gold is for `bg-*` fills.
- New form fields need an associated `<label htmlFor>`.
- New auto-moving or animated UI must respect `prefers-reduced-motion` and, if
  it moves for more than 5s, offer a pause control.
- Re-run the axe audit before shipping visual changes.
