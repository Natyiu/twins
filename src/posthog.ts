import { PostHog } from 'posthog-node/edge'

function getDistinctId(): string {
  const key = 'ph_distinct_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

const client = new PostHog(import.meta.env.VITE_POSTHOG_KEY as string, {
  host: import.meta.env.VITE_POSTHOG_HOST as string,
  enableExceptionAutocapture: true,
})

export function capture(event: string, properties?: Record<string, unknown>): void {
  client.capture({ distinctId: getDistinctId(), event, properties })
}

export function captureException(error: unknown): void {
  client.captureException(error, getDistinctId())
}

export default client
