/**
 * Demo Mode Configuration for Hackathon Rounds
 * ──────────────────────────────────────────────
 * Change DEMO_MODE to control which features are visible:
 *   "round1" → Public pages + Login + Dashboard only
 *   "round2" → Adds Crop Health & Irrigation modules
 *   "round3" → Full application (all modules enabled)
 *
 * To switch rounds, change ONLY the value below.
 */
export const DEMO_MODE = "round1";

/**
 * Routes that are RESTRICTED (blocked) in each round.
 * Any route listed here will redirect to /dashboard if accessed.
 * Public routes and /dashboard are always accessible.
 */
const restrictedRoutes = {
  round1: [
    "/dashboard/crop-health",
    "/dashboard/irrigation",
    "/dashboard/chatbot",
  ],
  round2: [
    "/dashboard/chatbot",
  ],
  round3: [],
};

/**
 * Check if a given route path is restricted in the current demo mode.
 * @param {string} path - The route path to check
 * @returns {boolean} true if the route is blocked
 */
export function isRouteRestricted(path) {
  const restricted = restrictedRoutes[DEMO_MODE] || [];
  return restricted.includes(path);
}

/**
 * Filter an array of link objects, removing any whose `to` property
 * is restricted in the current demo mode.
 * Works with both Navbar links and Dashboard quickLinks.
 * @param {Array<{to: string}>} links
 * @returns {Array<{to: string}>}
 */
export function getVisibleLinks(links) {
  const restricted = restrictedRoutes[DEMO_MODE] || [];
  return links.filter((link) => !restricted.includes(link.to));
}
