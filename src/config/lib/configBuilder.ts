import { SnapCatConfig } from '../../types/index.js';
import { ConfigBuilder } from './configTypes.js';
import { ExtensionDetector } from './configTypes.js';
import { baseConfig } from './baseConfig.js';

export class DefaultConfigBuilder implements ConfigBuilder {
	private extensionDetector: ExtensionDetector;

	constructor(extensionDetector: ExtensionDetector) {
		this.extensionDetector = extensionDetector;
	}

	async buildDefaultConfig(): Promise<SnapCatConfig> {
		const autoExtensions = await this.extensionDetector.detectTextExtensions(process.cwd());

		return {
			...baseConfig,
			allowedExtensions: autoExtensions,
		};
	}

	async buildConfigWithOverrides(overrides: Partial<SnapCatConfig>): Promise<SnapCatConfig> {
		const defaultConfig = await this.buildDefaultConfig();
		return { ...defaultConfig, ...overrides };
	}

	getBaseConfig(): typeof baseConfig {
		return { ...baseConfig };
	}
}
