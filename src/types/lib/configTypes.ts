export interface SnapCatConfig {
	tabSize: number;
	maxConcurrent: number;
	ignorePatterns: string[];
	defaultOutputFormat: 'json' | 'md';
	allowedExtensions: string[];
	showHidden: boolean;
	maxFileSize: number;
	logLevel: 'debug' | 'info' | 'warn' | 'error';
	enableCache: boolean;
	timeout: number;
}

export interface ConfigOverride {
	tabSize?: number;
	maxConcurrent?: number;
	ignorePatterns?: string[];
	defaultOutputFormat?: 'json' | 'md';
	allowedExtensions?: string[];
	showHidden?: boolean;
	maxFileSize?: number;
	logLevel?: 'debug' | 'info' | 'warn' | 'error';
	enableCache?: boolean;
	timeout?: number;
}

export interface ConfigValidationResult {
	isValid: boolean;
	errors?: string[];
	warnings?: string[];
}

export interface RuntimeConfig extends SnapCatConfig {
	configPath?: string;
	configSource: 'default' | 'file' | 'cli';
	lastLoaded: Date;
}
