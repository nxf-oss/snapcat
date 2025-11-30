export interface CommandOptions {
	recursive?: boolean;
	output?: string;
	format?: 'json' | 'md';
	depth?: number;
	ignore?: string[];
	preview?: boolean;
	verbose?: boolean;
	maxSize?: number;
	debug?: boolean;
	showHidden?: boolean;
	timeout?: number;
}

export interface CatCommandOptions extends CommandOptions {
	filePatterns: string[];
	enableCache?: boolean;
}

export interface TreeCommandOptions extends CommandOptions {
	targetPath?: string;
	enableCache?: boolean;
}

export interface CommandExecutionResult {
	success: boolean;
	error?: string;
	executionTime: number;
	filesProcessed?: number;
	outputPath?: string;
}

export interface CommandValidationResult {
	isValid: boolean;
	error?: string;
	warnings?: string[];
}
