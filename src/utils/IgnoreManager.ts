import { promises as fs } from 'fs';
import path from 'path';
import { defaultConfig } from '../config/defaults.js';
import { Logger } from './Logger.js';

export class IgnoreManager {
	loadIgnorePatterns() {
		throw new Error('Method not implemented.');
	}
	private patterns: string[] = [];
	private patternRegexes: RegExp[] = [];
	private initialized: boolean = false;

	async initialize(cwd: string = process.cwd()): Promise<void> {
		if (this.initialized) {
			return;
		}

		Logger.debug('Initializing IgnoreManager');
		const cfg = await defaultConfig();
		this.patterns = [...cfg.ignorePatterns];

		// Load .gitignore
		const gitignorePath = path.join(cwd, '.gitignore');
		await this.loadIgnoreFile(gitignorePath, '.gitignore');

		// Load .snapcatignore
		const snapcatIgnorePath = path.join(cwd, '.snapcatignore');
		await this.loadIgnoreFile(snapcatIgnorePath, '.snapcatignore');

		// Compile patterns to regex for faster matching
		this.compilePatterns();

		this.initialized = true;
		Logger.debug(`IgnoreManager initialized with ${this.patterns.length} patterns`);
	}

	private async loadIgnoreFile(filePath: string, fileName: string): Promise<void> {
		try {
			if (await this.fileExists(filePath)) {
				Logger.debug(`Loading ${fileName} from: ${filePath}`);
				const patterns = await this.parseIgnoreFile(filePath);
				this.patterns.push(...patterns);
				Logger.debug(`Loaded ${patterns.length} patterns from ${fileName}`);
			} else {
				Logger.debug(`${fileName} not found at: ${filePath}`);
			}
		} catch (error) {
			Logger.error(`Failed to load ${fileName}: ${filePath}`, error);
		}
	}

	private async parseIgnoreFile(filePath: string): Promise<string[]> {
		try {
			const content = await fs.readFile(filePath, 'utf8');
			return content
				.split('\n')
				.filter((line) => line.trim() && !line.startsWith('#'))
				.map((pattern) => pattern.trim())
				.filter((pattern) => pattern.length > 0);
		} catch (error) {
			Logger.error(`Failed to parse ignore file: ${filePath}`, error);
			return [];
		}
	}

	private compilePatterns(): void {
		Logger.debug('Compiling ignore patterns to regex');
		this.patternRegexes = this.patterns
			.map((pattern) => {
				try {
					// Convert gitignore pattern to regex
					let regexPattern = pattern
						.replace(/([.+^${}()|[\]\\])/g, '\\$1') // Escape special chars
						.replace(/\*\*/g, '.*') // ** matches any characters
						.replace(/\*/g, '[^/]*') // * matches any characters except /
						.replace(/\?/g, '[^/]'); // ? matches any single character except /

					// If pattern starts with /, it matches from root
					// Otherwise, it can match anywhere
					if (!regexPattern.startsWith('/')) {
						regexPattern = `(^|/)${regexPattern}`;
					}

					// If pattern ends with /, it matches directories
					if (regexPattern.endsWith('/')) {
						regexPattern = regexPattern.slice(0, -1) + '($|/)';
					} else {
						regexPattern += '$';
					}

					return new RegExp(regexPattern);
				} catch (error) {
					Logger.error(`Failed to compile pattern: ${pattern}`, error);
					return null;
				}
			})
			.filter((regex): regex is RegExp => regex !== null);

		Logger.debug(`Compiled ${this.patternRegexes.length} regex patterns`);
	}

	shouldIgnore(filePath: string, baseName: string): boolean {
		if (!this.initialized) {
			Logger.warn('IgnoreManager not initialized. Call initialize() first.', null);
			return false;
		}

		// Quick check for common ignored base names
		const quickIgnore = this.patterns.some((pattern) => {
			if (!pattern.includes('*') && !pattern.includes('?')) {
				return baseName === pattern;
			}
			return false;
		});

		if (quickIgnore) {
			Logger.debug(`Quick ignored: ${filePath} (baseName: ${baseName})`);
			return true;
		}

		// Full regex matching
		const shouldIgnore = this.patternRegexes.some((regex) => {
			const matches = regex.test(filePath) || regex.test(baseName);
			if (matches) {
				Logger.debug(`Regex ignored: ${filePath} (pattern: ${regex.source})`);
			}
			return matches;
		});

		return shouldIgnore;
	}

	addPatterns(patterns: string[]): void {
		Logger.debug(`Adding ${patterns.length} custom ignore patterns`);
		this.patterns.push(...patterns);
		this.compilePatterns(); // Recompile with new patterns
	}

	getPatterns(): string[] {
		return [...this.patterns];
	}

	private async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
}
