import { CompiledPattern } from './types.js';
import { IgnoreManagerLogger } from './logger.js';

export class PatternCompiler {
	static compilePatterns(patterns: string[], source: string = 'custom'): CompiledPattern[] {
		IgnoreManagerLogger.logPatternCompilationStart();

		const compiled: CompiledPattern[] = [];

		for (const pattern of patterns) {
			try {
				const regex = this.compileSinglePattern(pattern);
				compiled.push({
					regex,
					original: pattern,
					source,
				});
			} catch (error) {
				IgnoreManagerLogger.logPatternCompilationError(pattern, error);
				// Continue with other patterns even if one fails
			}
		}

		IgnoreManagerLogger.logPatternCompilationComplete(compiled.length);
		return compiled;
	}

	private static compileSinglePattern(pattern: string): RegExp {
		// Convert gitignore pattern to regex
		let regexPattern = pattern
			.replace(/([.+^${}()|[\]\\])/g, '\\$1') // Escape special chars
			.replace(/\*\*/g, '.*') // ** matches any characters
			.replace(/\*/g, '[^/]*') // * matches any characters except /
			.replace(/\?/g, '[^/]'); // ? matches any single character except /

		// If pattern starts with /, it matches from root
		// Otherwise, it can match anywhere
		if (!regexPattern.startsWith('/')) {
			regexPattern = `(^|/)${regexPattern}`;
		}

		// If pattern ends with /, it matches directories
		if (regexPattern.endsWith('/')) {
			regexPattern = regexPattern.slice(0, -1) + '($|/)';
		} else {
			regexPattern += '$';
		}

		return new RegExp(regexPattern);
	}

	static hasSimplePattern(patterns: string[], baseName: string): boolean {
		return patterns.some((pattern) => {
			// Quick check for patterns without wildcards that match baseName exactly
			if (!pattern.includes('*') && !pattern.includes('?') && !pattern.includes('/')) {
				return baseName === pattern;
			}
			return false;
		});
	}
}
