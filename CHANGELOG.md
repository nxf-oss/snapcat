# Changelog

All notable changes to this project will be documented in this file.

This project follows the Keep a Changelog specification
and adheres to Semantic Versioning.

## [Unreleased]

---


## [1.0.0] - 2025-11-30

### Added
- First stable release of the SnapCat CLI toolkit.

#### Core Features
- `snapcat cat <path>`:
  - Safe text-preview system.
  - Auto-detection of text vs binary files using extension + heuristic checks.
  - Max-size guard for large file protection.
  - Capped preview length for stability.

- `snapcat tree <path>`:
  - Recursive directory walker.
  - Deterministic ordering.
  - Respect `.ignore` patterns.
  - Depth-based indentation.

#### File Processing Engine
- Concurrency control for batch processing.
- Timeout controller for long-running file operations.
- Metadata extraction:
  - File size
  - Extension
  - Absolute path
  - Relative path
  - Created/modified timestamps
  - Text/binary classification
  - Preview content or `<binary>` placeholder
- Duplicate path resolver and de-duplication pass.
- Preview caching system.

#### Ignore & Filtering System
- Pattern loader supporting:
  - Literal names
  - Glob patterns
  - Nested directory ignores
- Smart grouping into pre-compiled matching rules.

#### Configuration System
- Runtime-loaded configuration via:
  - `defaultConfig`
  - Future override support (env/config file)
- Fields included:
  - `maxFileSize`
  - `allowedExtensions`
  - `ignorePatterns`
  - `timeout`
  - `maxConcurrent`
  - `previewLimit`
  - `binaryPlaceholder`

#### Utility Modules Added
- **FileSystem**
  - Safe `stat` wrapper
  - Safe `readFile` with text enforcement
  - Existence validator
  - Stream-based large read protection

- **Formatter**
  - Tree formatting
  - Preview formatting
  - Unified indentation rules

- **Logger**
  - Channel-based logging: `debug`, `info`, `warn`, `error`
  - Performance timers
  - Structured JSON debug messages for machines

- **Validator**
  - Pattern validation
  - Path validation
  - Option schema checks

- **IgnoreManager**
  - Precompiled pattern set
  - Dual extension/path matching

#### Project Structure
- Fully modular TypeScript architecture.
- CLI entrypoints under `src/bin`.
- Commands under `src/commands`.
- Core engine under `src/core`.
- Generic utilities under `src/utils`.
- Typed interface definitions under `src/types`.
- Documentation and metadata under `src/meta`.

#### Developer Metadata
- Strict TypeScript build using `tsc --build`.
- Complete declaration map generation.
- Tree-shaking friendly module structure (ESM).
- Code style enforced via Prettier.
- Dependency versions pinned for determinism.
- No runtime dependencies except `fast-glob` and Node FS.
- Yarn-based project bootstrap for reproducible lockfiles.

#### Platform & Runtime Behavior
- Fully compatible with:
  - Linux (x64, ARM64)
  - macOS
  - Windows (WSL recommended)
- Node 18+ required.
- No native modules involved.

#### Performance Guarantees
- Max 32 concurrent file ops (configurable).
- Directory scan time optimized by:
  - FastGlob parallel expansion
  - Batching system
- Binary detection avoids decode overreads.

### Changed
- None for the initial stable release.

### Deprecated
- None.

### Removed
- None.

### Fixed
- None.

### Security
- Binary preview lockout:
  - Prevents unsafe terminal output.
  - Ensures only text files are rendered.
- Size limit protection for unexpectedly large or malicious files.
- Timeout enforcement for pathological directory trees.
