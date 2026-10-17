// Writes one design-system spec per theme to public/specs/<theme>.json, served at
// /specs/<theme>.json (with CORS, see next.config.ts) so tools such as Panda Studio can
// load a theme by URL. Runs panda codegen once per theme, in parallel, with
// panda.spec.config.ts; the generated system goes to a cache folder, not styled-system.
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'

// The theme ids come from the main spec, which panda codegen has just written.
const ids = Object.keys(JSON.parse(readFileSync('public/design-system.json', 'utf8')).themes)
mkdirSync('public/specs', { recursive: true })

const run = (id) =>
  new Promise((resolve, reject) => {
    const args = ['codegen', '--config', 'panda.spec.config.ts', '--outdir', `node_modules/.cache/panda-specs/${id}`, `--spec=public/specs/${id}.json`, '--log-level', 'warn']
    const child = spawn('panda', args, { stdio: 'inherit', env: { ...process.env, PANDA_SPEC_THEME: id }, shell: process.platform === 'win32' })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`panda codegen failed for ${id} (exit ${code})`))))
  })

await Promise.all(ids.map(run))
console.log(`Wrote ${ids.length} theme specs to public/specs/`)
