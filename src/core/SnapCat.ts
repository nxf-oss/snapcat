import { TreeCommand } from '../commands/TreeCommand.js';
import { CatCommand } from '../commands/CatCommand.js';
import { CommandOptions } from '../types/index.js';
import { Logger } from '../utils/Logger.js';
export class SnapCat {
	private treeCommand: TreeCommand;
	private catCommand: CatCommand;
	constructor() {
		Logger.debug('Initializing SnapCat core');
		this.treeCommand = new TreeCommand();
		this.catCommand = new CatCommand();
		Logger.debug('SnapCat core initialized');
	}
	async tree(targetPath?: string, options: CommandOptions = {}) {
		try {
			Logger.debug('Executing tree command via SnapCat core');
			await this.treeCommand.execute(targetPath, options);
			Logger.debug('Tree command completed successfully');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			Logger.error('SnapCat tree execution failed', error);
			throw new Error(`SnapCat tree failed: ${errorMessage}`);
		}
	}
	async cat(filePatterns: string[], options: CommandOptions = {}) {
		try {
			Logger.debug('Executing cat command via SnapCat core');
			await this.catCommand.execute(filePatterns, options);
			Logger.debug('Cat command completed successfully');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			Logger.error('SnapCat cat execution failed', error);
			throw new Error(`SnapCat cat failed: ${errorMessage}`);
		}
	}
	clearCache(): void {
		Logger.debug('Clearing SnapCat caches');
		Logger.debug('SnapCat caches cleared');
	}
}
