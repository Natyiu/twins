/**
 * Browser analytics — uses posthog-js (not posthog-node).
 * Safe no-op when VITE_POSTHOG_KEY is unset so the app never crashes on load.
 */
import posthog from 'posthog-js'

let initialized = false

function init(): void {
  if (initialized) return
  if (typeof window === 'undefined') return
  const key = import.meta.env.VITE_POSTHOG_KEY
  if (!key || typeof key !== 'string') return
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    persistence: 'localStorage',
    capture_pageview: false,
    autocapture: false,
  })
  initialized = true
}

export function capture(
  event: string,
  properties?: Record<string, unknown>,
): void {
  try {
    init()
    if (initialized) posthog.capture(event, properties)
  } catch (e) {
    console.warn('[posthog]', e)
  }
}

export function captureException(error: unknown): void {
  console.error(error)
  try {
    init()
    if (initialized) {
      const msg = error instanceof Error ? error.message : String(error)
      posthog.capture('$exception', { $exception_message: msg })
    }
  } catch {
    /* ignore */
  }
}
