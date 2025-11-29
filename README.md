# SnapCat - Super Fast Tree and Cat Utility

## Overview

SnapCat is a high-performance, TypeScript-based command-line utility for generating file tree structures and reading file metadata with advanced features. Designed for developers, system administrators, and anyone working with file systems, SnapCat provides lightning-fast operations with comprehensive output formats.

## Features

- **Hierarchical Tree Generation**: Build detailed directory structures with configurable depth and recursion
- **Multi-Format Output**: Support for JSON and Markdown output formats
- **File Metadata Extraction**: Comprehensive file information including SHA256 hashes, permissions, sizes, and timestamps
- **Pattern Matching**: Advanced glob pattern support for flexible file selection
- **Smart Ignore System**: Automatic integration with `.gitignore` and custom `.snapcatignore` files
- **Content Preview**: Optional file content display with size limits and format detection
- **Performance Optimized**: Concurrent processing, intelligent caching, and memory-efficient operations
- **Security Focused**: Path sanitization, validation, and secure file handling
- **Debug Capabilities**: Detailed logging and performance tracking for development

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Global Installation

```bash
npm install -g snapcat-ts
```

### Local Development Installation

```bash
git clone https://github.com/nxf-oss/snapcat
cd snapcat
npm install
npm run build
```

### Verification

```bash
snapcat --version
snapcat info
```

## Quick Start

### Basic Tree Generation

```bash
# Generate tree of current directory
snapcat tree

# Tree for specific directory
snapcat tree /path/to/project

# Tree with depth limitation
snapcat tree --depth 2
```

### File Operations

```bash
# Read specific files
snapcat cat README.md package.json

# Pattern matching
snapcat cat "src/**/*.ts" "*.json"

# File content preview
snapcat cat README.md --preview
```

## Command Reference

### Tree Command

```bash
snapcat tree [targetPath] [options]
```

**Options:**

- `-r, --recursive`: Enable recursive directory traversal (default: true)
- `--no-recursive`: Disable recursive directory traversal
- `-d, --depth <number>`: Maximum depth for recursion
- `-f, --format <format>`: Output format (json or md)
- `-o, --output <file>`: Save output to specified file
- `--ignore <patterns...>`: Additional ignore patterns
- `-p, --preview`: Preview file contents in output
- `-v, --verbose`: Enable verbose output
- `--debug`: Enable debug mode with performance tracking
- `--show-hidden`: Include hidden files and directories
- `--max-size <bytes>`: Maximum file size to process

### Cat Command

```bash
snapcat cat <patterns...> [options]
```

**Options:**

- `-f, --format <format>`: Output format (json or md)
- `-o, --output <file>`: Save output to specified file
- `--ignore <patterns...>`: Additional ignore patterns
- `-p, --preview`: Preview file contents in output
- `-v, --verbose`: Enable verbose output
- `--debug`: Enable debug mode with performance tracking
- `--max-size <bytes>`: Maximum file size to process
- `--timeout <ms>`: Processing timeout in milliseconds

## Advanced Usage

### Output Formats

**JSON Format:**

```bash
snapcat tree --format json
```

**Markdown Format:**

```bash
snapcat tree --format md
```

### Pattern Examples

```bash
# Multiple file types
snapcat cat "*.{ts,js,json}"

# Recursive pattern
snapcat cat "src/**/*.ts"

# Multiple patterns
snapcat cat "*.md" "*.txt" "docs/**/*.json"
```

### Ignore Patterns

```bash
# Custom ignore patterns
snapcat tree --ignore "*.log" "temp/" "*.tmp"

# Combined with .gitignore
snapcat tree --ignore "node_modules" "dist"
```

### Performance Optimization

```bash
# Limit file size for large directories
snapcat tree --max-size 1048576

# Disable recursion for flat structures
snapcat tree --no-recursive

# Debug performance
snapcat tree --debug --verbose
```

## Configuration

### Default Configuration

SnapCat uses sensible defaults:

- **Maximum File Size**: 5MB for content preview
- **Concurrent Operations**: 20 files simultaneously
- **Default Output Format**: JSON
- **Timeout**: 30 seconds per operation

### Custom Ignore Files

Create `.snapcatignore` in your project root:

```.gitginore
# Custom ignore patterns
*.log
*.tmp
temp/
build/
dist/
.coverage
```

### Environment Variables

```bash
# Increase timeout for large projects
export SNAPCAT_TIMEOUT=60000

# Set default output format
export SNAPCAT_FORMAT=md

# Enable debug mode
export SNAPCAT_DEBUG=true
```

## Output Examples

### JSON Output Structure

```json
{
	"README.md": {
		"extension": ".md",
		"fullPath": "/project/README.md",
		"relativePath": "README.md",
		"baseName": "README",
		"size": "2.45KB",
		"sha256": "a1b2c3d4e5f6...",
		"fileContent": ["# Project Title", "Project description...", "## Installation"],
		"fileType": {
			"isFile": true,
			"isDirectory": false,
			"isSymbolicLink": false
		},
		"lastModified": "2024-01-15T10:30:00.000Z",
		"permissions": "rw-r--r--"
	}
}
```

### Markdown Output Structure

````markdown
# README.md

### File Content

```text
# Project Title
Project description...

## Installation
```
````

### Metadata

```json
{
	"extension": ".md",
	"fullPath": "/project/README.md",
	"relativePath": "README.md",
	"baseName": "README",
	"size": "2.45KB",
	"sha256": "a1b2c3d4e5f6...",
	"fileType": {
		"isFile": true,
		"isDirectory": false,
		"isSymbolicLink": false
	},
	"lastModified": "2024-01-15T10:30:00.000Z",
	"permissions": "rw-r--r--"
}
```

---

```

## API Integration

### Programmatic Usage

```typescript
import { SnapCat } from 'snapcat-ts';

const snapcat = new SnapCat();

// Tree generation
await snapcat.tree('/path/to/directory', {
  recursive: true,
  depth: 3,
  format: 'json',
  preview: true
});

// File operations
await snapcat.cat(['*.ts', '*.js'], {
  preview: true,
  maxSize: 102400,
  format: 'md'
});
````

## Troubleshooting

### Common Issues

**File Content Not Showing:**

```bash
# Ensure preview flag is used
snapcat cat file.txt --preview

# Check file size limits
snapcat cat large-file.log --preview --max-size 10485760
```

**Performance Issues:**

```bash
# Use debug mode to identify bottlenecks
snapcat tree --debug --verbose

# Limit concurrent operations
snapcat tree --max-size 512000
```

**Permission Errors:**

```bash
# Run with appropriate permissions
sudo snapcat tree /system/path

# Or specify accessible directories
snapcat tree $HOME/project
```

### Debug Mode

```bash
# Comprehensive debugging
snapcat tree --debug --verbose

# Debug with specific patterns
snapcat cat "*.ts" --debug --max-size 102400
```

## Performance Characteristics

- **Tree Generation**: Processes approximately 1000 files/second
- **Memory Usage**: Optimized streaming with configurable chunk sizes
- **Concurrent Operations**: Configurable concurrency up to 20 simultaneous file operations
- **Cache Efficiency**: Intelligent caching reduces redundant file system operations

## Security Considerations

- All file paths are sanitized and validated
- Directory traversal attempts are blocked
- File size limits prevent memory exhaustion
- Secure temporary file handling
- Permission-based access control

## Contributing

We welcome contributions to SnapCat. Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on:

- Code standards and style guidelines
- Testing requirements
- Pull request process
- Issue reporting

### Development Setup

```bash
git clone https://github.com/nxf-oss/snapcat
cd snapcat
npm install
npm run build
npm test
```

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Performance tests
npm run test:performance
```

## License

SnapCat is released under the MIT License. See [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: `snapcat docs tutorial`
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: neuxdev1@gmail.com

## Version Information

- **Current Version**: 2.0.0
- **TypeScript**: 5.0+
- **Node.js**: 18.0+
- **License**: MIT

---

_SnapCat is maintained by the [NXF Open Source Software Foundation](https://github.com/nxf-oss). For enterprise support and custom implementations, please contact our enterprise team._
