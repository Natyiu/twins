<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Twins FAQ project — a React + Vite single-page application. The integration uses the `posthog-node` SDK (edge entrypoint, which is compatible with browser/Vite environments). A persistent anonymous distinct ID is stored in `localStorage` so returning visitors are recognized across sessions.

## Changes made

| File | Change |
|------|--------|
| `src/posthog.ts` | Created — initializes the PostHog client from env vars, manages anonymous distinct IDs via `localStorage`, and exports `capture()` and `captureException()` helpers |
| `src/Faq.tsx` | Updated — `FaqItem` now tracks open/closed state with `useState` and fires `faq_item_expanded` / `faq_item_collapsed` events on toggle, with `captureException` in the error path |
| `.env` | Created — stores `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` |
| `package.json` | Updated — `posthog-node ^5.28.11` added as a dependency |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `faq_item_expanded` | Fired when a user clicks to expand a FAQ item; includes `question` property with the question text | `src/Faq.tsx` |
| `faq_item_collapsed` | Fired when a user clicks to collapse an open FAQ item; includes `question` property | `src/Faq.tsx` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior:

**Dashboard**
- [Analytics basics](https://us.posthog.com/project/365457/dashboard/1434873)

**Insights**
- [FAQ Item Interactions (Expanded vs Collapsed)](https://us.posthog.com/project/365457/insights/ENxAmVZk) — daily line chart of all expand and collapse events
- [Unique Visitors Engaging with FAQ](https://us.posthog.com/project/365457/insights/Lq2WC0Fo) — daily unique users who interact with any FAQ item
- [Total FAQ Expansions (Last 30 Days)](https://us.posthog.com/project/365457/insights/BArJmhbF) — single bold number for total expansions
- [FAQ Engagement Rate (Expansions per User)](https://us.posthog.com/project/365457/insights/FmXsyGTp) — average expansions per user per day (A/B formula)
- [FAQ Reads Completed (Expanded → Collapsed)](https://us.posthog.com/project/365457/insights/lDfmvpJE) — funnel showing what share of users who open a FAQ item also close it

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
