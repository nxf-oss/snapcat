import { CommandOptions } from './../../types/index.js';
export interface CatCommandOptions extends CommandOptions {
	preview?: boolean;
	maxSize?: number;
	format?: 'json' | 'md';
	output?: string;
	verbose?: boolean;
	debug?: boolean;
	ignore?: string[];
	timeout?: number;
}
export interface ValidationResult {
	isValid: boolean;
	error?: string;
}
export interface ProcessResults {
	[key: string]: any;
}
