// Central place to store backend API base URL
// For development, use a fixed localhost backend URL to avoid runtime env issues.
export const API_BASE = 'http://localhost:9097';

// Debug: log resolved API base at runtime
if (typeof window !== 'undefined') {
	// eslint-disable-next-line no-console
	console.debug('[API_BASE]', API_BASE);
}
