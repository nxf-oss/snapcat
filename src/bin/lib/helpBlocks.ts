export const overview = `SnapCat - Super Fast Tree & Cat Utility for Text Files

Features:
• Lightning fast file tree generation
• Smart ignore patterns (.gitignore, .snapcatignore)
• JSON & Markdown output formats
• File metadata with SHA256 hashes
• Recursive directory traversal
• Pattern matching support
• Debug mode for development
• Performance optimized with caching`;

export const examples = `
Examples:
  $ snapcat tree                          # Tree of current directory
  $ snapcat tree src --format md          # Tree in markdown format
  $ snapcat tree --depth 2 --no-recursive # Non-recursive with depth limit
  $ snapcat tree --debug --verbose        # Debug mode with verbose output
  $ snapcat cat "*.ts" "*.json"           # Cat TypeScript and JSON files
  $ snapcat cat README.md --preview       # Preview file contents
  $ snapcat cat "src/**/*.ts" --max-size 102400 # Only files under 100KB`;

export const links = `
Links:
  Homepage: https://github.com/your-org/snapcat
  Bugs: https://github.com/your-org/snapcat/issues
  Contributing: https://github.com/your-org/snapcat/CONTRIBUTING.md
  License: MIT`;

export const footer = `Tip: Use 'snapcat <command> --help' for detailed command usage`;

export default {
	overview,
	examples,
	links,
	footer,
};
