import { Cache, D1Database, CacheStorage, ExecutionContext } from '@cloudflare/workers-types'

declare global {
	// See https://kit.svelte.dev/docs/types#app
	// for information about these interfaces
	// and what to do when importing types
	declare namespace App {
		// interface Locals {}
		// interface PageData {}
		// interface Error {}
		interface Platform {
			caches?: {
				default: Cache;
				open: typeof CacheStorage.prototype.open;
			};
			env?: {
				BLOGDB: D1Database;
			};
			context: {
				waitUntil: typeof ExecutionContext.prototype.waitUntil;
			};
		}
	}
}