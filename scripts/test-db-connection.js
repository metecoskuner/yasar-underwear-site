#!/usr/bin/env node
// Simple script to test DATABASE_URL connectivity using pg
const { Client } = require('pg')

const url = process.env.DATABASE_URL
;(async () => {
  if (!url) {
    console.error('No DATABASE_URL environment variable set')
    process.exit(2)
  }
  const client = new Client({ connectionString: url })
  try {
    await client.connect()
    const res = await client.query('SELECT NOW() AS now')
    console.log('OK - server time:', res.rows[0].now)
    await client.end()
    process.exit(0)
  } catch (e) {
    console.error('DB connect error:', e.message || e)
    process.exit(1)
  }
})()
