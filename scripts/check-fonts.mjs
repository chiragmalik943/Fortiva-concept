// Runs automatically before `npm run build` (npm's `prebuild` hook).
//
// WHY THIS EXISTS: Vite only rewrites a root-absolute url() in CSS with the
// configured `base` if the file it points at actually exists in public/ at build
// time. With the fonts present, `/fonts/NewHero-Regular.otf` correctly becomes
// `/Fortiva-concept/fonts/NewHero-Regular.otf`. With a font MISSING, Vite leaves
// the URL untouched, the build still succeeds, and the deployed site silently
// requests `/fonts/...` at the domain root — where nothing is. Every bit of text
// then falls back to the system sans and nobody finds out until someone looks.
//
// Licensed fonts are exactly the kind of file that goes missing (gitignored,
// not copied to a fresh clone, absent in CI), so this turns that silent
// production bug into a loud local failure.

import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cssPath = resolve(root, 'src/styles/fonts.css')

const css = readFileSync(cssPath, 'utf8')
const declared = [...css.matchAll(/url\(['"]?(\/fonts\/[^'")]+)['"]?\)/g)].map((m) => m[1])

if (declared.length === 0) {
  console.error('check-fonts: no /fonts/… url() found in src/styles/fonts.css — did the paths change?')
  process.exit(1)
}

const missing = declared.filter((p) => !existsSync(resolve(root, 'public', p.replace(/^\//, ''))))

if (missing.length > 0) {
  const plural = missing.length === 1 ? 'file is' : 'files are'
  console.error(
    [
      '',
      `  ✗ ${missing.length} of ${declared.length} New Hero font ${plural} missing from public/fonts/`,
      '',
      ...missing.map((p) => `      ${p.replace('/fonts/', '')}`),
      '',
      '  Drop the .otf files into public/fonts/ using exactly these names.',
      '  Building without them produces a site whose font URLs ignore the',
      '  configured base and 404 in production — see scripts/check-fonts.mjs.',
      '',
    ].join('\n'),
  )
  process.exit(1)
}

console.log(`check-fonts: all ${declared.length} New Hero faces present.`)
