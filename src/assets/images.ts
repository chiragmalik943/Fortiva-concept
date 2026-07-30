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
// logo.svg is a single-colour mark, tinted navy or white in CSS via
// mask-image (see Logo.tsx) depending on where it's used.
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

  cardOneBg: `${import.meta.env.BASE_URL}img-card-1-bg.png`,
  cardOne: `${import.meta.env.BASE_URL}img-card-1.png`,
  cardTwoBg: `${import.meta.env.BASE_URL}img-card-2-bg.png`,
  cardTwo: `${import.meta.env.BASE_URL}img-card-2.png`,
  cardThreeBg: `${import.meta.env.BASE_URL}img-card-3-bg.png`,
  cardThree: `${import.meta.env.BASE_URL}img-card-3.png`,
  cardFourBg: `${import.meta.env.BASE_URL}img-card-4-bg.png`,
  cardFour: `${import.meta.env.BASE_URL}img-card-4.png`,

  logo: `${import.meta.env.BASE_URL}logo.svg`,

  forMask: `${import.meta.env.BASE_URL}for-mask.svg`,
}
