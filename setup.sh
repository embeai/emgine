#!/usr/bin/env bash
# setup.sh — Emgine one-time project bootstrap
# Run once after cloning: bash setup.sh

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Emgine — Project Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Check Node.js version
echo "▸ Checking Node.js version..."
NODE_VERSION=$(node -e "process.stdout.write(process.version.slice(1).split('.')[0])" 2>/dev/null || echo "0")
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "  ❌ Node.js 18 or higher is required."
  echo "     Current version: $(node -v 2>/dev/null || echo 'not installed')"
  echo "     Download: https://nodejs.org"
  exit 1
fi
echo "  ✅ Node.js $(node -v)"

# 2. Install dependencies
echo ""
echo "▸ Installing dependencies..."
npm install
echo "  ✅ Dependencies installed"

# 3. Verify Sharp native bindings
echo ""
echo "▸ Verifying Sharp native bindings..."
if node -e "import('sharp').then(() => process.exit(0)).catch(() => process.exit(1))" 2>/dev/null; then
  echo "  ✅ Sharp is working"
else
  echo "  ⚠️  Sharp native bindings may need rebuilding."
  echo "     Try: npm rebuild sharp"
  echo "     Or:  npm install --ignore-scripts=false sharp"
fi

# 4. Create directory structure
echo ""
echo "▸ Creating directory structure..."
mkdir -p out/preview
mkdir -p public/fonts
mkdir -p public/images
mkdir -p graphics
mkdir -p src

# Create .gitkeep files for empty directories
touch public/fonts/.gitkeep
touch public/images/.gitkeep
touch graphics/.gitkeep
touch out/.gitkeep
touch out/preview/.gitkeep

echo "  ✅ Directories ready"

# 5. Done — print checklist
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "  1. Fill in brand.config.ts with your client's brand tokens"
echo "     (colors, fonts, spacing, logo)"
echo ""
echo "  2. Add font files (TTF/OTF/WOFF only — no WOFF2) to:"
echo "     public/fonts/"
echo ""
echo "  3. Add your logo and images to:"
echo "     public/images/"
echo ""
echo "  4. Write your first composition in src/"
echo "     and register it in src/Root.tsx"
echo ""
echo "  5. Run your first render:"
echo "     npx tsx cli/index.ts render <YourCompositionId>"
echo ""
echo "  Or use the npm scripts:"
echo "     npm run render -- <id>"
echo "     npm run preview -- <id>"
echo "     npm run batch"
echo "     npm run list"
echo ""
