import { CommandOptions } from '../../../types/index.js';
import { TreeCommand } from '../../../commands/TreeCommand.js';
import { CatCommand } from '../../../commands/CatCommand.js';
import { CommandExecutionResult } from './types.js';
import { SnapCatLogger } from './logger.js';

export class CommandExecutor {
	private treeCommand: TreeCommand;
	private catCommand: CatCommand;

	constructor(treeCommand: TreeCommand, catCommand: CatCommand) {
		this.treeCommand = treeCommand;
		this.catCommand = catCommand;
	}

	async executeTree(
		targetPath?: string,
		options: CommandOptions = {},
	): Promise<CommandExecutionResult> {
		const startTime = Date.now();

		try {
			SnapCatLogger.debug('Executing tree command via SnapCat core');
			await this.treeCommand.execute(targetPath, options);

			const executionTime = Date.now() - startTime;
			SnapCatLogger.debug('Tree command completed successfully');

			return {
				success: true,
				executionTime,
			};
		} catch (error) {
			const executionTime = Date.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

			SnapCatLogger.error('SnapCat tree execution failed', error);

			return {
				success: false,
				error: `SnapCat tree failed: ${errorMessage}`,
				executionTime,
			};
		}
	}

	async executeCat(
		filePatterns: string[],
		options: CommandOptions = {},
	): Promise<CommandExecutionResult> {
		const startTime = Date.now();

		try {
			SnapCatLogger.debug('Executing cat command via SnapCat core');
			await this.catCommand.execute(filePatterns, options);

			const executionTime = Date.now() - startTime;
			SnapCatLogger.debug('Cat command completed successfully');

			return {
				success: true,
				executionTime,
			};
		} catch (error) {
			const executionTime = Date.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

			SnapCatLogger.error('SnapCat cat execution failed', error);

			return {
				success: false,
				error: `SnapCat cat failed: ${errorMessage}`,
				executionTime,
			};
		}
	}

	validateFilePatterns(filePatterns: string[]): void {
		if (!filePatterns || !Array.isArray(filePatterns) || filePatterns.length === 0) {
			throw new Error('At least one file pattern is required for cat command');
		}

		for (const pattern of filePatterns) {
			if (typeof pattern !== 'string' || pattern.trim().length === 0) {
				throw new Error('File pattern must be a non-empty string');
			}
		}

		SnapCatLogger.debug(`File patterns validated: ${filePatterns.join(', ')}`);
	}

	validateTargetPath(targetPath?: string): string {
		const path = targetPath || '.';
		if (typeof path !== 'string') {
			throw new Error('Target path must be a string');
		}
		return path;
	}
}
