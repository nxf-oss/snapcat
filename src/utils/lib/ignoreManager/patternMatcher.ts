import { PatternMatchResult } from './types.js';
import { IgnoreManagerLogger } from './logger.js';
import { PatternCompiler } from './patternCompiler.js';

export class PatternMatcher {
	private simplePatterns: string[] = [];
	private compiledPatterns: Array<{ regex: RegExp; original: string }> = [];

	constructor(patterns: string[]) {
		this.simplePatterns = patterns;
		this.compiledPatterns = PatternCompiler.compilePatterns(patterns).map((cp) => ({
			regex: cp.regex,
			original: cp.original,
		}));
	}

	shouldIgnore(filePath: string, baseName: string): PatternMatchResult {
		// Quick check for simple patterns (exact baseName matches)
		const quickMatch = PatternCompiler.hasSimplePattern(this.simplePatterns, baseName);
		if (quickMatch) {
			IgnoreManagerLogger.logQuickIgnore(filePath, baseName);
			return {
				shouldIgnore: true,
				matchedPattern: baseName,
				matchType: 'quick',
			};
		}

		// Full regex matching
		for (const compiled of this.compiledPatterns) {
			const matches = compiled.regex.test(filePath) || compiled.regex.test(baseName);
			if (matches) {
				IgnoreManagerLogger.logRegexIgnore(filePath, compiled.original);
				return {
					shouldIgnore: true,
					matchedPattern: compiled.original,
					matchType: 'regex',
				};
			}
		}

		return {
			shouldIgnore: false,
		};
	}

	addPatterns(patterns: string[]): void {
		IgnoreManagerLogger.logCustomPatternsAdded(patterns.length);

		// Add to simple patterns
		this.simplePatterns.push(...patterns);

		// Compile and add to regex patterns
		const newCompiled = PatternCompiler.compilePatterns(patterns);
		this.compiledPatterns.push(
			...newCompiled.map((cp) => ({
				regex: cp.regex,
				original: cp.original,
			})),
		);
	}

	getPatternCount(): { simple: number; compiled: number } {
		return {
			simple: this.simplePatterns.length,
			compiled: this.compiledPatterns.length,
		};
	}

	clearPatterns(): void {
		this.simplePatterns = [];
		this.compiledPatterns = [];
	}
}
