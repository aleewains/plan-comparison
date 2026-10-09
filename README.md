# Plan comparison: Wheelhouse Clay Studio

A page comparing three memberships of a fictional pottery studio (Drop-in, Regular, Resident) across 15 features, with a control that highlights the features that differ between plans. Built for brief C, "Comparison table for three plans".

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Files

- `index.html` — the page and the full comparison table. The table data lives here only.
- `styles.css` — layout, the narrow-screen reflow, focus styles and the highlight state.
- `script.js` — works out which rows differ by comparing cell values, and runs the highlight toggle.

## How the comparison works on a narrow screen

Below 40rem (640px), each feature row reflows into a block: the feature name sits on its own line, and the three plan values sit side by side beneath it, each labelled with its plan name.

```
Wide                                   Narrow
Feature        Drop-in  Regular  Res.  Clay included
Clay included  None     10 kg    25 kg Drop-in | Regular | Resident
                                       None    | 10 kg   | 25 kg
```

### Why this treatment

The job of the page is to compare plans, feature by feature. Whatever happens on a small screen, the three values for one feature should stay next to each other, so the reader never has to remember a value from somewhere else. I considered four options:

1. **Keep the wide table and let it scroll sideways.** This fails the 320px requirement, and on a phone two of the three plans would sit off screen, which defeats the comparison.
2. **One card per plan, stacked.** Common, but it turns comparing into memorising. To compare clay allowances you would read the value in the first card, then scroll past fourteen other features to find it in the second card.
3. **A plan picker (tabs or a select) that shows one or two plans at a time.** This hides information behind an extra interaction and adds a widget that itself needs keyboard and screen-reader work.
4. **Reflow per feature (chosen).** Each comparison remains a single glance. The feature name gets the full width, so long names never squeeze the values. Three values fit across 320px because they are short, and the copy was written to keep them short.

Since the plan names in the column headers are no longer visible in this layout, each cell shows its plan name as a small label above its value. That label is `aria-hidden="true"`, because assistive technology already gets the column header from the table structure and would otherwise announce the plan twice.

### Keeping table semantics when the layout changes

Setting `display: block` or `display: grid` on table elements makes some browsers (notably Safari and older Chromium) drop the table from the accessibility tree. To prevent that, the markup carries explicit ARIA roles (`table`, `rowgroup`, `row`, `columnheader`, `rowheader`, `cell`) alongside the native elements. The `<thead>` is hidden visually on narrow screens but stays in the accessibility tree, so screen readers still announce "Regular, 10 kg a month" when moving through cells.

## The highlight control

- It is a native `<button>` with `aria-pressed`, so Enter and Space work and screen readers announce it as a toggle button with its state.
- When it is on, rows that differ get three cues at once: a tinted background, a cobalt stripe on the left, and a "Differs" tag. Identical rows get a "Same on every plan" tag. The state is never carried by colour alone, and Windows High Contrast mode keeps the stripe and tag.
- Identical rows are **not hidden**, and their text stays above 4.5:1 contrast. Hiding them would make the table read as if those features did not exist, and someone comparing plans needs to know that, for example, every plan includes the safety induction. This is how the comparison stays understandable while highlighting is active.
- The tags live inside the row headers, so a screen reader moving through the table hears "Clay included, Differs".
- A polite live region reports the change: "10 of 15 features differ between plans."
- Differences are computed from the `data-value` of each cell, so editing the table never leaves the highlight out of date.

## Reviewer checklist

| Requirement | How it is met |
| --- | --- |
| Operable end to end by keyboard, in visual order | DOM order matches visual order at every width. No `tabindex` above 0 and no CSS `order`. Tab order: skip link, three plan buttons, highlight toggle. The table has no interactive content to tab into. |
| Visible focus on every interactive element | A single 3px cobalt outline with an offset via `:focus-visible`, applied globally, including the skip link and the toggle. It meets 3:1 contrast against the background in both light and dark mode. |
| No horizontal scrolling at 320px | Tested at 320, 375 and 1280px: `document.documentElement.scrollWidth` equals the viewport width. Grid columns use `minmax(0, 1fr)`, and long words wrap with `overflow-wrap: break-word` and `hyphens: auto`. |
| Table structure conveyed to assistive technology | Native `<table>`, a `<caption>`, `scope` on all header cells, row headers for each feature, plus explicit ARIA roles to survive the narrow reflow. Verified in Chromium's accessibility tree at 320px: the table, column headers, row headers and cells are all exposed. |
| README explains the narrow-screen handling | This document, above. |

## Also handled

- A skip link to the comparison.
- Light and dark colour schemes; respects `prefers-reduced-motion` and `forced-colors`.
- Typeface: Atkinson Hyperlegible, designed by the Braille Institute for legibility at small sizes. It falls back to system fonts if Google Fonts is unavailable.
- Touch targets of at least 44px for the toggle and buttons.
