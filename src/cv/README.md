# The CV's entries

Every `.md` file in this folder is part of /resume/. The page builds itself
from them, so **to change the CV, edit these files**. You don't need to
touch `src/pages/resume.njk`. This folder publishes no pages of its own
(`cv.json` sees to that), and this README is not an entry.

The file name is the entry's id: `jireh.md` is `/resume/#jireh`, and the
timeline links to it by that name. Rename a file and links to it change too.

## Cards and rows

Every card answers two questions, always in the same place:

- **Left, the card: who was I, where, when.** Two lines, always shown, one
  square: your role ("UX researcher"), then where and when ("Jireh Health ·
  2025–26"; without an `org`, the `type`: "Independent · 2025 – present").
  Once a row is open, the kind of work and how long ("Full-time · 1 yr 6
  mos"), the roles held, `about` and skills join it.
- **Right, the rows: what did I make.** One row per *deliverable*, each one
  square tall: its mockup, its name (`title`, with ↗ if it has a case
  study), and its years if they differ from the card's. Click it and it
  opens in place: its `about`, story, skills and tools, a "Read the case
  study" link, and images.

Write in sentence case ("UX researcher", "User research"). Write tools as
their makers do: U-Net, GeoPandas, iOS, MUI, scikit-learn. The page shows
them exactly as written.

So a card's file describes the job, and each row's file one thing you
made in it. **A job gets one row per role**: one, unless you changed role
there (Leja, where you were promoted, has two). A card of projects gets one
row per project.

| You want…                             | Do this |
|---------------------------------------|---------|
| A job (Jireh)                         | A card file (`title` is your role) and one row file, `parent: jireh`, named for what you made. |
| A promotion at one org (Leja)         | Put the roles in the card's `roles:` list (newest first) instead of `title`, and give each role its own row (newest first, with its dates). |
| A set of projects (Data science)      | A card file, and one file per project. |
| Many small jobs (Freelance)           | A card file with `rollup: true`, and one file per deliverable. Name it for what it was *and* who it was for ("UNFCCC Champions position paper"); `org` is the client. Projects for the same client stay together. |

Headings: your name is the page's `h1`; Career timeline, Experience and
Education are `h2`; each card's role is an `h3`; each row an `h4`.

Cards are listed by when they ended (current ones first). Rows are listed
newest first; two that start in the same month (or rows without dates) are
ordered by `order:` (lower first). **A row without dates shows its card's
years**, except in a roll-up, where each project needs its own.

**An open row only adds what isn't already on screen**: the client is in
the row's name (or the card's heading) and your role in its verb (or the
card's roles), so neither is repeated. It reads: a "Volunteer" label (a row
with `type: Volunteer`), its `about`, the story, its skills and tools, the
case-study link, then the images.

**Name each row for what you did**, starting with a verb or the
discipline: "Built a satellite land-cover change monitor", "UI/UX design for
CarNayo's driver and passenger apps", "Laid out the 300-page Kenya Energy
Atlas for SID". Up to two lines show (about 75 characters); longer is cut
short with "…". Outcomes and numbers go in the text below it, which shows
when the row opens.

**The thumbnail** is the row's first image, shown whole (never cropped,
since it's a mockup of the end result) in a slot two squares wide and one
tall. Phone screens (`phone: true`) show the first three side by side.
Editorial work should show an open spread rather than its cover: set
`thumb:` to a spread image. A row with no images shows an empty frame.

**On the grid.** Everything lines up with the mat's squares by itself:
lines, frames, buttons and blocks of text are rounded up to whole squares.
Nothing in these files needs adjusting for it.

## The fields

```yaml
---
# A card (a job)
type: Full-time               # the small label above the title (Freelance, Volunteer…)
title: UX researcher          # your role (or `roles:` for several, below)
roles:                        # several roles at one org, newest first
  - { title: Product designer, start: 2022-11, end: 2025-06 }
  - { title: Design associate, start: 2022-02, end: 2022-10 }
org: Jireh Health             # who it was for: the line under the role reads "Jireh Health · 2025–26"
short: Jireh                  # optional: a shorter name for the timeline
start: 2025-04                # YYYY-MM
end: 2026-09                  # YYYY-MM, or `present`; leave out for one month
about: One line on the job or the product.      # optional, shown once open
tags: [User research, Prototyping]              # optional
timeline: { lane: product }   # optional; see below
section: education            # optional: put the card under Education instead
rollup: true                  # optional: a card of many small jobs
---

---
# A row (a deliverable)
parent: jireh                 # the card's file name
title: "Research and UI/UX design for a healthcare-financing web app"   # what you did: up to two lines
start: 2025-04                # optional: else the card's years
end: 2026-09
link: /projects/jireh-health/ # optional: its case study (adds ↗)
thumb: /assets/images/…       # optional: the thumbnail, if not its first image
thumbPhone: true              # with `thumb`: it's a phone screen
note: out in the world!       # optional: the handwritten note on the images
tags: [Figma]                 # optional
images:                       # optional; shown in a sideways reel (not in print)
  - { src: /assets/images/resume/jireh/jireh-phone-1.png, phone: true, alt: "What the image shows" }
---
Worked from PM-defined acceptance criteria through to engineering handoff.

- Redesigned signup, cutting median signup time from 5.2 to 2.1 mins (−59%).
```

Below the `---` lines, write ordinary Markdown: a paragraph, `- bullets`,
two-space indented `- sub-bullets`, and `[links](https://…)`.

The dates are written once, and the page works the rest out from them:
"Apr ’25 – Sep ’26 · 1 yr 6 mo", the words a screen reader hears, and where
the bar sits on the timeline.

- **Quotes.** Put a value in `"double quotes"` if it contains a colon
  (`alt: "Karura Forest: reference map"`). Apostrophes are fine inside them.
- **`phone: true`** puts a screenshot in the phone mockup.
- **To hide an entry** without deleting it, add `published: false`.

## The timeline

A card or a row appears on the timeline (Fig. 1) if it has dates and a
`timeline:` line:

- `lane` is one of the lanes listed in `src/pages/resume.njk`'s front matter
  (`data`, `product`, `editorial`). Add, rename or reorder lanes there.
- Bars are stacked in their lane automatically, so labels never overlap.
  To force one onto a row, add `row:` (`timeline: { lane: product, row: 2 }`).
- Roles are heavy, bright bars. The projects of a roll-up (the freelance
  work) are not drawn one by one: a lane with two or more becomes ONE
  hairline, "Freelance ×N", with a tick at each project's own dates (so a
  gap on the line is a gap in the work). A lane with a single project draws
  it as a short bar.
- The bar is labelled with `short`, or else `org`, or else `title`.
- **The panel under the chart** shows the entry pointed at (a preview) or
  clicked (kept; the job you're in now to begin with): role, org, dates,
  `about`, tags, up to three thumbnails, and links to the full card and its
  case study. A freelance bar lists its projects; pick one to read it. It
  is built from the same fields as the cards, so there is nothing extra to
  write.
- **The lane names** on the left axis: point at one and the other lanes
  fade (click or tap keeps it). The cards below are never filtered.
- **On a phone** the chart is a strip with no sideways scroll: each lane's
  name above its bars, the panel below.

"Today" moves by itself each time the site is built.

## On paper

"Save as PDF" (and printing) uses `src/assets/css/cv-print.css`: black on
white, no images or timeline, every row opened, case-study links
printed as addresses.

## Motion

Rows open and close smoothly, cards rise into place as they scroll in, the
timeline draws itself in, and pages slide like sheets of paper being
swapped on the mat. All of it is in `src/assets/css/style.css` (search
"Motion"), and none of it happens for visitors who've asked their device
for reduced motion.
