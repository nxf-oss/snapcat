import { Logger } from '../../../utils/Logger.js';

export class SnapCatLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}

	static debug(message: string, data?: any): void {
		Logger.debug(`[SnapCat] ${message}`, data);
	}

	static info(message: string): void {
		Logger.info(`[SnapCat] ${message}`);
	}

	static warn(message: string, error?: any): void {
		Logger.warn(`[SnapCat] ${message}`, error);
	}

	static error(message: string, error?: any): void {
		Logger.error(`[SnapCat] ${message}`, error);
	}

	static logInitialization(): void {
		this.debug('Initializing SnapCat core');
	}

	static logInitializationComplete(): void {
		this.debug('SnapCat core initialized');
	}

	static logCommandExecution(command: 'tree' | 'cat', target: string): void {
		this.debug(`Executing ${command} command via SnapCat core`, { target });
	}

	static logCommandSuccess(command: 'tree' | 'cat', executionTime: number): void {
		this.debug(`${command} command completed successfully`, {
			executionTime: `${executionTime}ms`,
		});
	}

	static logCommandError(command: 'tree' | 'cat', error: any): void {
		this.error(`SnapCat ${command} execution failed`, error);
	}

	static logCacheClear(): void {
		this.debug('Clearing SnapCat caches');
	}

	static logCacheCleared(): void {
		this.debug('SnapCat caches cleared');
	}
}
