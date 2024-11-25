import type { CacheStorage } from '@cloudflare/workers-types';

const MENTIONS_CACHE_KEY = 'mentionsCache';

export async function getCustomCache(caches: CacheStorage | undefined) {
	return await caches?.open(MENTIONS_CACHE_KEY);
}
