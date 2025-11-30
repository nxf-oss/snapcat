import { Logger } from '../../utils/Logger.js';
import { TreeCommandOptions } from './treeTypes.js';

export class TreeLogger {
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

	static logCommandStart(targetPath: string, options: TreeCommandOptions): void {
		this.divider();
		this.debug('Tree Command Started', {
			targetPath,
			options,
		});
	}

	static logCommandFinished(executionTime: number, verbose?: boolean): void {
		this.debug(`Tree command completed in ${executionTime}ms`);

		if (verbose) {
			this.info(`Execution completed in ${executionTime}ms`);
		}
	}

	static logErrorContext(error: Error, targetPath: string, options: TreeCommandOptions): void {
		this.debug('Error context', {
			targetPath,
			options,
			timestamp: new Date().toISOString(),
			errorMessage: error.message,
		});
	}

	static logSanitizedPath(sanitizedPath: string): void {
		this.debug(`Sanitized target path: ${sanitizedPath}`);
	}
}
