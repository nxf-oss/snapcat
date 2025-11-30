import { SnapCatConfig } from '../../types/index.js';
import { DefaultConfigBuilder } from './configBuilder.js';
import { DefaultExtensionDetector } from './extensionDetector.js';

export class ConfigManager {
	private configBuilder: DefaultConfigBuilder;
	private cachedConfig: SnapCatConfig | null = null;

	constructor() {
		const extensionDetector = new DefaultExtensionDetector();
		this.configBuilder = new DefaultConfigBuilder(extensionDetector);
	}

	async getDefaultConfig(useCache: boolean = true): Promise<SnapCatConfig> {
		if (useCache && this.cachedConfig) {
			return this.cachedConfig;
		}

		this.cachedConfig = await this.configBuilder.buildDefaultConfig();
		return this.cachedConfig;
	}

	async getConfigWithOverrides(overrides: Partial<SnapCatConfig>): Promise<SnapCatConfig> {
		const config = await this.configBuilder.buildConfigWithOverrides(overrides);
		this.cachedConfig = config;
		return config;
	}

	clearCache(): void {
		this.cachedConfig = null;
	}

	getBaseConfig() {
		return this.configBuilder.getBaseConfig();
	}
}
