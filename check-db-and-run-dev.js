#!/usr/bin/env node
// check-db-and-run-dev.js
// 1) Reads DATABASE_URL from .env.local or .env
// 2) Tests DNS resolution of the DB host
// 3) Attempts a PG (Prisma) DB connection with SSL enabled
// 4) If successful, runs `npx prisma db push`
// 5) Then runs `npm run dev`
// 6) Logs all errors clearly and exits with appropriate codes

const fs = require('fs')
const path = require('path')
const dns = require('dns').promises
const { spawnSync, spawn } = require('child_process')
const { Client } = require('pg')

function readDatabaseUrl() {
  const candidates = ['.env.local', '.env']
  for (const f of candidates) {
    try {
      const p = path.resolve(process.cwd(), f)
      if (!fs.existsSync(p)) continue
      const content = fs.readFileSync(p, 'utf8')
      const m = content.match(/^DATABASE_URL=(.+)$/m)
      if (m && m[1]) return m[1].trim()
    } catch (e) {
      // continue
    }
  }
  return null
}

async function main() {
  console.log('> check-db-and-run-dev: starting')
  const dbUrl = readDatabaseUrl()
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not found in .env.local or .env')
    process.exit(2)
  }
  console.log('Using DATABASE_URL from env file (redacted):', dbUrl.replace(/:\/\/([^:@]+):([^@]+)@/, '://$1:*****@'))

  let host
  try {
    const u = new URL(dbUrl)
    host = u.hostname
  } catch (e) {
    console.error('ERROR: Failed to parse DATABASE_URL:', e.message || e)
    process.exit(3)
  }

  console.log('> DNS lookup for host:', host)
  try {
    const addrs = await dns.lookup(host, { all: true })
    console.log('DNS lookup OK, addresses:', addrs.map(a => a.address).join(', '))
  } catch (e) {
    console.error('DNS lookup FAILED for host', host, '-', e.message || e)
    process.exit(4)
  }

  console.log('> Attempting PG connection (SSL enabled)')
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: true } })
  try {
    await client.connect()
    const res = await client.query('SELECT NOW() AS now')
    console.log('PG connection OK, server time:', res.rows[0].now)
    await client.end()
  } catch (e) {
    console.error('PG connection FAILED:', e.message || e)
    if (String(e.message || '').includes('self-signed certificate')) {
      console.error('Hint: certificate validation failed. For diagnostics you can try NODE_TLS_REJECT_UNAUTHORIZED=0 when running the test (not recommended for production).')
    }
    if (String(e.message || '').toLowerCase().includes('tenant or user not found')) {
      console.error('Hint: tenant/user not found. Check that the DATABASE_URL points to the correct Supabase project and that the credentials are valid. For migrations use the direct DB connection string (not a pooler) provided by Supabase dashboard.')
    }
    process.exit(5)
  }

  console.log('> Running: npx prisma db push')
  const push = spawnSync('npx prisma db push', { shell: true, stdio: 'inherit' })
  if (push.status !== 0) {
    console.error('ERROR: `npx prisma db push` failed with exit code', push.status)
    process.exit(push.status || 6)
  }

  console.log('> Starting dev server: npm run dev')
  const dev = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
  dev.on('exit', (code, signal) => {
    if (signal) {
      console.error('Dev server exited with signal', signal)
      process.exit(1)
    }
    console.log('Dev server exited with code', code)
    process.exit(code === null ? 0 : code)
  })
  dev.on('error', (err) => {
    console.error('Failed to start dev server:', err.message || err)
    process.exit(7)
  })
}

main().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(99)
})
