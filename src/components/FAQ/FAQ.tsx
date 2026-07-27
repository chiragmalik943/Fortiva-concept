import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

const faqs = [
  {
    q: 'What coverage should I look for?',
    a: 'It depends on your stage of life and budget — we walk through your options together and match you with a plan that covers what matters most without paying for what doesn\u2019t.',
  },
  {
    q: 'Could you help me plan for Retirement Healthcare?',
    a: 'Yes. Our advisors help you bridge the gap between your current plan and Medicare, so there are no surprises when you retire.',
  },
  {
    q: 'How do I choose the right health plan?',
    a: 'We start with a short conversation about your health needs, providers and budget, then compare plans side by side so the trade-offs are obvious.',
  },
  {
    q: 'Can I keep my current doctor?',
    a: 'In most cases, yes. We\u2019ll check your provider network before you switch, so continuity of care is never a surprise.',
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
          Common questions on health coverage and benefits
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
          <Button variant="ghost">All FAQ&apos;s</Button>
        </div>
      </div>
    </section>
  )
}
