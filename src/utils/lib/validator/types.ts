export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

export interface PathValidationOptions {
	maxLength?: number;
	allowRelative?: boolean;
	requireAbsolute?: boolean;
}

export interface PatternValidationOptions {
	maxPatternLength?: number;
	minPatterns?: number;
	maxPatterns?: number;
}

export interface OptionsValidationRules {
	allowedFormats?: string[];
	maxDepth?: number;
	maxSize?: number;
}

export interface SanitizationOptions {
	removeNullBytes?: boolean;
	resolveRelative?: boolean;
	normalizePath?: boolean;
}
