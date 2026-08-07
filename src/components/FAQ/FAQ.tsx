import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { REACH_PHONE } from '../../content/site'
import Button from '../Button'

// Four of the eight member FAQs in the copy doc, verbatim. The remaining four
// live on For Members → FAQs, which the button below links to.
const faqs = [
  {
    q: 'What is Fortiva and what makes it different?',
    a: 'Fortiva is a North Carolina-based health insurance company committed to disrupting the traditional market by delivering affordable, value-based coverage that puts people — not premiums — first. Our plans are designed to be flexible, transparent and powered by technology for a simpler, more personalized experience.',
  },
  {
    q: 'What types of plans does Fortiva offer?',
    a: 'We provide multi-tiered health insurance options, including limited medical and short-term medical plans, along with supplemental coverage like Critical Illness and Accidental Death & Dismemberment. These plans are tailored for individuals, families and small businesses seeking affordable alternatives to traditional Affordable Care Act plans.',
  },
  {
    q: 'How do I enroll in a Fortiva plan?',
    a: `Getting started with Fortiva is simple and technology-driven. Members can explore plans, compare options and enroll through the Fortiva website. For additional support, REACH, Fortiva's trusted enrollment support partner, offers licensed, human-led guidance by phone at ${REACH_PHONE} to help individuals navigate their options and enroll with confidence.`,
  },
  {
    q: 'How does Fortiva keep costs affordable?',
    a: 'We focus on underserved markets and leverage technology to streamline operations, reduce overhead and deliver transparent pricing. Our plans are designed to fit real-life budgets without compromising quality care.',
  },
]

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
                      <p className="max-w-xl pb-6 text-[14.5px] leading-relaxed text-navy-800/60">
                        {item.a}
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
