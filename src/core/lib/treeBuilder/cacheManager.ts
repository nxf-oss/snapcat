import { TreeBuilderLogger } from './logger.js';
import { CacheStats } from './types.js';

export class TreeBuilderCacheManager {
	static getCacheStats(fileSystem: any): CacheStats {
		const stats = fileSystem.getCacheStats();
		TreeBuilderLogger.logCacheStats(stats);
		return stats;
	}

	static clearCache(fileSystem: any): void {
		// Assuming FileSystem has a clearCache method
		if (fileSystem.clearCache) {
			fileSystem.clearCache();
			TreeBuilderLogger.debug('TreeBuilder cache cleared');
		}
	}
}
