export const loadStatsPage = () => import('../pages/StatsPage');

/** Warm the route on intent. A failed preload must not become an unhandled rejection. */
export function preloadStatsPage(): void {
  void loadStatsPage().catch(() => undefined);
}
