import { SnapCatConfig } from '../../types/index.js';

export interface ExtensionDetector {
	detectTextExtensions(rootDir: string): Promise<string[]>;
}

export interface ConfigBuilder {
	buildDefaultConfig(): Promise<SnapCatConfig>;
}

export interface BaseConfig {
	tabSize: number;
	maxConcurrent: number;
	ignorePatterns: string[];
	defaultOutputFormat: 'json' | 'md';
	allowedExtensions: string[];
	showHidden: boolean;
	maxFileSize: number;
	logLevel: 'info' | 'debug' | 'warn' | 'error';
	enableCache: boolean;
	timeout: number;
}
