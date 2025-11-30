import { Logger } from '../../Logger.js';

export class FormatterLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}

	static debug(message: string, data?: any): void {
		Logger.debug(`[Formatter] ${message}`, data);
	}

	static info(message: string): void {
		Logger.info(`[Formatter] ${message}`);
	}

	static warn(message: string, error?: any): void {
		Logger.warn(`[Formatter] ${message}`, error);
	}

	static error(message: string, error?: any): void {
		Logger.error(`[Formatter] ${message}`, error);
	}

	static logFormatStart(format: string, dataSize?: number): void {
		this.debug(`Formatting tree as ${format} with Prettier`, {
			dataSize,
			timestamp: new Date().toISOString(),
		});
	}

	static logFormatComplete(format: string, contentLength: number): void {
		this.debug(`${format.toUpperCase()} output length: ${contentLength} characters`);
	}

	static logMarkdownStructure(level: number, itemCount: number): void {
		this.debug(`Building markdown structure at level ${level} with ${itemCount} items`);
	}

	static logJSONStructure(itemCount: number): void {
		this.debug(`Building JSON structure with ${itemCount} items`);
	}

	static logPreviewGeneration(metadata: any): void {
		this.debug('Generating preview format', {
			file: `${metadata.baseName}${metadata.extension}`,
			hasContent: metadata.fileContent?.length > 0,
		});
	}
}
