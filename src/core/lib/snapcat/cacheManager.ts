import { SnapCatLogger } from './logger.js';
import { CacheStats } from './types.js';

export class SnapCatCacheManager {
	private cacheEnabled: boolean = true;

	constructor(enableCache: boolean = true) {
		this.cacheEnabled = enableCache;
	}

	clearCache(): CacheStats {
		const startTime = Date.now();

		SnapCatLogger.debug('Clearing SnapCat caches');

		// Here you would clear actual caches from TreeCommand and CatCommand
		// For now, we'll just log the action

		const executionTime = Date.now() - startTime;
		SnapCatLogger.debug('SnapCat caches cleared');

		return {
			cleared: true,
			timestamp: Date.now(),
		};
	}

	setCacheEnabled(enabled: boolean): void {
		this.cacheEnabled = enabled;
		SnapCatLogger.debug(`Cache enabled: ${enabled}`);
	}

	isCacheEnabled(): boolean {
		return this.cacheEnabled;
	}

	getCacheStatus(): { enabled: boolean; clearedAt?: number } {
		return {
			enabled: this.cacheEnabled,
		};
	}
}
