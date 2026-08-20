import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { HOMEPAGE_FAQ_IDS, memberFaqs } from '../../content/site'
import Button from '../Button'

/**
 * Four of the member FAQs. Which four is a list of ids in content/site.ts, and
 * the copy itself now comes from there too — this file used to hold its own
 * hard-coded duplicate of four answers, which meant an edit on the For Members →
 * FAQs page silently disagreed with the homepage.
 *
 * Selected by id, not by index: the full list is now forty questions sorted into
 * four categories, so "the 1st, 2nd, 3rd and 5th" would change meaning the next
 * time anything is reordered. `filter` on ids also means a deleted question drops
 * out of the band rather than promoting whatever moved into its slot.
 */
const faqs = HOMEPAGE_FAQ_IDS.map((id) => memberFaqs.find((faq) => faq.id === id)).filter(
  (faq): faq is (typeof memberFaqs)[number] => Boolean(faq),
)

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <h2
          ref={headingRef}
          className="text-balance text-center text-[28px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[36px]"
        >
          Common questions
        </h2>

        <div className="mt-14 flex flex-col">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-b border-navy-800/10 first:border-t">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-medium text-navy-800 sm:text-[17px]">
                    {item.q}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Plus
                      size={16}
                      className="text-navy-800 transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                      className="overflow-hidden"
                    >
                      {/* Only the first paragraph of a multi-paragraph answer —
                          answer 3 runs to three in the doc, which is more than
                          this band should carry. The full text is on For
                          Members → FAQs, which the button below links to. */}
                      <p className="max-w-xl pb-6 text-[14.5px] leading-relaxed text-navy-800/60">
                        {item.a[0]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="ghost" href="/members/faqs">
            All FAQ&apos;s
          </Button>
        </div>
      </div>
    </section>
  )
}
