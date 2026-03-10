// create-env-files.js
// Copilot’a talimat: "Create .env.local and .env with Supabase Session Pooler URL, Prisma DB connection, frontend keys and admin secrets"

const fs = require('fs');

const envContent = `
# Prisma / backend (Session Pooler + SSL)
DATABASE_URL=postgresql://postgres:38Cagatay38@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

# Frontend Supabase client
NEXT_PUBLIC_SUPABASE_URL=https://nushdhzqvmtcbongvfeq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_dfPOjjk3NsQMGG0pBm9WLw_rPHMtUdq

# Admin login
ADMIN_USER=admin
ADMIN_PASS=admin
ADMIN_SECRET=dev-secret
`;

// Create .env.local
fs.writeFileSync('.env.local', envContent.trim() + '\n');
console.log('.env.local created successfully');

// Create .env
fs.writeFileSync('.env', envContent.trim() + '\n');
console.log('.env created successfully');
