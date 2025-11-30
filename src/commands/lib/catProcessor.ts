import { IgnoreManager } from './../../utils/IgnoreManager.js';
import { FileProcessor } from './../../core/FileProcessor.js';
import { CatCommandOptions, ProcessResults } from './catTypes.js';
import { CatLogger } from './catLogger.js';
export class CatProcessor {
  private ignoreManager: IgnoreManager;
  private fileProcessor: FileProcessor;
  constructor() {
    this.ignoreManager = new IgnoreManager();
    this.fileProcessor = new FileProcessor(this.ignoreManager);
  }
  async initializeIgnoreManager(customIgnorePatterns?: string[]): Promise<void> {
    await this.ignoreManager.initialize();
    if (customIgnorePatterns && customIgnorePatterns.length > 0) {
      this.ignoreManager.addPatterns(customIgnorePatterns);
      CatLogger.debug(`Added custom ignore patterns: ${customIgnorePatterns.join(', ')}`);
    }
  }
  async processFiles(filePatterns: string[], options: CatCommandOptions): Promise<ProcessResults> {
    CatLogger.info(`Processing ${filePatterns.length} file pattern(s)...`);
    return await this.fileProcessor.processFiles(filePatterns, {
      preview: options.preview ?? false,
      maxSize: options.maxSize,
      enableCache: !options.debug,
      timeout: options.timeout,
    });
  }
  getFileCount(results: ProcessResults): number {
    return Object.keys(results).length;
  }
}
