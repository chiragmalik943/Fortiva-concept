// GitHub Pages has no SPA rewrite: a hard load of /Fortiva-concept/about looks
// for a file at that path, doesn't find one, and 404s — even though the router
// would happily render it. Pages does, however, serve 404.html for any
// unmatched path WITHOUT redirecting, so the URL survives.
//
// So: ship the app's index.html as 404.html too. Any deep link boots the same
// bundle, the router reads window.location.pathname, and the right page
// renders. No hash URLs, no redirect flash, no per-route build step.
//
// Vite's dev server does its own SPA fallback, so this only matters for the
// built site. Runs as `postbuild`, after `vite build` has written dist/.

import { copyFile, access } from 'node:fs/promises'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const source = join(dist, 'index.html')
const target = join(dist, '404.html')

try {
  await access(source)
} catch {
  console.error('[spa-fallback] dist/index.html not found — did vite build run?')
  process.exit(1)
}

await copyFile(source, target)
console.log('[spa-fallback] wrote dist/404.html')
