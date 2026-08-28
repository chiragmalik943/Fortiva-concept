// Every image and the logo mark live in /public and are referenced here by
// path — this file is the ONLY place a filename appears in the codebase,
// so replacing any image or the logo is just replacing the file, no code
// changes needed.
//
// Naming follows the order each image first appears on the page:
// img-1.png is the hero image, img-2.png is next, and so on. No image is
// reused anywhere on the site — every slot below points at a unique file.
//
//   1. Hero
//   2-4. Insurance cards (Individual, Corporate, Family)
//   5. Split section (+ a dedicated img-5-mobile.png used under the sm breakpoint)
//   6-8. FOR section stages (family, employees, you)
//   9-11. Blog cards
//   card-1 .. card-4. Stacked Cards section (each a `-bg` + foreground-cutout pair)
//
// The logo ships as TWO files — logo-color.svg for light surfaces, logo.svg
// for dark ones — each rendered in its own colours. See the entries below.
//
// The Stacked Cards pairs are the one exception to "no image is reused" —
// each card has TWO files that are meant to be the same photograph:
//   img-card-N-bg.png  — the full scene, opaque, any aspect ratio
//   img-card-N.png      — a transparent-background cutout of just the
//                          subject, framed identically to its -bg pair
// StackedCards.tsx renders both at the same size, object-cover, in the same
// spot — the foreground is simply allowed to paint outside the card's top
// edge while the background stays clipped, so the pair only needs normal,
// consistently-framed photos (no special canvas size or extra headroom
// baked into the file); the "breaking out of frame" look comes entirely
// from the scroll-driven scale animation, not from the asset itself.

export const images = {
  hero: `${import.meta.env.BASE_URL}img-1.png`,

  // Hero backdrop — a soft, near-flat arc pattern in the brand's mist blue.
  // Deliberately low-contrast: it sits behind the H1 at full bleed and fades
  // out into `.gradient-hero` before the section ends (see Hero.tsx), so it
  // reads as the top of the page's gradient rather than as a photograph.
  heroBg: `${import.meta.env.BASE_URL}hero-bg.png`,

  // The Fortiva glyph on its own (no wordmark), used as the mark above the
  // hero headline. Single-colour, so it's tinted through mask-image the same
  // way logo.svg is.
  icon: `${import.meta.env.BASE_URL}ftva-icn.svg`,

  insuranceIndividual: `${import.meta.env.BASE_URL}img-2.png`,
  insuranceCorporate: `${import.meta.env.BASE_URL}img-3.png`,
  insuranceFamily: `${import.meta.env.BASE_URL}img-4.png`,

  splitImage: `${import.meta.env.BASE_URL}img-5.png`,
  splitImageMobile: `${import.meta.env.BASE_URL}img-5-mobile.png`,

  forStageFamily: `${import.meta.env.BASE_URL}img-6.png`,
  forStageEmployees: `${import.meta.env.BASE_URL}img-7.png`,
  forStageYou: `${import.meta.env.BASE_URL}img-8.png`,

  blogPost1: `${import.meta.env.BASE_URL}img-9.png`,
  blogPost2: `${import.meta.env.BASE_URL}img-10.png`,
  blogPost3: `${import.meta.env.BASE_URL}img-11.png`,

  // ── The four photo-backed sections added with the 2026 layout pass ──────
  //
  // These six differ from everything above in one important way: the DISSOLVE IS
  // IN THE ARTWORK. Each one arrives already fading into a flat background, and
  // each one already carries the Fortiva mark or the lotus lattice where the
  // layout calls for it. Nothing in the code draws a mark over a photograph any
  // more, and the CSS masks that remain are slight — they only take the flat
  // background off where it meets a section of a different colour.
  //
  // Which means replacing one of these is not simply swapping a photo: a
  // replacement has to carry the same treatment, or the section it lands in will
  // look like a rectangle. Each entry says what its slot expects.
  //
  // FeatureReveal's full-bleed backdrop, one per instance. Three files rather
  // than one shared photo because no image on this site is reused anywhere —
  // see the note at the top of this file.
  //
  // EXPECTS: a soft dissolve to white out of the bottom-LEFT corner, which is
  // where the heading, lead and button sit. FeatureReveal's own mask opens that
  // corner by about a third more; it does not take the picture to white, so an
  // asset with a dark bottom-left will put navy type on a dark photograph.
  // img-12 and img-13 are the reference for the treatment; img-14 currently has
  // no dissolve of its own and is the one to re-export.
  featureIndividuals: `${import.meta.env.BASE_URL}img-12.png`,
  featureEmployers: `${import.meta.env.BASE_URL}img-13.png`,
  featureVirtualCare: `${import.meta.env.BASE_URL}img-14.png`,

  // About → Guided by principles. A FULL-SECTION composition, 1440 x 913, not a
  // photograph to be arranged: the consulting-room shot, the lotus lattice panel
  // down its right edge, and its own dissolve on the left and at the foot. It is
  // rendered full bleed with the white mission disc laid over it.
  //
  // EXPECTS its flat background to be #FFFFFF (or real transparency) — the
  // section is white. The delivered file is flattened onto cream #ECEAE1, which
  // About.tsx masks off; see PRINCIPLES_PHOTO_MASK there for what that mask can
  // and cannot reach.
  principlesPortrait: `${import.meta.env.BASE_URL}img-15.png`,

  // About → Powered by values. Left of the card stack.
  //
  // The one asset here with real TRANSPARENCY, and it needs it: the section is a
  // cream-to-blue gradient and the subjects stand on it directly. The Fortiva
  // mark is composited in behind them.
  //
  // EXPECTS: transparent background, mark included, subject full-height. Drawn
  // `object-contain` into a portrait column, so a square or portrait frame keeps
  // the mark's petals whole — a wide frame would have them cropped.
  valuesPortrait: `${import.meta.env.BASE_URL}img-16.png`,

  // For Members → Find a Doctor → Before you go in. Right of the question list,
  // with the mark composited in.
  //
  // EXPECTS: flattened onto WHITE, dissolving to white on its left and at its
  // foot. It sits on the cool end of a gradient band, and the page renders it
  // `mix-blend-multiply` so the white takes the gradient's colour exactly —
  // which is why white specifically, and why no transparency is needed. See the
  // note on that section in MembersFindDoctor.tsx.
  doctorTipsPortrait: `${import.meta.env.BASE_URL}img-17.png`,

  cardOneBg: `${import.meta.env.BASE_URL}img-card-1-bg.png`,
  cardOne: `${import.meta.env.BASE_URL}img-card-1.png`,
  cardTwoBg: `${import.meta.env.BASE_URL}img-card-2-bg.png`,
  cardTwo: `${import.meta.env.BASE_URL}img-card-2.png`,
  cardThreeBg: `${import.meta.env.BASE_URL}img-card-3-bg.png`,
  cardThree: `${import.meta.env.BASE_URL}img-card-3.png`,
  cardFourBg: `${import.meta.env.BASE_URL}img-card-4-bg.png`,
  cardFour: `${import.meta.env.BASE_URL}img-card-4.png`,

  // TWO logo files, not one tinted two ways.
  //
  // logo.svg is white artwork (fill="white"), for dark surfaces — the footer.
  // logo-color.svg is the full four-colour mark (#0074A6 / #46545A / #D5AC67 /
  // #12284B), for light surfaces — the top nav.
  //
  // The pair replaces a single-file mask-tint: masking throws away an SVG's
  // own fills by definition, so a multi-colour mark cannot survive it. See
  // Logo.tsx. Note the two files have DIFFERENT viewBoxes (221x55 against
  // 730.2x171.41), which is fine because Logo sizes by width with h-auto.
  logo: `${import.meta.env.BASE_URL}logo.svg`,
  logoColor: `${import.meta.env.BASE_URL}logo-color.svg`,

  forMask: `${import.meta.env.BASE_URL}for-mask.svg`,

  // The five app screens shown inside the phone mockup on For Members →
  // Download the App, in the order the feature list presents them.
  //
  // An array rather than five named slots because they genuinely are a sequence:
  // PhoneShowcase takes one screenshot per feature and the nth screen belongs to
  // the nth feature, so a named slot per screen would only be five chances to
  // pair them up wrongly.
  //
  // Export target is ~9:18.8 — 1179 x 2461, say. That is NOT a stock iPhone
  // capture ratio (9:19.5): the redesigned device is 630:1266 with a 3.5% bezel,
  // which leaves a slightly squarer aperture than a real phone has. A 9:19.5
  // capture still works, `object-cover` just trims ~3% off the top and bottom —
  // fine for a screenshot with padding at both ends, not fine for one with a
  // status bar or a tab bar hard against the edge.
  appScreens: [1, 2, 3, 4, 5].map((n) => `${import.meta.env.BASE_URL}app-scr-${n}.png`),

  // The six screens shown in the portal window's content area on For Members →
  // Member Portal, in the order the sidebar lists them. An array rather than six
  // named slots for the same reason as `appScreens`: they genuinely are a
  // sequence, and the nth screen belongs to the nth section.
  //
  // EXPECTS: just the portal's CONTENT AREA, not the whole application — the
  // window's chrome and its sidebar are drawn by PortalShowcase. Landscape,
  // roughly 3:2 (say 1200 x 800); the aperture is `object-cover object-top`, so a
  // taller capture loses its bottom rather than its top.
  portalScreens: [1, 2, 3, 4, 5, 6].map((n) => `${import.meta.env.BASE_URL}portal-scr-${n}.png`),

  // One image of the WHOLE portal — chrome, sidebar, content — for the mobile
  // layout, where the window and its scroll-driven sidebar are replaced by a
  // single picture with the six sections listed underneath it. See
  // PortalShowcase.tsx.
  portalOverview: `${import.meta.env.BASE_URL}portal-overview.png`,

  // ── The half-window photo panels ────────────────────────────────────────
  //
  // The four `ImageBand` sections. Unlike everything else photographic on this
  // site these need NO treatment at all — no dissolve, no baked-in fade, no
  // transparency. ImageBand neither masks nor frames them: each one fills half
  // the window, full height, bleeding off its own edge with a straight cut down
  // the middle where the copy starts.
  //
  // EXPECTS: an ordinary, uncropped, un-faded photograph, roughly SQUARE TO
  // PORTRAIT — 1200 x 1400 is a good target. The panel it lands in is about
  // 720px wide on a 1440px window and between 660px and 780px tall depending on
  // how much copy sits beside it, so the aspect it is asked to fill moves a
  // little from section to section. It is drawn `object-cover object-center`,
  // which means it is cropped from the edges rather than letterboxed: keep the
  // subject away from all four margins and any crop is safe. Pass
  // `imagePosition` at the call site if a particular photo needs anchoring.
  //
  //   18. Broker Overview → "FOR you. FOR your clients. FOR change."
  //   19. Broker Overview → "FOR the future of health insurance"
  //   20. Broker Resources → the support band under Plan Documents
  //   21. Broker Portal → the "more than a dashboard" band
  brokerPartner: `${import.meta.env.BASE_URL}img-18.png`,
  brokerFuture: `${import.meta.env.BASE_URL}img-19.png`,
  brokerSupport: `${import.meta.env.BASE_URL}img-20.png`,
  brokerPortalPhoto: `${import.meta.env.BASE_URL}img-21.png`,

  // The Broker Portal's three screens, in the order its sidebar lists them, plus
  // the whole-portal image the mobile layout shows instead of the window. Exactly
  // the contract `portalScreens` / `portalOverview` carry above — content area
  // only for the three, everything for the overview.
  brokerPortalScreens: [1, 2, 3].map(
    (n) => `${import.meta.env.BASE_URL}broker-portal-scr-${n}.png`,
  ),
  brokerPortalOverview: `${import.meta.env.BASE_URL}broker-portal-overview.png`,

  // The Available States dot map, in two halves. This one is the static grey
  // grid for the 44 states Fortiva doesn't name — a single <path>, drawn as a
  // plain <img> so half a megabyte of path data stays out of the JS bundle and
  // caches like any other image. The six interactive states are NOT here: their
  // dots are inlined in components/AvailableStates/mapStates.ts so React can
  // address each one. Both halves share the artwork's 736 x 542 viewBox, which
  // is what keeps the <img> and the <svg> overlay in register at any width.
  // Generated from public/map.svg, which stays in the repo as the source of
  // truth — see mapStates.ts if the artwork is ever redrawn.
  availabilityMapBase: `${import.meta.env.BASE_URL}map-base.svg`,
}
