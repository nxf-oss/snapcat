#!/usr/bin/env bash
set -euo pipefail
# =============================================
# CONFIGURASI UTAMA - AUTO DETECT
# =============================================
APP_NAME="snapcat"
VERSION="${1:-$(node -p "require('./package.json').version")}"
BUILD_DIR="dist"
DOWNLOAD_BASE_DIR="downloads"
RELEASE_DIR="$DOWNLOAD_BASE_DIR/v$VERSION"
BINARIES_DIR="$RELEASE_DIR/bin"
PACKAGES_DIR="$RELEASE_DIR/terbal"
# Auto detect semua platform dan architecture yang supported
declare -A SUPPORTED_TARGETS=(
    ["linux-x64"]=1
    ["linux-arm64"]=1
    ["darwin-x64"]=1
    ["darwin-arm64"]=1
)
# =============================================
# FUNGSI UTILITY - COLORED OUTPUT
# =============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
log() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${BLUE}ℹ${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }
step() { echo -e "${MAGENTA}→${NC} $1"; }
success() { echo -e "${GREEN}🎉${NC} $1"; }
# =============================================
# FUNGSI DETECTION DAN VALIDATION
# =============================================
detect_tools() {
    info "Detecting build tools..."
    # Check Bun
    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun --version)
        log "Bun detected: $BUN_VERSION"
        HAS_BUN=true
    else
        warn "Bun not found, will use Node.js fallback"
        HAS_BUN=false
    fi
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log "Node.js detected: $NODE_VERSION"
        HAS_NODE=true
    else
        error "Node.js is required but not found"
    fi
    # Check GPG for signing
    if command -v gpg &> /dev/null; then
        GPG_INFO=$(gpg --list-secret-keys --keyid-format LONG 2>/dev/null | grep -c "sec") || true
        if [ "$GPG_INFO" -gt 0 ]; then
            log "GPG detected with available keys"
            HAS_GPG=true
        else
            warn "GPG found but no signing keys available"
            HAS_GPG=false
        fi
    else
        warn "GPG not found, skipping package signing"
        HAS_GPG=false
    fi
    # Check compression tools
    for tool in tar zip; do
        if ! command -v $tool &> /dev/null; then
            error "$tool is required but not found"
        fi
    done
    log "All compression tools available"
}
validate_environment() {
    info "Validating build environment..."
    # Check source files exist
    if [ ! -f "package.json" ]; then
        error "package.json not found"
    fi
    if [ ! -d "src" ]; then
        error "src directory not found"
    fi
    # Check build dependencies
    if [ ! -f "tsup.config.ts" ] && [ ! -f "tsconfig.json" ]; then
        error "TypeScript configuration not found"
    fi
    log "Build environment validated"
}
# =============================================
# FUNGSI CLEAN DAN SETUP
# =============================================
clean_build() {
    step "Cleaning previous builds..."
    rm -rf "$BUILD_DIR"
    rm -rf "$DOWNLOAD_BASE_DIR"
    mkdir -p "$BINARIES_DIR"
    mkdir -p "$PACKAGES_DIR"
    log "Clean completed"
}
create_directory_structure() {
    step "Creating directory structure..."
    for target in "${!SUPPORTED_TARGETS[@]}"; do
        IFS='-' read -r platform arch <<< "$target"
        mkdir -p "$BINARIES_DIR/$platform/$arch"
        mkdir -p "$PACKAGES_DIR/$platform"
    done
    log "Directory structure created for ${#SUPPORTED_TARGETS[@]} targets"
}
# =============================================
# FUNGSI BUILD PROJECT
# =============================================
build_project() {
    step "Building project..."
    if [ "$HAS_BUN" = true ]; then
        info "Using Bun for build (faster)"
        if bun run build; then
            log "Bun build successful"
            return 0
        else
            warn "Bun build failed, falling back to npm"
        fi
    fi
    # Fallback to npm/node
    if npm run build; then
        log "npm build successful"
    else
        error "Build failed with all methods"
    fi
}
# =============================================
# FUNGSI BINARY COMPILATION
# =============================================
compile_with_bun() {
    local platform=$1
    local arch=$2
    local output_file="$BINARIES_DIR/$platform/$arch/$APP_NAME"
    [[ "$platform" == "win32" ]] && output_file="${output_file}.exe"
    step "Compiling $platform-$arch with Bun..."
    if bun build ./src/index.ts \
        --outfile "$output_file" \
        --target "bun-$platform-$arch" \
        --compile \
        --minify \
        --sourcemap > /dev/null 2>&1; then
        if [[ "$platform" != "win32" ]]; then
            chmod +x "$output_file"
        fi
        log "Bun compilation successful: $(basename "$output_file")"
        return 0
    else
        warn "Bun compilation failed for $platform-$arch"
        return 1
    fi
}
compile_with_node() {
    local platform=$1
    local arch=$2
    local output_dir="$BINARIES_DIR/$platform/$arch"
    local output_file="$output_dir/$APP_NAME"
    [[ "$platform" == "win32" ]] && output_file="${output_file}.exe"
    step "Creating Node.js bundle for $platform-$arch..."
    # Ensure directory exists
    mkdir -p "$output_dir"
    # Copy all built files
    cp -r "$BUILD_DIR"/* "$output_dir/"
    # Create platform-specific launcher
    if [[ "$platform" == "win32" ]]; then
        cat > "$output_file" << 'EOF'
@echo off
node "%~dp0/index.js" %*
EOF
    else
        cat > "$output_file" << 'EOF'
#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$DIR/index.js" "$@"
EOF
        chmod +x "$output_file"
    fi
    log "Node.js bundle created: $(basename "$output_file")"
}
compile_binary() {
    local platform=$1
    local arch=$2
    if [ "$HAS_BUN" = true ]; then
        if compile_with_bun "$platform" "$arch"; then
            return 0
        fi
    fi
    # Fallback to Node.js method
    compile_with_node "$platform" "$arch"
}
# =============================================
# FUNGSI PACKAGE CREATION
# =============================================
create_packages() {
    step "Creating distribution packages..."
    for target in "${!SUPPORTED_TARGETS[@]}"; do
        IFS='-' read -r platform arch <<< "$target"
        local binary_name="$APP_NAME"
        [[ "$platform" == "win32" ]] && binary_name="${APP_NAME}.exe"
        local binary_path="$BINARIES_DIR/$platform/$arch/$binary_name"
        local package_base="$PACKAGES_DIR/$platform/$APP_NAME-$VERSION-$platform-$arch"
        if [[ -f "$binary_path" ]]; then
            # Create tar.gz for Unix-like systems
            if [[ "$platform" != "win32" ]]; then
                tar -czf "${package_base}.tar.gz" -C "$(dirname "$binary_path")" "$binary_name"
                log "Created: $(basename "${package_base}.tar.gz")"
            fi
            # Create zip for all platforms
            zip -j -q "${package_base}.zip" "$binary_path"
            log "Created: $(basename "${package_base}.zip")"
        else
            warn "Binary not found: $binary_path"
        fi
    done
    success "Packages created for all targets"
}
# =============================================
# FUNGSI SECURITY (CHECKSUM & SIGNING)
# =============================================
generate_checksums() {
    step "Generating cryptographic checksums..."
    local checksum_file="$RELEASE_DIR/checksums.txt"
    echo "# SnapCat v$VERSION - Cryptographic Checksums" > "$checksum_file"
    echo "# Generated: $(date -u -Iseconds)" >> "$checksum_file"
    echo "# Platform: $(uname -s -m)" >> "$checksum_file"
    echo "" >> "$checksum_file"
    # Generate for binaries
    info "Generating checksums for binaries..."
    find "$BINARIES_DIR" -type f \( -name "$APP_NAME" -o -name "$APP_NAME.exe" \) | sort | while read file; do
        local filename=$(basename "$file")
        local filepath=$(dirname "$file")
        local relative_path="${filepath#$BINARIES_DIR/}"
        echo "## Binary: $relative_path/$filename" >> "$checksum_file"
        echo "SHA256: $(sha256sum "$file" | cut -d' ' -f1)" >> "$checksum_file"
        echo "SHA512: $(sha512sum "$file" | cut -d' ' -f1)" >> "$checksum_file"
        echo "BLAKE2: $(b2sum "$file" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')" >> "$checksum_file"
        echo "Size: $(stat -c%s "$file" 2>/dev/null || stat -f%z "$file") bytes" >> "$checksum_file"
        echo "" >> "$checksum_file"
    done
    # Generate for packages
    info "Generating checksums for packages..."
    find "$PACKAGES_DIR" -type f \( -name "*.tar.gz" -o -name "*.zip" \) | sort | while read file; do
        local filename=$(basename "$file")
        echo "## Package: $filename" >> "$checksum_file"
        echo "SHA256: $(sha256sum "$file" | cut -d' ' -f1)" >> "$checksum_file"
        echo "SHA512: $(sha512sum "$file" | cut -d' ' -f1)" >> "$checksum_file"
        echo "BLAKE2: $(b2sum "$file" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')" >> "$checksum_file"
        echo "Size: $(stat -c%s "$file" 2>/dev/null || stat -f%z "$file") bytes" >> "$checksum_file"
        echo "" >> "$checksum_file"
    done
    log "Checksums saved to: checksums.txt"
}
sign_with_gpg() {
    local checksum_file="$RELEASE_DIR/checksums.txt"
    if [ "$HAS_GPG" = true ]; then
        step "Signing checksums with GPG..."
        # Generate signature
        if gpg --detach-sign --armor --yes --output "$checksum_file.sig" "$checksum_file" 2>/dev/null; then
            log "GPG signature created: checksums.txt.sig"
            # Generate public key info
            gpg --list-public-keys --keyid-format LONG | grep -A1 "pub" > "$RELEASE_DIR/SIGNING_KEY.info" 2>/dev/null || true
            # Verify signature
            if gpg --verify "$checksum_file.sig" "$checksum_file" 2>/dev/null; then
                log "GPG signature verified"
            else
                warn "GPG signature verification failed"
            fi
        else
            warn "GPG signing failed"
        fi
    else
        info "Skipping GPG signing (no GPG keys available)"
    fi
}
# =============================================
# FUNGSI VERIFICATION DAN VALIDATION
# =============================================
verify_binaries() {
    step "Verifying compiled binaries..."
    local verified=0
    local total=0
    for target in "${!SUPPORTED_TARGETS[@]}"; do
        IFS='-' read -r platform arch <<< "$target"
        local binary_name="$APP_NAME"
        [[ "$platform" == "win32" ]] && binary_name="${APP_NAME}.exe"
        local binary_path="$BINARIES_DIR/$platform/$arch/$binary_name"
        if [[ -f "$binary_path" ]]; then
            if [[ "$platform" != "win32" ]]; then
                if [[ -x "$binary_path" ]]; then
                    ((verified++))
                else
                    warn "Binary not executable: $binary_path"
                fi
            else
                # For Windows, just check file exists and has content
                if [[ -s "$binary_path" ]]; then
                    ((verified++))
                else
                    warn "Binary empty or missing: $binary_path"
                fi
            fi
            ((total++))
        else
            warn "Binary missing: $binary_path"
            ((total++))
        fi
    done
    if [[ $verified -eq $total ]]; then
        log "All $verified binaries verified successfully"
    else
        warn "Only $verified out of $total binaries verified"
    fi
}
generate_build_report() {
    step "Generating build report..."
    local report_file="$RELEASE_DIR/BUILD_REPORT.md"
    cat > "$report_file" << EOF
# SnapCat Build Report v$VERSION
## Build Information
- **Version**: $VERSION
- **Build Date**: $(date -u -Iseconds)
- **Build System**: $(uname -s -m)
- **Build Tools**: $([ "$HAS_BUN" = true ] && echo "Bun" || echo "Node.js")
## Generated Artifacts
### Binaries
EOF
    # List binaries
    find "$BINARIES_DIR" -type f \( -name "$APP_NAME" -o -name "$APP_NAME.exe" \) | sort | while read file; do
        local size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file")
        echo "- \`$(basename "$file")\` ($((size/1024)) KB)" >> "$report_file"
    done
    cat >> "$report_file" << EOF
### Packages
EOF
    # List packages
    find "$PACKAGES_DIR" -type f \( -name "*.tar.gz" -o -name "*.zip" \) | sort | while read file; do
        local size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file")
        echo "- \`$(basename "$file")\` ($((size/1024)) KB)" >> "$report_file"
    done
    cat >> "$report_file" << EOF
## Security
- **Checksums**: \`checksums.txt\`
- **GPG Signature**: $([ -f "$RELEASE_DIR/checksums.txt.sig" ] && echo "✅ Available" || echo "❌ Not available")
## Verification
To verify the integrity of downloaded files:
\`\`\`bash
# Verify checksums
sha256sum -c checksums.txt
# Verify GPG signature (if available)
gpg --verify checksums.txt.sig checksums.txt
\`\`\`
## File Structure
\`\`\`
$(tree -n "$RELEASE_DIR" | head -20)
\`\`\`
EOF
    log "Build report generated: BUILD_REPORT.md"
}
# =============================================
# FUNGSI MAIN BUILD PROCESS
# =============================================
main_build() {
    info "🚀 Starting SnapCat Build System v$VERSION"
    # Phase 1: Preparation
    detect_tools
    validate_environment
    clean_build
    create_directory_structure
    # Phase 2: Compilation
    build_project
    info "Compiling binaries for all targets..."
    for target in "${!SUPPORTED_TARGETS[@]}"; do
        IFS='-' read -r platform arch <<< "$target"
        compile_binary "$platform" "$arch"
    done
    # Phase 3: Packaging
    create_packages
    # Phase 4: Security
    generate_checksums
    sign_with_gpg
    # Phase 5: Verification
    verify_binaries
    generate_build_report
    # Final Summary
    success "Build completed successfully!"
    echo ""
    info "📦 Release Location: $RELEASE_DIR"
    info "🔢 Binaries Created: $(find "$BINARIES_DIR" -type f \( -name "$APP_NAME" -o -name "$APP_NAME.exe" \) | wc -l)"
    info "📁 Packages Created: $(find "$PACKAGES_DIR" -type f \( -name "*.tar.gz" -o -name "*.zip" \) | wc -l)"
    info "🔐 Security Files: checksums.txt $([ -f "$RELEASE_DIR/checksums.txt.sig" ] && echo "+ checksums.txt.sig")"
    echo ""
    info "🌐 Available Platforms:"
    for target in "${!SUPPORTED_TARGETS[@]}"; do
        echo "   - $target"
    done
}
# =============================================
# FUNGSI QUICK VERIFICATION
# =============================================
quick_verify() {
    local version=${1:-$VERSION}
    local release_dir="$DOWNLOAD_BASE_DIR/v$version"
    if [ ! -d "$release_dir" ]; then
        error "Release v$version not found"
    fi
    info "Quick verification for v$version"
    if [ -f "$release_dir/checksums.txt" ]; then
        step "Verifying checksums..."
        if cd "$release_dir" && sha256sum -c checksums.txt 2>/dev/null | grep -q "OK"; then
            log "Checksum verification: ✅ PASSED"
        else
            warn "Checksum verification: ⚠ WARNING (some files missing or modified)"
        fi
    fi
    if [ -f "$release_dir/checksums.txt.sig" ]; then
        step "Verifying GPG signature..."
        if cd "$release_dir" && gpg --verify checksums.txt.sig checksums.txt 2>/dev/null; then
            log "GPG signature: ✅ VERIFIED"
        else
            warn "GPG signature: ❌ INVALID"
        fi
    fi
    info "File structure:"
    tree -n "$release_dir" | head -15
}
# =============================================
# MAIN EXECUTION
# =============================================
case "${1:-}" in
    "verify")
        quick_verify "${2:-}"
        ;;
    "clean")
        clean_build
        ;;
    "version")
        echo "v$VERSION"
        ;;
    "help"|"-h"|"--help")
        echo "SnapCat Build System"
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  build    - Build full release (default)"
        echo "  verify   - Verify existing release"
        echo "  clean    - Clean build directories"
        echo "  version  - Show current version"
        echo "  help     - Show this help"
        ;;
    *)
        main_build
        ;;
esac
