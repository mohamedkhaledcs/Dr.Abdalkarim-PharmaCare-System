const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '../.env.local')
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found')
  process.exit(1)
}

const env = fs.readFileSync(envPath, 'utf-8')
const lines = env.split(/\r?\n/)
const obj = {}
for (const line of lines) {
  const m = line.match(/^([^=]+)=(.*)$/)
  if (m) obj[m[1].trim()] = m[2].trim()
}

const url = obj.NEXT_PUBLIC_SUPABASE_URL
const anon = obj.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = obj.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anon || !service) {
  console.error('Missing env variables. Please set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('URL:', url)
console.log('anon length:', anon.length)
console.log('service length:', service.length)

async function testClient(client, name) {
  console.log(`\nTesting client: ${name}`)
  try {
    const { data, error } = await client.from('products').select('id,name').limit(1)
    if (error) {
      console.error('Error', error.message, error.code, error.details)
    } else {
      console.log('Response', data)
    }
  } catch (e) {
    console.error('Exception', e)
  }
}

async function run() {
  const anonClient = createClient(url, anon)
  const serviceClient = createClient(url, service)

  await testClient(anonClient, 'anon')
  await testClient(serviceClient, 'service_role')
}

run()
