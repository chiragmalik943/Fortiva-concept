/**
 * The numbers and media queries shared by the three sections that pin
 * themselves: FeatureReveal, PhoneShowcase and ScrollSpyList.
 *
 * They live in one module because each one is a value that has to agree with
 * something else — a Tailwind breakpoint, another query in the same file, or a
 * measured section height — and three copies of that is three chances to drift.
 *
 * ── What "pinned" means here ────────────────────────────────────────────────
 * The section sticks to the viewport at `top top` and stays there while the
 * scroll drives its reveal from 0 to 1; when the reveal finishes the section
 * releases and the page carries on. Because the section is exactly `100vh` tall,
 * "its top has reached the top of the viewport" and "it is fully in the
 * viewport" are the same moment, which is what makes `start: 'top top'` the
 * honest answer to "don't start until it's all on screen".
 *
 * ── Why there are three queries and not one ─────────────────────────────────
 * Pinning an element taller than the viewport clips its bottom — that is the
 * reason an earlier version of FeatureReveal abandoned pinning, and it is still
 * true. So pinning is conditional on there being room for it, and the two
 * fallbacks are the behaviour these sections already had:
 *
 *   PIN      — wide and tall enough: pin, and let the `pin:` Tailwind variants
 *              trim the section to fit the viewport it is about to occupy.
 *   UNPINNED — wide but too short: no pin, and the reveal runs against the
 *              section's own passage through the viewport, exactly as before.
 *   MOBILE   — under `lg`: no two-column layout to hold still, so no set-piece.
 *
 * The three are mutually exclusive and cover everything, which matters because
 * `gsap.matchMedia` builds and tears down whichever one applies: an overlap
 * would run two reveals over the same elements, and a gap would run none.
 *
 * 760px is not arbitrary. Measured with the `pin:` trims applied, the tallest of
 * the five pinned instances needs a 742px window to fit under the floating nav
 * with its bottom padding intact; 760 is that plus a little, and every other
 * instance clears it by 50px or more.
 */

/** Must stay identical to the `pin` screen in tailwind.config.js. */
export const PIN_QUERY = '(min-width: 1024px) and (min-height: 760px)'

/** Wide enough for the layout, too short to pin. */
export const UNPINNED_QUERY = '(min-width: 1024px) and (max-height: 759.98px)'

/** Below the two-column layout entirely. */
export const MOBILE_QUERY = '(max-width: 1023.98px)'

/**
 * Scroll each step of a pinned reveal consumes.
 *
 * While pinned the section does not move, so this buys dwell at the cost of
 * page length and nothing else — which is why it can be this generous. 600px is
 * well past the ~360px an unhurried wheel flick travels, so a single gesture
 * cannot clear a step. The bill: five cards or five list items add 3000px to a
 * page, three panels add 1800px.
 */
export const PX_PER_STEP = 600

/** Total pin length for a sequence of `steps` steps. */
export const pinDistance = (steps: number) => steps * PX_PER_STEP

/**
 * Which step a 0..1 progress is in. `progress` reaches exactly 1 at the end of
 * the pin, which would index one past the last step.
 */
export const stepFromProgress = (progress: number, steps: number) =>
  Math.min(steps - 1, Math.max(0, Math.floor(progress * steps)))
