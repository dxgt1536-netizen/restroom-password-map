const STORAGE_KEY = 'restroom-passwords'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getEntries() {
  return readAll()
}

export function addEntry(entry) {
  const entries = readAll()
  const newEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  }
  writeAll([...entries, newEntry])
  return newEntry
}

export function updateEntry(id, updates) {
  const entries = readAll().map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
  writeAll(entries)
}

export function removeEntry(id) {
  writeAll(readAll().filter((entry) => entry.id !== id))
}
