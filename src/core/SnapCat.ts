import { TreeCommand } from '../commands/TreeCommand.js';
import { CatCommand } from '../commands/CatCommand.js';
import { CommandOptions } from '../types/index.js';
import { CommandExecutor } from './lib/snapcat/commandExecutor.js';
import { SnapCatCacheManager } from './lib/snapcat/cacheManager.js';
import { SnapCatLogger } from './lib/snapcat/logger.js';
import { SnapCatValidator } from './lib/snapcat/validator.js';
import { SnapCatOptions } from './lib/snapcat/types.js';

export class SnapCat {
	private commandExecutor: CommandExecutor;
	private cacheManager: SnapCatCacheManager;

	constructor(options: SnapCatOptions = {}) {
		SnapCatLogger.setDebugMode(!!options.debug);
		SnapCatLogger.logInitialization();

		const treeCommand = new TreeCommand();
		const catCommand = new CatCommand();

		this.commandExecutor = new CommandExecutor(treeCommand, catCommand);
		this.cacheManager = new SnapCatCacheManager(options.enableCache ?? true);

		SnapCatLogger.logInitializationComplete();
	}

	async tree(targetPath?: string, options: CommandOptions = {}): Promise<void> {
		SnapCatValidator.validateCommandOptions(options);
		const validatedPath = SnapCatValidator.validateTargetPath(targetPath);

		const result = await this.commandExecutor.executeTree(validatedPath, options);

		if (!result.success && result.error) {
			throw new Error(result.error);
		}
	}

	async cat(filePatterns: string[], options: CommandOptions = {}): Promise<void> {
		SnapCatValidator.validateCommandOptions(options);
		SnapCatValidator.validateFilePatterns(filePatterns);

		const result = await this.commandExecutor.executeCat(filePatterns, options);

		if (!result.success && result.error) {
			throw new Error(result.error);
		}
	}

	clearCache(): void {
		SnapCatLogger.logCacheClear();
		this.cacheManager.clearCache();
		SnapCatLogger.logCacheCleared();
	}

	setCacheEnabled(enabled: boolean): void {
		this.cacheManager.setCacheEnabled(enabled);
	}

	getCacheStatus(): { enabled: boolean } {
		return this.cacheManager.getCacheStatus();
	}
}
