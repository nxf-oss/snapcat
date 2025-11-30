import path from 'path';
import { defaultConfig } from '../config/defaults.js';
import { IgnoreManagerOptions } from './lib/ignoreManager/types.js';
import { IgnoreFileLoader } from './lib/ignoreManager/fileLoader.js';
import { PatternMatcher } from './lib/ignoreManager/patternMatcher.js';
import { IgnoreManagerValidator } from './lib/ignoreManager/validator.js';
import { IgnoreManagerLogger } from './lib/ignoreManager/logger.js';

export class IgnoreManager {
	private patternMatcher: PatternMatcher | null = null;
	private initialized: boolean = false;
	private options: IgnoreManagerOptions;

	constructor(options: IgnoreManagerOptions = {}) {
		this.options = {
			enableCache: true,
			debug: false,
			autoInitialize: false,
			...options,
		};

		IgnoreManagerLogger.setDebugMode(!!this.options.debug);
	}

	async initialize(cwd: string = process.cwd()): Promise<void> {
		if (this.initialized) {
			return;
		}

		IgnoreManagerLogger.logInitialization(cwd);

		// Load default configuration
		const cfg = await defaultConfig();
		const allPatterns = [...cfg.ignorePatterns];

		// Load ignore files
		const filesToLoad = [
			{ path: path.join(cwd, '.gitignore'), name: '.gitignore' },
			{ path: path.join(cwd, '.snapcatignore'), name: '.snapcatignore' },
		];

		const loadResults = await IgnoreFileLoader.loadMultipleFiles(filesToLoad);
		allPatterns.push(...loadResults.patterns);

		// Initialize pattern matcher
		this.patternMatcher = new PatternMatcher(allPatterns);

		this.initialized = true;
		IgnoreManagerLogger.logInitializationComplete(allPatterns.length);
	}

	shouldIgnore(filePath: string, baseName: string): boolean {
		IgnoreManagerValidator.validateInitialization(this.initialized);
		IgnoreManagerValidator.validateFilePath(filePath);
		IgnoreManagerValidator.validateBaseName(baseName);

		if (!this.patternMatcher) {
			return false;
		}

		const result = this.patternMatcher.shouldIgnore(filePath, baseName);
		return result.shouldIgnore;
	}

	addPatterns(patterns: string[]): void {
		IgnoreManagerValidator.validatePatterns(patterns);

		if (this.patternMatcher) {
			this.patternMatcher.addPatterns(patterns);
		}
	}

	getPatterns(): string[] {
		// Return a copy to prevent external modification
		if (this.patternMatcher) {
			// This would need to be implemented in PatternMatcher
			// For now, return empty array
			return [];
		}
		return [];
	}

	// Method to satisfy the interface from TreeBuilder
	loadIgnorePatterns(): void {
		// This is already handled in initialize()
		// For compatibility, we can call initialize if not already initialized
		if (!this.initialized) {
			this.initialize().catch((error) => {
				IgnoreManagerLogger.error('Auto-initialization failed', error);
			});
		}
	}

	// Additional utility methods
	isInitialized(): boolean {
		return this.initialized;
	}

	getPatternCount(): number {
		if (this.patternMatcher) {
			const counts = this.patternMatcher.getPatternCount();
			return counts.simple + counts.compiled;
		}
		return 0;
	}

	clearPatterns(): void {
		if (this.patternMatcher) {
			this.patternMatcher.clearPatterns();
		}
		this.initialized = false;
	}

	reload(cwd: string = process.cwd()): Promise<void> {
		this.clearPatterns();
		return this.initialize(cwd);
	}
}
