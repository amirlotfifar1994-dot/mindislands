/*
  Simple offline-first Service Worker (no build tooling required)
  - Pre-caches the current build assets
  - Runtime-caches same-origin requests
*/

const CACHE_NAME = 'mind-islands-v32';
const FONT_CACHE = 'mi-fonts-v1';

// IMPORTANT: if you rebuild, update these hashed asset filenames.
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './favicon.svg',
  './apple-touch-icon.png',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './pwa-512x512-maskable.png',
  './book-cover.jpg',
  './app.js',
  './MindIslands_Single.html',
  './styles.css',
  './enhancements.js',
  './islands/index.html',
  './islands/_assets/island-ui.css',
  './islands/_assets/islands-pages.js',
  './islands/_assets/island-page.js',
  './islands/analytical/index.html',
  './islands/creative/index.html',
  './islands/critical/index.html',
  './islands/empathetic/index.html',
  './islands/systemic/index.html',
  './islands/strategic/index.html',
  './islands/experimental/index.html',
  './islands/combinatory/index.html',
  './islands/reflective/index.html',
  './traps/index.html',
  './traps/trap-ui.css',
  './traps/trap-page.js',
  './traps/trap-pages.js',
  './traps/trap-enhance.js',
  './traps/confirmation_bias.html',
  './traps/anchoring.html',
  './traps/analysis_paralysis.html',
  './traps/over_thinking.html',
  './traps/perfectionism.html',
  './traps/dunning_kruger.html',
  './traps/shiny_object.html',
  './traps/idea_hoarding.html',
  './traps/novelty_bias.html',
  './traps/all_or_nothing.html',
  './traps/cynicism.html',
  './traps/nitpicking.html',
  './traps/false_dilemma.html',
  './traps/emotional_reasoning.html',
  './traps/empathy_overload.html',
  './traps/projection.html',
  './traps/mind_reading.html',
  './traps/complexity_bias.html',
  './traps/forest_for_trees.html',
  './traps/single_cause.html',
  './traps/sunk_cost.html',
  './traps/planning_fallacy.html',
  './traps/status_quo.html',
  './traps/action_bias.html',
  './traps/outcome_bias.html',
  './traps/premature_optimization.html',
  './traps/small_sample.html',
  './traps/groupthink.html',
  './traps/style_paralysis.html',
  './traps/hindsight.html',
  './traps/rumination.html',
  './traps/self_blame.html',
  './traps/regret.html',
  './traps/overthinking_past.html',
  './traps/catastrophizing.html',
  './traps/loss_aversion.html',
  './traps/overconfidence.html',
  './traps/availability_heuristic.html',
  './traps/bandwagon.html',
  './traps/halo_effect.html',
  './traps/fundamental_attribution.html',
  './traps/ambiguity_effect.html',
  './traps/cascade.html',
  './traps/devils_advocate_trap.html',
  './traps/echo_chamber.html',
  './traps/isolation_bias.html',
  './traps/optimism_bias.html',
  './traps/recency_bias.html',
  './traps/satisficing.html',
  './traps/survivorship_bias.html',
  './traps/tunnel_vision.html',

  './combiners/index.html',
  './combiners/_assets/combiner-ui.css',
  './combiners/_assets/combiner-page.js',
  './combiners/combiner-enhance.js',
  './combiners/dual/index.html',
  './combiners/dual/workflow.html',
  './combiners/dual/examples.html',
  './combiners/dual/templates.html',
  './combiners/dual/faq.html',
  './combiners/dual/related.html',
  './combiners/triple/index.html',
  './combiners/triple/workflow.html',
  './combiners/triple/examples.html',
  './combiners/triple/templates.html',
  './combiners/triple/faq.html',
  './combiners/triple/related.html',
  './combiners/quad/index.html',
  './combiners/quad/workflow.html',
  './combiners/quad/examples.html',
  './combiners/quad/templates.html',
  './combiners/quad/faq.html',
  './combiners/quad/related.html',
  './combiners/full/index.html',
  './combiners/full/workflow.html',
  './combiners/full/examples.html',
  './combiners/full/templates.html',
  './combiners/full/faq.html',
  './combiners/full/related.html',
  './combiners/quick/index.html',
  './combiners/quick/workflow.html',
  './combiners/quick/examples.html',
  './combiners/quick/templates.html',
  './combiners/quick/faq.html',
  './combiners/quick/related.html',
  './combiners/people/index.html',
  './combiners/people/workflow.html',
  './combiners/people/examples.html',
  './combiners/people/templates.html',
  './combiners/people/faq.html',
  './combiners/people/related.html',
  './combiners/innovation/index.html',
  './combiners/innovation/workflow.html',
  './combiners/innovation/examples.html',
  './combiners/innovation/templates.html',
  './combiners/innovation/faq.html',
  './combiners/innovation/related.html',
  './combiners/problem/index.html',
  './combiners/problem/workflow.html',
  './combiners/problem/examples.html',
  './combiners/problem/templates.html',
  './combiners/problem/faq.html',
  './combiners/problem/related.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('message', (event) => {
  if (event && event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        const keep = key === CACHE_NAME || key === FONT_CACHE;
        if(keep) return null;
        // only clean our own caches; never touch other app caches
        if(key.startsWith('mind-islands-') || key.startsWith('mi-fonts-')) return caches.delete(key);
        return null;
      }))
    ).then(() => self.clients.claim())
  );
});

function isNavigationRequest(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Runtime cache for Google Fonts (works offline after first load)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            // opaque responses (CORS) can still be cached
            cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);
        return cached || fetchPromise.then((res) => res || cached);
      })
    );
    return;
  }

  // Only handle same-origin for the rest
  if (url.origin !== self.location.origin) return;

  // App shell navigation: network-first, fallback to cache
  if (isNavigationRequest(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match('./index.html')) || (await cache.match('./offline.html'));
        })
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => null);

      // Return cached immediately if available, update cache in background
      return cached || fetchPromise.then((res) => res || cached);
    })
  );
});
