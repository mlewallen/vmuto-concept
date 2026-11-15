# Design Critique: Liberty Fitness — site + member app concept (v1)

Reviewed at 375×812 (phone) and 1440×900 (desktop), in a browser, against `index.html`, `styles.css`, `main.js`, `brand.js`.
Stage: early concept / exploration, so the focus is on structure, flows and mobile behaviour more than final polish.

### Overall Impression
Strong, confident brand voice. Big condensed headlines, one electric accent, copy that sounds like a person. The brand-as-config architecture (`brand.js`) is smart. The biggest opportunity is that this is a desktop-first page squeezed down to mobile. On a phone you get no navigation, two fixed UI layers that cover the content, and an app demo whose controls take a third of the screen. The site also stops short of what a prospective member needs before they will join: who the coach is, what's in the gym, where it is, what it costs (or when they'll know), and answers to the obvious questions.

### Usability
| Finding | Severity | Recommendation |
|---|---|---|
| Below 820px the primary nav is `display:none` and nothing replaces it. Phone visitors can't jump to Training or Memberships. | 🔴 Critical | Add a menu button that opens a full-height nav sheet. Add a sticky bottom CTA bar ("Join the founding list") once the hero scrolls away. |
| The fixed "Brand" pill sits bottom-left over content: it covers hero facts on the site and the unlock button in the app. | 🔴 Critical | Move brand controls into the header as a small icon button. Open them as a bottom sheet on phones and a side panel on desktop. Hide the button in installed (standalone) mode. |
| In the app on mobile, the demo clock panel fills the top ~30% of the screen, so the "phone" never looks like a phone. | 🔴 Critical | On phones, collapse demo controls behind a "Demo" chip in the app header that opens a sheet. On desktop keep the side panel next to the device frame. |
| Booking, cancelling and switching plans happen on a single tap with no confirmation and no undo. Switching plans is a billing change. | 🟡 Moderate | Show a confirmation sheet before booking or changing plans that spells out the consequence (e.g. "Door access changes from 24/7 to around booked sessions"). Confirm with a toast that has an Undo. |
| The site never shows who the coach is beyond a one-line credential. Training is the differentiator and it gets no story. | 🟡 Moderate | Add a coach section with bio, credentials and a three-step "how coaching works" (Assess → Program → Train). |
| No FAQ, location or hours detail, and no "how 24/7 access works" walkthrough. These are the main objections for a new 24/7 gym. | 🟡 Moderate | Add a How it works stepper, an FAQ accordion and a Visit block (address TBA, parking, staffed hours). |
| Pricing is "to be set" with nothing to act on. | 🟡 Moderate | Frame it as a founding offer: perks for joining the list early, plus a comparison of what each plan includes. |
| The member app has no training content (program, workout log, progress), even though coaching is half the business. | 🟡 Moderate | Add a Program tab with today's workout from the coach, sets you can check off, and a week strip. |
| Form errors show only in one summary line; fields aren't marked invalid. | 🟡 Moderate | Validate each field inline with `aria-invalid` and messages tied by `aria-describedby`. Show a clear success state. |
| Loading the page with a hash (e.g. `#memberships`) doesn't scroll there reliably because the web fonts are still loading. | 🟢 Minor | Scroll after `document.fonts.ready`, and give sticky headers a `scroll-margin-top`. |
| Tab bar items are text only. | 🟢 Minor | Add icons above the labels, a standard pattern that's quicker to scan. |

### Visual Hierarchy
- **What draws the eye first:** the "TRAIN ON YOUR TERMS." headline. Correct. On a phone, though, the ticker plus the large "Member app" button compete with it before you reach it.
- **Reading flow:** hero → two paths → gym → training → tiers → app → join is logical. On mobile the two "path" tiles are 360px+ of near-empty dark gradient each, which pushes real content far down.
- **Emphasis:** the hero eyebrow repeats the location ("Lewiston, New York · Opening in Lewiston — date to be announced") and wraps to two lines on a phone. The primary "Member app" button in the header outranks "Join", but prospects are the main audience before opening.

### Consistency
| Element | Issue | Recommendation |
|---|---|---|
| Section numbering | "01/02" are on tiles, "03–07" on bands. The numbering reads as decorative, not as navigation. | Keep the numbers but tie them to the in-page nav so they mean something, or drop them. |
| Header CTA | Solid accent button points to the member app. The hero's primary CTA points to the join form. | Header CTA = "Join". Make member app access a secondary text link ("Member login"). |
| Radius | Inputs use `min(radius,12px)`, cards use `radius`, and the brand panel uses `min(radius,20px)`. | Use one radius scale (sm/md/lg) derived from the theme radius. |
| Spacing | Several one-off values (28/24/18/16 paddings). | Use a 4-pt spacing token scale. |

### Accessibility
- **Color contrast:** body muted `#5F6368` on white is 6.0:1 and on the surface colour 5.4:1, both passing. White on accent `#1F4BFF` is about 6.3:1, passing. The muted-on-inverse text at 68% opacity is fine on black but should be checked over the blue gradient, which is borderline at the top-right of the hero.
- **Touch targets:** several fall below 44px. Header wordmark 29px, header button and tier buttons 42px, checkboxes 20px (the label helps, but the row isn't padded), footer Instagram link 17px. The 7-column day picker cells are about 44px wide at 375px, which works but is tight.
- **Text readability:** 16px body with 1.55 line height is good. The 12px uppercase eyebrows with letter spacing are at the lower limit. 13px is safer.
- **Motion:** the ticker runs forever. `prefers-reduced-motion` is honoured, which is good, but there's no pause control (WCAG 2.2.2) for people who don't set that preference.
- **Day picker** uses `role=tab` without `tabpanel` or arrow-key handling. A plain button group with `aria-pressed` is more accurate.

### What Works Well
- The brand-as-config pattern: one file re-skins the site and the app, and the live Brand panel makes client reviews fast.
- Hold-to-unlock has a real progress ring, keyboard support and `aria-live` results. It's a tangible way to demo the core product idea.
- The access rule (plan + booking + time → door) is modelled honestly and explained in plain language when entry is denied.
- The copy is specific and human ("someone who notices when you skip a week").
- Respects reduced motion, has a skip link, uses semantic sections.

### Priority Recommendations
1. **Rebuild the mobile shell first.** Menu sheet, sticky join bar, brand controls moved into the header, app demo controls behind a chip. This fixes all three critical issues at once.
2. **Answer the prospect's questions on the site.** Coach story and process, gym and equipment, how 24/7 entry works, founding-member perks, a plan comparison, FAQ, location. Then a better join form with inline validation.
3. **Make the app a full member experience.** A Today/Key home with occupancy and recent entries, booking with confirmation and undo, a Program tab with today's workout, plan changes that explain their access consequences, and a profile with stats and notification preferences.
