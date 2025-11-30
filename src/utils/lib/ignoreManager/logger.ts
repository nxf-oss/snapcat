import { Logger } from '../../Logger.js';
export class IgnoreManagerLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}
	static debug(message: string, data?: any): void {
		Logger.debug(`[IgnoreManager] ${message}`, data);
	}
	static info(message: string): void {
		Logger.info(`[IgnoreManager] ${message}`);
	}
	static warn(message: string, error?: any): void {
		Logger.warn(`[IgnoreManager] ${message}`, error);
	}
	static error(message: string, error?: any): void {
		Logger.error(`[IgnoreManager] ${message}`, error);
	}
	static logInitialization(cwd: string): void {
		this.debug('Initializing IgnoreManager', { cwd });
	}
	static logInitializationComplete(patternCount: number): void {
		this.debug(`IgnoreManager initialized with ${patternCount} patterns`);
	}
	static logFileLoadAttempt(filePath: string, fileName: string): void {
		this.debug(`Loading ${fileName} from: ${filePath}`);
	}
	static logFileLoadSuccess(fileName: string, patternCount: number): void {
		this.debug(`Loaded ${patternCount} patterns from ${fileName}`);
	}
	static logFileNotFound(filePath: string, fileName: string): void {
		this.debug(`${fileName} not found at: ${filePath}`);
	}
	static logFileLoadError(filePath: string, fileName: string, error: any): void {
		this.error(`Failed to load ${fileName}: ${filePath}`, error);
	}
	static logPatternCompilationStart(): void {
		this.debug('Compiling ignore patterns to regex');
	}
	static logPatternCompilationComplete(regexCount: number): void {
		this.debug(`Compiled ${regexCount} regex patterns`);
	}
	static logPatternCompilationError(pattern: string, error: any): void {
		this.error(`Failed to compile pattern: ${pattern}`, error);
	}
	static logQuickIgnore(filePath: string, baseName: string): void {
		this.debug(`Quick ignored: ${filePath} (baseName: ${baseName})`);
	}
	static logRegexIgnore(filePath: string, pattern: string): void {
		this.debug(`Regex ignored: ${filePath} (pattern: ${pattern})`);
	}
	static logCustomPatternsAdded(count: number): void {
		this.debug(`Adding ${count} custom ignore patterns`);
	}
	static logUninitializedWarning(): void {
		this.warn('IgnoreManager not initialized. Call initialize() first.', null);
	}
}
