import { CommandOptions } from '../../../types/index.js';
import { TreeCommand } from '../../../commands/TreeCommand.js';
import { CatCommand } from '../../../commands/CatCommand.js';

export interface SnapCatDependencies {
	treeCommand: TreeCommand;
	catCommand: CatCommand;
}

export interface CommandExecutionResult {
	success: boolean;
	error?: string;
	executionTime: number;
}

export interface SnapCatOptions {
	enableCache?: boolean;
	debug?: boolean;
}

export interface CacheStats {
	cleared: boolean;
	timestamp: number;
}
