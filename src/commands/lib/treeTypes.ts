import { CommandOptions } from '../../types/index.js';

export interface TreeCommandOptions extends CommandOptions {
	recursive?: boolean;
	depth?: number;
	preview?: boolean;
	maxSize?: number;
	format?: 'json' | 'md';
	output?: string;
	verbose?: boolean;
	debug?: boolean;
	ignore?: string[];
}

export interface TreeValidationResult {
	isValid: boolean;
	error?: string;
}

export interface TreeStructure {
	[key: string]: any;
}
