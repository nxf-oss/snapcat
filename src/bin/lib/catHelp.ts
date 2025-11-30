export const description = 'Read files and output their metadata and/or contents';

export const helpText = `
Cat Command Examples:
 Basic File Reading:
   $ snapcat cat file.txt                # Single file metadata
   $ snapcat cat file1.txt file2.js      # Multiple files metadata

 Pattern Matching:
   $ snapcat cat "*.ts"                  # All TypeScript files
   $ snapcat cat "src/**/*.js"           # All JS files in src subdirectories
   $ snapcat cat "*.{json,md,txt}"       # Multiple file extensions

 Output Control:
   $ snapcat cat "*.js" --format md      # Markdown format output
   $ snapcat cat "*.md" --output report.md # Save to markdown file

 Content Features:
   $ snapcat cat README.md --preview     # Include file content in output
   $ snapcat cat "*.txt" --max-size 102400 # Only files under 100KB

 Advanced Usage:
   $ snapcat cat "*.log" --ignore "error.log" --verbose
   $ snapcat cat "*.ts" --debug --timeout 30000 # Debug mode with 30s timeout

Cat Output Includes:
  File metadata (extension, size, SHA256 hash, permissions)
  Path information (full, relative, basename)
  File type detection (file, directory, symlink)
  Last modified timestamp
  Optional file content preview with --preview flag`;

export default {
	description,
	helpText,
};
