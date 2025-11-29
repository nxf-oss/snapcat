export interface FileMetadata {
	extension: string;
	fullPath: string;
	relativePath: string;
	baseName: string;
	size: string;
	sha256: string;
	fileContent: string[];
	fileType: {
		isFile: boolean;
		isDirectory: boolean;
		isSymbolicLink: boolean;
	};
	lastModified?: string;
	permissions?: string;
}

export interface TreeStructure {
	[key: string]: FileMetadata | TreeStructure;
}

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
