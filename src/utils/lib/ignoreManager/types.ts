export interface IgnorePattern {
	pattern: string;
	source: 'default' | 'gitignore' | 'snapcatignore' | 'custom';
	lineNumber?: number;
}

export interface PatternMatchResult {
	shouldIgnore: boolean;
	matchedPattern?: string;
	matchType?: 'quick' | 'regex' | 'exact';
}

export interface IgnoreManagerOptions {
	enableCache?: boolean;
	debug?: boolean;
	autoInitialize?: boolean;
}

export interface FileLoadResult {
	success: boolean;
	patterns: string[];
	filePath: string;
	fileName: string;
	error?: string;
}

export interface CompiledPattern {
	regex: RegExp;
	original: string;
	source: string;
}
