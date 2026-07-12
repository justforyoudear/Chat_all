# Three-Panel Pagination Design

## Goal

Show at most three model panels at once while retaining a selected total of one through six models. For totals four, five, and six, expose two pages with distributions `3 + 1`, `3 + 2`, and `3 + 3`.

## Interaction

The existing one-to-six layout selector remains the total-model selector. When the total exceeds three, the header shows previous and next icon controls plus a `1 / 2` page indicator. Selecting a different total resets to page one. Totals one through three hide the pager. Both pages use the same three-column grid, so the second page preserves the first page's panel width and height and leaves unused grid cells blank.

## Session And Sending Behavior

Every physical slot remains mounted while its page is hidden. This preserves the existing Electron WebView element, provider registration, and official website session URL across page changes. The bottom composer continues to receive the total slot count, so it sends a prompt to all selected models, including those on the inactive page.

## Component Boundaries

- `src/App.vue` owns the active page and renders the pager.
- `src/components/Messages/ChatMessages.vue` maps the total count and active page to visible slot count and grid columns.
- `src/components/Messages/EmptyModelSlots.vue` renders all physical slots but hides those outside the active page without unmounting them.
- `src/components/Footer/FooterBar.vue` remains unchanged because its existing `slotCount` input is the total selected panel count.

## Acceptance Criteria

- With four, five, and six total panels, page one shows exactly three panels and page two shows one, two, and three panels respectively.
- No page causes document-level vertical scrolling at the current viewport.
- Switching pages retains the same Electron WebView elements and provider IDs.
- Bottom sending continues to target all selected models, not only the visible page.
