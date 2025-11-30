import { BaseConfig } from './configTypes.js';

export const baseConfig: BaseConfig = {
	tabSize: 2,
	maxConcurrent: 20,
	ignorePatterns: [
		'node_modules',
		'.git',
		'.DS_Store',
		'Thumbs.db',
		'*.log',
		'*.tmp',
		'*.temp',
		'.npm',
		'.yarn',
		'dist',
		'build',
		'coverage',
		'.nyc_output',
		'*.d.ts',
		'*.map',
	],
	defaultOutputFormat: 'json',
	allowedExtensions: [],
	showHidden: false,
	maxFileSize: 5 * 1024 * 1024, // 5MB
	logLevel: 'info',
	enableCache: true,
	timeout: 1200000, // 20 minutes
};
