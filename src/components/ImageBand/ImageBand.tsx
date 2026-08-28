import { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface ImageBandProps {
  eyebrow?: string
  heading: ReactNode
  /** One or more paragraphs. Passed as nodes so a caller can emphasise inline. */
  body: ReactNode
  /** A short list under the body — three or four points, no more. */
  points?: ReactNode[]
  action?: ReactNode
  image: string
  /** What the photograph shows. Required: this one is content, not atmosphere. */
  imageAlt: string
  /** Which half the photograph takes at `lg`. Defaults to the right. */
  imageSide?: 'left' | 'right'
  /** `object-position` for the panel, as a Tailwind arbitrary value. */
  imagePosition?: string
  /** Surface utility for the section. White is the design; see the docblock. */
  className?: string
}

/**
 * A paragraph or two beside a photograph that runs off the edge of the window —
 * the shape this site already reached for three times before it was a component
 * (Plans → Employers' closing band, About's "Who we are", the app cross-link on
 * Member Portal), and four times across For Brokers.
 *
 * == The photograph is half the WINDOW, not half the container ===============
 * This started as a framed image in a rounded card inside the page's normal
 * `max-w-container` column, and it was the wrong instinct twice over. On a wide
 * display the card sat marooned with margin on both sides, and four of these
 * bands down a section made the page read as a row of identical postcards.
 *
 * Now the photograph is `absolute inset-y-0` in one half of the section: full
 * height, and bleeding off the near edge of the viewport with no gutter. Two
 * things make that work without breaking the page's alignment:
 *
 *  1. The section's height is set by the COPY (plus `lg:min-h-[660px]`, so a
 *     short band still has presence), and the photograph is told to fill it. So
 *     the panel is as tall as the section rather than a fixed ratio, which is
 *     what makes it read as a wall rather than as a picture.
 *
 *  2. The copy still lives inside `max-w-container`, in that container's own
 *     half. The container is centred, so its midpoint IS the viewport's midpoint
 *     — which means the copy starts exactly where the photograph stops, while its
 *     OUTER edge stays flush with every other section on the page. Half of the
 *     container and half of the window are the same line here; they would not be
 *     if the container were ever left- or right-aligned.
 *
 * == White, and why that is not just a default ===============================
 * These bands are white because the photograph is now doing the work a tinted
 * plate used to do: half the section is a picture, so the section already reads
 * as its own thing without a background colour to separate it. A tint behind the
 * copy also fights the photo's own edge — the join between the two halves stops
 * being a clean cut and starts looking like a mistake in one of them.
 *
 * `className` stays a prop rather than being hardcoded, because a page that puts
 * two of these back to back may want the second one tinted to break the run. It
 * is not the shape's default.
 *
 * == Photograph first in the DOM =============================================
 * Which is a change: it used to be copy-then-image so the reading order on a
 * phone was heading, words, picture. Below `lg` the photograph is now a full-bleed
 * band ACROSS THE TOP of the section instead of a card under the copy, and that
 * only works from the front of the source order. It is also the better mobile
 * read now that all four of these are white: an edge-to-edge photograph is what
 * tells you a new section has started, which is the job the old cream plate did.
 */
export default function ImageBand({
  eyebrow,
  heading,
  body,
  points,
  action,
  image,
  imageAlt,
  imageSide = 'right',
  imagePosition = 'object-center',
  className = 'bg-white',
}: ImageBandProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const bodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })
  const imageRef = useScrollReveal<HTMLDivElement>({ y: 0, scale: 1.04, duration: 1.1 })

  const onLeft = imageSide === 'left'

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* ── the photograph ───────────────────────────────────────────────────
          A band across the top below `lg`, half the window from `lg` up. The
          reveal scales rather than translates: a panel pinned to the viewport
          edge cannot slide up into place without showing the surface behind it,
          so it settles out of a slight over-scale instead. `overflow-hidden` on
          the section is what keeps that scale inside its half. */}
      <div
        ref={imageRef}
        className={`relative h-[300px] w-full opacity-0 sm:h-[400px] lg:absolute lg:inset-y-0 lg:h-full lg:w-1/2 ${
          onLeft ? 'lg:left-0' : 'lg:right-0'
        }`}
      >
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover ${imagePosition}`}
        />
      </div>

      {/* ── the copy ─────────────────────────────────────────────────────────
          `lg:w-1/2` plus `lg:ml-auto` / `lg:mr-auto` puts it in the container's
          far half — see point 2 in the docblock for why that lands on the
          window's midpoint. The inner padding is the gap between the
          photograph's cut edge and the first character of type. */}
      <div className="mx-auto max-w-container px-6">
        <div
          className={`flex flex-col justify-center py-20 sm:py-24 lg:min-h-[660px] lg:w-1/2 lg:py-28 ${
            onLeft ? 'lg:ml-auto lg:pl-14 xl:pl-20' : 'lg:mr-auto lg:pr-14 xl:pr-20'
          }`}
        >
          {eyebrow && (
            <span className="inline-block self-start rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
              eyebrow ? 'mt-5' : ''
            }`}
          >
            {heading}
          </h2>

          <div ref={bodyRef} className="opacity-0">
            <div className="mt-7 flex flex-col gap-5 text-[16.5px] leading-[1.65] text-navy-800/75 sm:text-[17.5px]">
              {body}
            </div>

            {points && points.length > 0 && (
              <ul className="mt-8 flex flex-col">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 border-t border-navy-800/10 py-4 last:border-b"
                  >
                    {/* A dot rather than an icon: these lists are short and their
                        items have no natural pictograms, and six invented icons
                        across four pages would have been six decisions with no
                        answer in the copy. */}
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    />
                    <span className="text-[15px] leading-relaxed text-navy-800/70">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {action && <div className="mt-9 flex flex-wrap items-center gap-3">{action}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
