import { CSSProperties, PointerEvent, useCallback } from 'react'
import { images } from '../../assets/images'
import { AvailabilityState } from '../../content/site'
import { MAP_FILLS, MAP_FOCUS, MAP_VIEWBOX, mapStates } from './mapStates'

interface StateMapProps {
  /** Content record per state code, so the map never invents its own copy. */
  states: AvailabilityState[]
  /** Currently highlighted state code, or null. Owned by AvailableStates. */
  active: string | null
  /** Pointer moved onto a state. Never called for touch — see below. */
  onShow: (code: string) => void
  /** Pointer left the map. */
  onHide: () => void
  /** Click or tap. The only way in on touch, where there is no hover. */
  onToggle: (code: string) => void
  /**
   * Last non-null active code. The tooltip keeps rendering at this position
   * while it fades out, so it doesn't slide back to the middle on the way out.
   */
  resting: string | null
}

const { width: VB_W, height: VB_H } = MAP_VIEWBOX

/**
 * Where the tooltip has to sit, in viewBox units, given that the map underneath
 * it is scaled about MAP_FOCUS while a state is active. The tooltip itself is
 * HTML outside the scaled layer — that keeps its type at 100% instead of
 * 122% — so it has to reproduce the transform for its own anchor point.
 *
 * `side` swings the label back over the map near an edge instead of letting it
 * hang off the card. Every state Fortiva names is on the east coast, so in
 * practice all six resolve to 'right' and the label reads consistently; the
 * other two branches are there so a future western state doesn't need new code.
 */
function anchor(cx: number, ty: number, zoomed: boolean) {
  const x = zoomed ? MAP_FOCUS.x + MAP_FOCUS.scale * (cx - MAP_FOCUS.x) : cx
  const y = zoomed ? MAP_FOCUS.y + MAP_FOCUS.scale * (ty - MAP_FOCUS.y) : ty
  const pct = (x / VB_W) * 100
  return {
    left: `${pct}%`,
    top: `${(y / VB_H) * 100}%`,
    side: pct > 55 ? 'right' : pct < 25 ? 'left' : 'center',
  }
}

/**
 * The dot-grid availability map.
 *
 * Two stacked layers sharing one viewBox (see mapStates.ts for why):
 *   1. an <img> of the 3,989 static grey dots — inert, cached, out of the bundle
 *   2. an inline <svg> holding only the six states that react to the pointer
 *
 * The SVG is aria-hidden on purpose. It carries no information the chips in the
 * left-hand panel don't already carry, and those chips are real buttons driving
 * this same highlight — so keyboard and screen-reader users get the whole story
 * without a second set of six tab stops for the same six states.
 */
export default function StateMap({
  states,
  active,
  onShow,
  onHide,
  onToggle,
  resting,
}: StateMapProps) {
  const byCode = Object.fromEntries(states.map((s) => [s.code, s]))
  const live = mapStates.find((s) => byCode[s.code]?.status === 'live')

  // Touch fires pointerenter on every tap, which would re-arm the highlight a
  // beat before the click that's meant to turn it off — so pointer entry is for
  // real pointers only and taps go through onToggle alone.
  const enter = useCallback(
    (code: string) => (e: PointerEvent<SVGPathElement>) => {
      if (e.pointerType !== 'touch') onShow(code)
    },
    [onShow],
  )

  const tip = mapStates.find((s) => s.code === (active ?? resting))
  const tipState = tip ? byCode[tip.code] : undefined
  const pos = tip ? anchor(tip.cx, tip.ty, Boolean(active)) : null

  return (
    <div
      className="fmap relative"
      data-focus={active ? 'true' : 'false'}
      onPointerLeave={onHide}
    >
      {/* No overflow clip: the map floats on the section background with no
          container, so there is no edge that could justify cutting a dot off.
          MAP_FOCUS.scale is capped at the largest value that keeps every dot
          inside the viewBox, which is what makes that safe. */}
      <div className="relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <div
          className="fmap-stage absolute inset-0"
          style={{
            transformOrigin: `${(MAP_FOCUS.x / VB_W) * 100}% ${
              (MAP_FOCUS.y / VB_H) * 100
            }%`,
          }}
        >
          <img
            src={images.availabilityMapBase}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="fmap-base absolute inset-0 h-full w-full select-none"
          />

          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            {mapStates.map((shape) => {
              const meta = byCode[shape.code]
              if (!meta) return null
              return (
                <g
                  key={shape.code}
                  className="fmap-state"
                  data-status={meta.status}
                  data-active={active === shape.code ? 'true' : 'false'}
                  /* The one place a map colour enters the DOM. Everything that
                     paints this state — dots, ring, glow — inherits it from here,
                     so map.svg stays the only source of colour. */
                  style={{ '--fmap-ink': MAP_FILLS[shape.code] } as CSSProperties}
                >
                  <path className="fmap-glow" d={shape.hit} />
                  <path className="fmap-ring" d={shape.hit} />
                  {shape.dots.map((dot, i) => (
                    <path
                      key={i}
                      className="fmap-dot"
                      d={dot.d}
                      style={{ '--t': dot.t } as CSSProperties}
                    />
                  ))}
                </g>
              )
            })}

            {/* Idle attention cue on the one state that is actually live — two
                offset rings breathing out of its outline. Stops the moment the
                visitor starts exploring, and never starts under reduced motion. */}
            {live && (
              <g
                className="fmap-pings"
                style={{ '--fmap-ink': MAP_FILLS[live.code] } as CSSProperties}
              >
                <path className="fmap-ping" d={live.hit} />
                <path className="fmap-ping fmap-ping--delayed" d={live.hit} />
              </g>
            )}

            {/* Pointer targets last, so they sit above every dot. Ordered
                largest-first by mapStates, which puts the small states on top
                where dilated borders overlap. */}
            <g>
              {mapStates.map((shape) =>
                byCode[shape.code] ? (
                  <path
                    key={shape.code}
                    className="fmap-hit"
                    d={shape.hit}
                    onPointerEnter={enter(shape.code)}
                    onClick={() => onToggle(shape.code)}
                  />
                ) : null,
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* The tooltip is HTML, not <text>: it inherits the page's font stack, it
          stays at 100% while the map behind it scales, and it can't be clipped
          by the frame. Because left/top are transitioned it glides from one
          state to the next instead of blinking, which also makes it read as one
          label moving around one map. */}
      <div
        className="fmap-tip pointer-events-none absolute z-10"
        data-shown={active ? 'true' : 'false'}
        data-side={pos?.side ?? 'center'}
        style={{ left: pos?.left ?? '50%', top: pos?.top ?? '50%' }}
      >
        {/* No status swatch in here. It used to carry the tier colour, which now
            comes from the artwork — and one of those colours is the navy this
            label sits on, so the dot would sometimes be invisible. The status
            word says it unambiguously at any palette. */}
        <div className="corner-smooth flex items-center gap-2.5 rounded-[12px] bg-navy-800 px-3.5 py-2 shadow-card">
          <span className="whitespace-nowrap text-[13px] font-semibold leading-none text-white">
            {tipState?.name}
          </span>
          <span className="whitespace-nowrap text-[11px] font-medium leading-none text-white/55">
            {tipState?.status === 'live' ? 'Live now' : 'Coming soon'}
          </span>
        </div>
      </div>
    </div>
  )
}
