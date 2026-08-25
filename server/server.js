import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = process.env.PORT || 3001
const currentFile = fileURLToPath(import.meta.url)
const dataFile = path.join(path.dirname(currentFile), 'data', 'bookings.json')

app.use(express.json())

async function readBookings() {
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf8'))
  } catch {
    return []
  }
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'nora-bookings' })
})

app.get('/api/bookings', async (_request, response) => {
  response.json(await readBookings())
})

app.post('/api/bookings', async (request, response) => {
  const { name, phone, service, date } = request.body || {}
  if (!name || !phone || !service || !date) {
    return response.status(400).json({ error: 'name, phone, service and date are required' })
  }

  const bookings = await readBookings()
  const booking = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    service: String(service).trim(),
    date,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)
  await fs.writeFile(dataFile, JSON.stringify(bookings, null, 2))
  return response.status(201).json(booking)
})

app.listen(port, () => {
  console.log(`NORA API running at http://localhost:${port}`)
})
