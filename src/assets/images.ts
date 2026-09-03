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

  // ── The other three hero backdrops ────────────────────────────────────────
  //
  // The same arc pattern as `heroBg`, re-exported in three more surfaces, so an
  // interior page can open gold, dark or sky instead of mist. PageHero picks one
  // by its `tone` prop and NOTHING else about the section is hard-coded to a
  // colour — the surface it dissolves into, the mark's ink, the headline, the
  // lede and the floating nav's own ink all come from the same token set. See
  // HERO_TONES in components/PageHero/heroTone.tsx.
  //
  // All four carry the pattern at the SAME low contrast the mist one does
  // (roughly a 3% lightness step between the arcs and the field), which is what
  // lets the type sit straight on them with no scrim.
  //
  // That contract is now the ONLY thing holding the heroes up: PageHero used to
  // mask the backdrop away across the bottom third of the section and there is no
  // mask and no wash any more, so each of these is painted flat, corner to
  // corner, under live type. A replacement with more contrast than a ~3% step
  // between its lightest and darkest area will need a scrim adding back.
  //
  //   gold — #DDAF69, the brand gold. Navy ink.
  //   dark — #11284B..#0E2445, the brand navy. Light ink.
  //   sky  — #A9CEDB, the pale blue. Navy ink.
  //   teal — #0074A6, the logo's own teal. Light ink.
  heroBgGold: `${import.meta.env.BASE_URL}hero-bg-gold.png`,
  heroBgDark: `${import.meta.env.BASE_URL}hero-bg-dark.png`,
  heroBgSky: `${import.meta.env.BASE_URL}hero-bg-sky.png`,
  heroBgTeal: `${import.meta.env.BASE_URL}hero-bg-teal.png`,

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

  // Provider Overview → Our commitment to providers. The fourth FeatureReveal
  // backdrop, and the same contract as the three above it — soft dissolve to
  // WHITE out of the bottom-LEFT corner, where the heading, lead and button sit.
  // Its section is deliberately white rather than tinted so that this stays true;
  // see the note on that section in pages/ProvidersOverview.tsx.
  //
  // One note on subject matter: the copy beside it is about a practice's time, so
  // the picture wants a practice at work rather than a patient being reassured.
  featureProviderCommitment: `${import.meta.env.BASE_URL}img-23.png`,

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
  // It replaces img-16.png, and its slot changed with it: that section is now a
  // flat #CCD0D2 grey rather than the cream-to-blue gradient it used to be, so
  // the asset no longer has to survive a moving background.
  //
  // EXPECTS: transparent background (or flattened onto #CCD0D2), the Fortiva mark
  // composited in behind the subjects, subject full-height. Drawn `object-contain`
  // into a portrait column, so a square or portrait frame keeps the mark's petals
  // whole — a wide frame would have them cropped.
  valuesPortrait: `${import.meta.env.BASE_URL}about-value.png`,

  // For Members → Find a Doctor → Before you go in. LEFT of the question list
  // now, not right, and running the full height of the section with the mark
  // composited in behind the subject.
  //
  // EXPECTS: flattened onto WHITE. It sits on a #CCD0D2 → white ramp and the page
  // renders it `mix-blend-multiply`, so every white pixel takes the ramp's own
  // colour exactly — which is why white specifically, and why the asset needs no
  // transparency and no mask.
  //
  // Its PROPORTIONS are part of the layout, so re-crops are not free. The file is
  // 930 x 933 with its artwork spanning x 11.2%..88.8% — near-square, and
  // symmetric. It is drawn `h-full w-auto`, so the section's height sets the width
  // and the artwork's own 11% margin is most of the breathing room on the left;
  // the section adds 40px (`lg:left-10`) on top. A re-crop that changes the ratio
  // or moves the artwork off centre changes how far the picture reaches under the
  // copy — re-measure and adjust there. See the note on that section in
  // MembersFindDoctor.tsx, which records what the previous 1114 x 933 crop needed.
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

  // The six screens shown in the window on For Members → Member Portal, in the
  // order the tabs list them. An array rather than six named slots for the same
  // reason as `appScreens`: they genuinely are a sequence, and the nth screen
  // belongs to the nth tab.
  //
  // ── What PortalShowcase draws, and what it does not ─────────────────────────
  // It draws a rounded, shadowed card and puts the screenshot in it. Nothing
  // else: no browser chrome, no address bar, no sidebar. Both of those were
  // earlier layouts — the portal's own nav used to be drawn down the left of a
  // small window, and the window used to sit inside a browser mock — and neither
  // survives. The screenshot IS the set-piece, and the section index lives in a
  // tablist underneath it, so:
  //
  // EXPECTS the portal's WHOLE PAGE, exactly as a screenshot of it would look
  // with the browser's own chrome cropped off — the application's sidebar or top
  // nav included, because nothing in the code supplies one. Landscape, roughly
  // 16:10 to 3:2 (1600 x 1000 is a good target; a retina 2x capture is welcome,
  // these are the largest thing on the page).
  //
  // Three of them are on screen at once — the active one centred and sharp, its
  // neighbours small, faint and heavily blurred at the edges of the window — so
  // what matters most is that each is legible at full size and DISTINGUISHABLE at
  // a glance. Six captures of the same layout with one number changed will read
  // as a carousel that isn't moving.
  //
  // THE BOTTOM IS CROPPED, BY DESIGN. Twice, in fact: the frame is a little taller
  // than the space it sits in so the window runs behind the tab strip, and the
  // aperture is wider than a screenshot's own ratio so `object-cover object-top`
  // trims the foot as well. Between them, expect the lowest ~25% of the capture to
  // be unseen at 1440 x 900 and more on a shorter window. Nothing that matters —
  // no footer, no primary action, no closing row of a table — should live down
  // there; the top two-thirds is the whole picture as far as this section is
  // concerned.
  portalScreens: [1, 2, 3, 4, 5, 6].map((n) => `${import.meta.env.BASE_URL}portal-scr-${n}.png`),

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
  //   22. Provider Overview → the mission band under the hero
  //   24. Provider Portal → the "one login, both jobs" band
  //   25. Partner with Us → "A movement to make care accessible"
  //
  // (23 is not an ImageBand — it is the FeatureReveal backdrop above, numbered
  // where it falls in page order rather than by which component draws it.)
  brokerPartner: `${import.meta.env.BASE_URL}img-18.png`,
  brokerFuture: `${import.meta.env.BASE_URL}img-19.png`,
  brokerSupport: `${import.meta.env.BASE_URL}img-20.png`,
  brokerPortalPhoto: `${import.meta.env.BASE_URL}img-21.png`,

  // The three provider panels. Same contract as the four above — an ordinary,
  // un-faded photograph, square to portrait, subject away from all four margins.
  //
  // WORTH KNOWING BEFORE COMMISSIONING THESE: the four delivered broker panels
  // (img-18 to img-21) are not what the paragraph above describes. Each arrived as
  // a subject cutout flattened onto white with the lotus composited in behind —
  // the treatment the FeatureReveal and About assets carry — rather than as a
  // photograph filling its frame. ImageBand draws them happily either way, so
  // this is a look, not a bug: a plain photograph is what the half-window panel
  // was designed for, and a white cutout reads as a lighter, more graphic band. The
  // one thing that would look like a mistake is mixing the two inside the For
  // Providers section, so pick whichever matches the broker pages these sit beside
  // and use it for all three.
  //
  // One note on subject matter rather than treatment: these are the only
  // photographs on the site whose audience is a clinician rather than a patient.
  // A stock "doctor smiling at camera" reads as a member-facing plan photo and
  // undoes the page's whole framing; what these slots want is practice life —
  // front-desk and back-office work, a clinician at a workstation, two colleagues
  // conferring — the side of a practice a provider recognises as their own day.
  providerPatients: `${import.meta.env.BASE_URL}img-22.png`,
  providerPortalPhoto: `${import.meta.env.BASE_URL}img-24.png`,
  providerPartnerPhoto: `${import.meta.env.BASE_URL}img-25.png`,

  // The Broker Portal's three screens, in the order its tabs list them. Exactly
  // the contract `portalScreens` carries above, including the cropped foot.
  brokerPortalScreens: [1, 2, 3].map(
    (n) => `${import.meta.env.BASE_URL}broker-portal-scr-${n}.png`,
  ),

  // The Provider Portal's two screens, in the order its tabs list them. Same
  // contract again, cropped foot included.
  //
  // TWO here against the broker portal's three and the member portal's six,
  // because the copy doc gives the provider portal exactly two sections. That
  // costs the layout nothing — two tabs sit at the left of the strip — so nothing
  // needs a third file to look right, and a third screen with no copy beside it
  // would have to be invented.
  //
  // What these two must NOT contain: a real claim number, a real member name, a
  // real NPI or a real dollar amount. Same rule the member and broker screens
  // follow — see the note in README.md on the interface mockups.
  providerPortalScreens: [1, 2].map(
    (n) => `${import.meta.env.BASE_URL}provider-portal-scr-${n}.png`,
  ),

  // ── THREE SLOTS RETIRED, and the files they pointed at ──────────────────
  //
  // `portalOverview`, `brokerPortalOverview` and `providerPortalOverview` used to
  // live here: one image of a whole portal per page, for the old mobile layout,
  // which replaced the window and its scroll-driven sidebar with a single picture
  // and a list. PortalShowcase's rebuild has no such layout — the window and its
  // tablist work at every width now, so a phone gets the same real screenshots a
  // desktop does instead of one unreadable overview — and the slots went with it.
  //
  // public/portal-overview.png and public/broker-portal-overview.png are still in
  // the repo and nothing references them. Delete them when you are confident the
  // old layout isn't coming back. provider-portal-overview.png was never
  // commissioned, which is one fewer asset to produce.
  //
  // ────────────────────────────────────────────────────────────────────────────

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

  // ── The 2026 colour pass ──────────────────────────────────────────────────
  //
  // The gold rule-and-diamond ornament, 1529 x 91, single-path and single-colour
  // (#D6AC68). Set above and below the closing paragraph on About; it is drawn as
  // a plain <img> at `w-full`, so it stretches to whatever measure it is given and
  // its own width is only an aspect ratio.
  flourish: `${import.meta.env.BASE_URL}flourish.svg`,

  // For Members → Resources → the Plan details + Blog band. A FULL-SECTION
  // photograph, 1920 x 1080, with the Fortiva lattice already composited in over
  // its right half, drawn full bleed with the two cards stacked on top of it.
  //
  // EXPECTS: the subject on the LEFT third. The cards occupy the right ~46% of the
  // section at `lg` and up, so anything on that side is behind them.
  resourcesBg: `${import.meta.env.BASE_URL}resources-bg.png`,

  // ── Two slots for ListBand ────────────────────────────────────────────────
  //
  // NEITHER IS IN THE REPO YET. ListBand renders an empty frame without them and
  // the photographs drop in with no code change.
  //
  // Both sit inside a rounded, inset frame on a navy-to-teal gradient — not full
  // bleed, and not dissolved into anything — so unlike almost everything else in
  // this file they want an ORDINARY, UN-FADED, OPAQUE photograph. Portrait to
  // square, 1200 x 1400 is a good target; drawn `object-cover object-center`, so
  // keep the subject away from all four margins and any crop is safe.
  //
  //   employers.png — Plans → Employers → "What employers believe"
  //
  // `doctorSearch` below no longer follows that contract. find-doc.png is a
  // TRANSPARENT CUTOUT with the Fortiva mark composited behind the subject, and
  // the band it sits in dropped its frame, its shadow and its margins — so that
  // one is drawn `object-contain` straight onto #A5CDD9, full height, no box.
  employersBeliefs: `${import.meta.env.BASE_URL}employers.png`,
  doctorSearch: `${import.meta.env.BASE_URL}find-doc.png`,

  // Plans → Individuals & Families → "FOR families", in <ListBand />'s inset
  // frame. A square, opaque photograph.
  //
  // It replaces `insuranceFamily` (img-4.png) in that one slot, and it is a NEW
  // key rather than a change to that one because img-4 is also the family card on
  // the homepage — repointing it would have swapped both.
  planFamily: `${import.meta.env.BASE_URL}plan-family.png`,
}
