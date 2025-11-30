import { Logger } from './../../utils/Logger.js';
import { CatCommandOptions } from './catTypes.js';
export class CatLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}
	static divider(): void {
		Logger.divider();
	}
	static debug(message: string, data?: any): void {
		Logger.debug(message, data);
	}
	static info(message: string): void {
		Logger.info(message);
	}
	static success(message: string): void {
		Logger.success(message);
	}
	static error(message: string, error?: any): void {
		Logger.error(message, error);
	}
	static logCommandStart(filePatterns: string[], options: CatCommandOptions): void {
		this.divider();
		this.debug('Cat Command Started', {
			filePatterns,
			options,
		});
	}
	static logCommandFinished(executionTime: number, fileCount?: number, verbose?: boolean): void {
		this.debug(`Cat command completed in ${executionTime}ms`);
		if (verbose && fileCount !== undefined) {
			this.info(`Processed ${fileCount} files in ${executionTime}ms`);
		}
	}
	static logErrorContext(error: Error, filePatterns: string[], options: CatCommandOptions): void {
		this.debug('Error context', {
			filePatterns,
			options,
			timestamp: new Date().toISOString(),
			errorMessage: error.message,
		});
	}
}
