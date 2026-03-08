#!/usr/bin/env node
/*
 Simple script to upload all files from public/uploads to Supabase Storage bucket `yasar-admin`.
 Usage:
   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node ./scripts/upload-to-supabase.js
 Or create a .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY and install dotenv.
*/
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
const bucket = 'yasar-admin'

async function main() {
  if (!fs.existsSync(uploadsDir)) {
    console.error('uploads dir not found:', uploadsDir)
    process.exit(1)
  }
  const files = fs.readdirSync(uploadsDir).filter(f => fs.lstatSync(path.join(uploadsDir, f)).isFile())
  for (const file of files) {
    // skip hidden files like .DS_Store
    if (file.startsWith('.')) continue
    const localPath = path.join(uploadsDir, file)
    console.log('Uploading', file)
    const buffer = fs.readFileSync(localPath)
    try {
      const name = `${Date.now()}-${file}`
      const { data, error } = await supabase.storage.from(bucket).upload(name, buffer, { upsert: true })
      if (error) {
        console.error('upload error', error)
        continue
      }
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path)
      console.log(' ->', pub.publicUrl)
    } catch (e) {
      console.error('exception uploading', e)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
