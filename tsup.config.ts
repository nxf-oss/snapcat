import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const pkg = JSON.parse(readFileSync(resolve('./package.json'), 'utf8'));

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm'],
	dts: true,
	sourcemap: true,
	minify: false,
	clean: true,
	bundle: true,
	splitting: false,
	target: 'node18',
	platform: 'node',
	tsconfig: resolve('tsconfig.json'),
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
		...Object.keys(pkg.devDependencies || {}),
	],
	esbuildOptions(options) {
		options.banner = {
			js: '#!/usr/bin/env node',
		};
	},
	treeshake: true,
	metafile: true,
	onSuccess: 'chmod +x dist/index.js',
});
