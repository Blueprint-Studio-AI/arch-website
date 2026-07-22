import posthog from "posthog-js";

// Analytics are env-gated: nothing loads until NEXT_PUBLIC_POSTHOG_KEY is set
// in the deploy environment, so local dev and forks stay silent by default.
// The dated `defaults` set enables SPA pageview capture on history changes,
// so client-side navigations count without a manual $pageview hook.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2025-05-24",
  });
}
