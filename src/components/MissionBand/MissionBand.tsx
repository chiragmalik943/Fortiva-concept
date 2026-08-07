import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

// Sits immediately after the FOR mask section releases its pin. The mask is a
// wordless visual set-piece, so without this the page jumps straight from brand
// statement into product cards; these are the copy doc's mission and vision
// statements ("FOR our members" / "FOR the future"), which have no other home
// on the page.
//
// ── Why it's shaped like this ───────────────────────────────────────────────
// The first version set both statements in matched columns at one type size,
// which was the problem: the mission runs four sentences and the vision runs
// one, so "equal" columns produced a tall grey slab next to a short one and read
// as a layout bug rather than a choice.
//
// The fix is to balance them optically instead of by word count — many words
// small against few words large. So the vision is set at nearly twice the size,
// in italic behind a gold rule, which turns its brevity into the reason it looks
// the way it does; a manifesto line, not a paragraph that ran out. The two
// blocks now occupy similar area with entirely different weight.
//
// The mission also gains internal hierarchy rather than staying one flat block:
// its opening sentence is promoted to a lead, and the remaining two drop to body
// size beneath it. That's the copy doc's text unchanged and unabridged — the
// split is on its own sentence boundaries, so nothing was rewritten to fit.
//
// This is the page's only large-type editorial moment, which is what the beat
// after a wordless set-piece wants. Adding an image here would just compete with
// the mask above it and the cards below.
export default function MissionBand() {
  const missionRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const leadRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const bodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.2 })
  const futureRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const futureBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.15 })

  return (
    <section className="bg-cream px-6 py-24 sm:py-32">
      {/* Equal columns, unequal treatment — that's the whole idea. The columns
          can match because the balance is being done by type size, not by width;
          an uneven split on top of it just opened a void down the middle.
          `items-start` because the two blocks are different heights by design
          and stretching them would undo that. */}
      <div className="mx-auto grid max-w-container items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2
            ref={missionRef}
            className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[36px]"
          >
            <span className="text-gold-dark">FOR</span> our members
          </h2>

          <p
            ref={leadRef}
            className="mt-7 max-w-xl text-[19px] leading-[1.5] text-navy-800/85 opacity-0 sm:text-[21px]"
          >
            Our mission is simple: to champion a member-first approach to health
            insurance &mdash; transparent, affordable and designed for better outcomes.
          </p>

          <p
            ref={bodyRef}
            className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-navy-800/55 opacity-0"
          >
            We believe health coverage should empower you, not overwhelm you.
            That&rsquo;s why we combine value-based care, personalized experiences and
            technology-driven simplicity to deliver plans that fit your life.
          </p>
        </div>

        {/* Nudged down on large screens so the pair reads as composed rather than
            aligned-but-unequal. The gold rule is what makes the offset legible as
            a choice — it gives the block its own left edge to hang from. */}
        <div className="lg:pt-16">
          <h2
            ref={futureRef}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50 opacity-0"
          >
            <span className="text-gold-dark">FOR</span> the future
          </h2>
          <p
            ref={futureBodyRef}
            className="mt-5 border-l-2 border-gold pl-6 text-[22px] italic leading-[1.45] text-navy-800/80 opacity-0 sm:text-[25px]"
          >
            We&rsquo;re building a future where health insurance is simple, fair and
            empowering &mdash; delivering better care at a better price nationwide.
          </p>
        </div>
      </div>
    </section>
  )
}
