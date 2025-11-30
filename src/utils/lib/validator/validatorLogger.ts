import { Logger } from '../../Logger.js';

export class ValidatorLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}

	static debug(message: string, data?: any): void {
		Logger.debug(`[Validator] ${message}`, data);
	}

	static info(message: string): void {
		Logger.info(`[Validator] ${message}`);
	}

	static warn(message: string, error?: any): void {
		Logger.warn(`[Validator] ${message}`, error);
	}

	static error(message: string, error?: any): void {
		Logger.error(`[Validator] ${message}`, error);
	}

	static logPathValidation(filePath: string): void {
		this.debug(`Validating file path: ${filePath}`);
	}

	static logPatternValidation(patternCount: number): void {
		this.debug(`Validating ${patternCount} patterns`);
	}

	static logOptionsValidation(): void {
		this.debug('Validating command options');
	}

	static logPathSanitization(inputPath: string): void {
		this.debug(`Sanitizing path: ${inputPath}`);
	}

	static logSanitizedPath(sanitizedPath: string): void {
		this.debug(`Sanitized path: ${sanitizedPath}`);
	}

	static logValidationSuccess(validator: string): void {
		this.debug(`${validator} validation passed`);
	}

	static logValidationFailure(validator: string, error: string): void {
		this.debug(`${validator} validation failed: ${error}`);
	}
}
