export const description = 'Build a hierarchical tree of files and directories';

export const helpText = `
Tree Command Examples:
 Basic Usage:
   $ snapcat tree                        # Current directory tree
   $ snapcat tree /path/to/project       # Specific directory tree

 Output Formats:
   $ snapcat tree --format json          # JSON output (default)
   $ snapcat tree --format md            # Markdown output

 Recursion Control:
   $ snapcat tree --no-recursive         # Current directory only
   $ snapcat tree --depth 3              # Limit recursion depth to 3

 File Management:
   $ snapcat tree --output tree.json     # Save to file
   $ snapcat tree --ignore "*.log tmp"   # Ignore log files and tmp dir
   $ snapcat tree --max-size 1048576     # Only process files under 1MB

 Advanced:
   $ snapcat tree --verbose --show-hidden # Detailed output with hidden files
   $ snapcat tree --debug --preview      # Debug mode with file content preview

Tree Output Structure:
 The tree command generates a hierarchical structure where:
  Directories are represented as nested objects
  Files include metadata (size, SHA256, path info, permissions)
  Output can be formatted as JSON or Markdown
  Optional file content preview with --preview flag`;

export default {
	description,
	helpText,
};
