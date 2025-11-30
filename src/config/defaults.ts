import { SnapCatConfig } from '../types/index.js';
import { ConfigManager } from './lib/configManager.js';

// Create singleton instance
const configManager = new ConfigManager();

/**
 * Get the default configuration with auto-detected text extensions
 */
export async function defaultConfig(): Promise<SnapCatConfig> {
	return await configManager.getDefaultConfig();
}

/**
 * Get configuration with custom overrides
 */
export async function configWithOverrides(
	overrides: Partial<SnapCatConfig>,
): Promise<SnapCatConfig> {
	return await configManager.getConfigWithOverrides(overrides);
}

/**
 * Get base configuration without auto-detected extensions
 */
export function baseConfig() {
	return configManager.getBaseConfig();
}

/**
 * Clear cached configuration
 */
export function clearConfigCache(): void {
	configManager.clearCache();
}
