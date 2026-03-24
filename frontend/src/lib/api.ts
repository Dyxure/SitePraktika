// Укажете `VITE_API_URL`, если фронт будет обращаться к API не через прокси Vite.
const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function postJson<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Ошибка отправки: ${res.status}`)
  }
  return (await res.json().catch(() => ({}))) as T
}

export type LearningPayload = {
  parentName: string
  parentPhone: string
  childName: string
  childAge: number
  direction: string
  comment?: string
}

export type CompetitionPayload = {
  participantName: string
  phone: string
  email: string
  age: string
  workTitle: string
  additional?: string
}

export async function submitLearning(payload: LearningPayload) {
  return postJson('/api/forms/learning', payload)
}

export async function submitCompetition(payload: CompetitionPayload) {
  return postJson('/api/forms/competition', payload)
}

