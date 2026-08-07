// Runs automatically before `npm run dev` and `npm run build` (npm's `predev`
// and `prebuild` hooks). Also available on its own as `npm run map`.
//
// WHY THIS EXISTS: public/map.svg is the availability map's source of truth for
// colour, and it has to stay that way without anyone remembering to do anything.
// The map reaches the page as two derived artifacts — public/map-base.svg for the
// forty-four states Fortiva doesn't name, and MAP_FILLS in
// src/components/AvailableStates/mapStates.ts for the six it does — and a derived
// artifact that only updates when someone runs a command is an artifact that will
// eventually be wrong. Recolouring the artwork should be the entire job.
//
// So this rewrites both from the SVG on every start. It touches nothing else:
// the dot geometry in mapStates.ts is expensive to derive (it needs a projection
// fit and real state boundaries — see the note at the bottom of that file) and it
// only goes stale if the artwork is redrawn rather than recoloured. This script
// detects that case and says so instead of guessing.
//
// It writes only when a value actually changed, so a normal `npm run dev` leaves
// the working tree alone.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SVG = resolve(root, 'public/map.svg')
const BASE = resolve(root, 'public/map-base.svg')
const STATES = resolve(root, 'src/components/AvailableStates/mapStates.ts')

const VIEWBOX = { w: 736, h: 542 }
/** How far a stored dot may sit from its match in the SVG before we call the
 *  artwork redrawn rather than re-exported. Figma's own re-serialisation drifts
 *  by ~0.002px; a real edit moves things by whole pixels. */
const DRIFT_TOLERANCE = 1.5

const fail = (...lines) => {
  console.error(['', ...lines.map((l) => `  ${l}`), ''].join('\n'))
  process.exit(1)
}

// ── read the artwork ────────────────────────────────────────────────────────
const svg = readFileSync(SVG, 'utf8')
const paths = svg.match(/<path[^>]*>/g) ?? []
if (paths.length < 2) fail(`✗ build-map: no <path> elements found in public/map.svg`)

const attr = (el, name) => el.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null

/** Mean of a path's coordinate pairs. Crude as a centroid and perfect as an
 *  identity: these are ~2px dots, so the mean pins each one uniquely. */
const centre = (d) => {
  const n = (d.match(/-?\d+\.?\d*/g) ?? []).map(Number)
  let sx = 0
  let sy = 0
  for (let i = 0; i < n.length - 1; i += 2) {
    sx += n[i]
    sy += n[i + 1]
  }
  const count = Math.floor(n.length / 2)
  return [sx / count, sy / count]
}

// The first path is the whole grey grid; the rest are one dot each. That's how
// the file has always been exported, and it's load-bearing here, so check it.
const [basePath, ...dotPaths] = paths
const baseD = attr(basePath, 'd')
const baseFill = attr(basePath, 'fill')
if (!baseD || !baseFill) fail('✗ build-map: the first <path> in map.svg has no d/fill attribute')
if (dotPaths.length < 100) {
  fail(
    `✗ build-map: expected the artwork's individual dots after the base path,`,
    `  found only ${dotPaths.length}. Has map.svg been flattened or grouped?`,
  )
}

const dots = dotPaths.map((el) => ({ fill: attr(el, 'fill'), at: centre(attr(el, 'd') ?? '') }))

// ── 1. public/map-base.svg ──────────────────────────────────────────────────
// Rounded to 2dp: 0.01px is invisible and it saves ~18% of half a megabyte.
const trimmed = baseD.replace(/\d+\.\d{3,}/g, (m) => String(Number(Number(m).toFixed(2))))
const nextBase =
  `<!-- GENERATED from public/map.svg by scripts/build-map.mjs — do not hand-edit.\n` +
  `     The ${new Intl.NumberFormat('en-US').format((baseD.match(/M/g) ?? []).length)} dots for the states Fortiva does not name, as one path, with\n` +
  `     the artwork's own fill. Regenerated on every dev start and build. -->\n` +
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX.w} ${VIEWBOX.h}" width="${VIEWBOX.w}" height="${VIEWBOX.h}" fill="none">` +
  `<path fill-rule="evenodd" clip-rule="evenodd" fill="${baseFill}" d="${trimmed}"/></svg>`

let wroteBase = false
try {
  wroteBase = readFileSync(BASE, 'utf8') !== nextBase
} catch {
  wroteBase = true
}
if (wroteBase) writeFileSync(BASE, nextBase)

// ── 2. MAP_FILLS in mapStates.ts ────────────────────────────────────────────
// Each stored state owns a set of dot paths. Match every one to the nearest dot
// in the SVG and take the majority fill — which means this never has to know
// which colour means what, so re-tiering the artwork resolves on its own.
const ts = readFileSync(STATES, 'utf8')

const blocks = [...ts.matchAll(/\n {2}\{\n {4}code: '([A-Z]{2})',[\s\S]*?\n {2}\},/g)]
if (blocks.length === 0) {
  fail(
    '✗ build-map: could not find any state blocks in mapStates.ts.',
    '  This script pattern-matches that generated file — if its shape changed,',
    '  update the regex here to match.',
  )
}

let worstDrift = 0
const fills = []

for (const [block, code] of blocks) {
  const stored = [...block.matchAll(/\{ d: '([^']*)', t:/g)].map((m) => centre(m[1]))
  const tally = new Map()

  for (const at of stored) {
    let best = null
    let bestDist = Infinity
    for (const dot of dots) {
      const dist = Math.hypot(dot.at[0] - at[0], dot.at[1] - at[1])
      if (dist < bestDist) {
        bestDist = dist
        best = dot
      }
    }
    worstDrift = Math.max(worstDrift, bestDist)
    tally.set(best.fill, (tally.get(best.fill) ?? 0) + 1)
  }

  const [fill] = [...tally].sort((a, b) => b[1] - a[1])[0]
  fills.push([code, fill])
}

if (worstDrift > DRIFT_TOLERANCE) {
  fail(
    `✗ build-map: map.svg's dots have moved (up to ${worstDrift.toFixed(1)}px from`,
    '  the geometry stored in mapStates.ts), so the artwork has been redrawn',
    '  rather than recoloured.',
    '',
    '  Colours are safe to sync automatically; shapes are not. The six states have',
    '  to be re-clustered against real state boundaries before the map is correct',
    '  again — see the regeneration note at the bottom of mapStates.ts.',
  )
}

const body = fills
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([code, fill]) => `  ${code}: '${fill}',`)
  .join('\n')

const MARKERS = /(build-map:colours:BEGIN[^\n]*\n)([\s\S]*?)(\/\* build-map:colours:END)/
if (!MARKERS.test(ts)) {
  fail(
    '✗ build-map: the build-map:colours markers are missing from mapStates.ts.',
    '  They delimit the block this script owns — restore them or it cannot write.',
  )
}

const nextTs = ts.replace(
  MARKERS,
  (_, begin, old, end) =>
    begin +
    old.replace(
      /(export const MAP_FILLS: Record<string, string> = \{\n)[\s\S]*?(\n\})/,
      `$1${body}$2`,
    ) +
    end,
)

const wroteFills = nextTs !== ts
if (wroteFills) writeFileSync(STATES, nextTs)

// ── report ──────────────────────────────────────────────────────────────────
const summary = [...new Set([baseFill, ...fills.map(([, f]) => f)])].join(' ')
const changed = [wroteBase && 'map-base.svg', wroteFills && 'MAP_FILLS'].filter(Boolean)
console.log(
  changed.length > 0
    ? `build-map: synced ${changed.join(' + ')} from map.svg — ${summary}`
    : `build-map: ${fills.length} states already in sync with map.svg — ${summary}`,
)
