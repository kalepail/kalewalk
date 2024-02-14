import { dev } from '$app/environment'

export const handle = async ({ event, resolve }) => {
	if (dev && !event.platform) {
		const { minifare } = await import('$lib/server/miniflare')
		event.platform = await minifare()
	}
	
	return resolve(event)
};