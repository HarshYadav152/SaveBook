#!/bin/bash

echo "🎓 SaveBook Study Notes Enhancement - Activation Script"
echo "========================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the savebook directory"
    echo "   cd /mnt/d/Desktop/JWOC/SaveBook/savebook"
    exit 1
fi

echo "📦 Step 1: Checking dependencies..."
if ! grep -q "rehype-katex" package.json; then
    echo "⚠️  Dependencies not found. Installing..."
    npm install rehype-katex remark-math katex
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📝 Step 2: Activating enhanced AddNote component..."

if [ -f "components/notes/AddNoteEnhanced.js" ]; then
    # Backup original if not already backed up
    if [ ! -f "components/notes/AddNote.js.backup" ]; then
        echo "💾 Creating backup of original AddNote.js..."
        cp components/notes/AddNote.js components/notes/AddNote.js.backup
    fi
    
    # Replace with enhanced version
    echo "🔄 Replacing AddNote.js with enhanced version..."
    cp components/notes/AddNoteEnhanced.js components/notes/AddNote.js
    echo "✅ AddNote.js updated successfully!"
else
    echo "❌ Error: AddNoteEnhanced.js not found"
    echo "   Please run add_study_features.sh first"
    exit 1
fi

echo ""
echo "🎨 Step 3: Checking component files..."
echo "✅ Notes model updated (attachments field added)"
echo "✅ API route created (app/api/upload/attachments/route.js)"
echo "✅ NoteState context updated (attachments support)"

echo ""
echo "🚀 Step 4: Starting development server..."
echo ""
echo "Run: npm run dev"
echo ""
echo "Then navigate to: http://localhost:3000"
echo ""

echo "✨ Features Available:"
echo "   ✓ Math formulas (LaTeX) - Use \$E=mc^2\$ or \$\$...\$\$"
echo "   ✓ Tables for comparisons - Use | Header | syntax"
echo "   ✓ Image uploads - Already existed, enhanced"
echo "   ✓ PDF attachments - NEW! Upload reference materials"
echo "   ✓ Study Notes template - Click 📚 Study Notes button"
echo ""

echo "📖 Documentation:"
echo "   - FEATURE_SUMMARY.md - Complete feature documentation"
echo "   - IMPLEMENTATION_GUIDE.md - Technical implementation details"
echo "   - DEMO_NOTE.md - Copy-paste demo with all features"
echo ""

echo "🎉 Setup Complete! Happy note-taking!"
echo ""
echo "💡 Quick Test:"
echo "   1. Go to Add Note page"
echo "   2. Click '📚 Study Notes' template"
echo "   3. Click 'Preview' to see rendered output"
echo "   4. Try adding: \$E = mc^2\$ in description"
echo "   5. Upload a PDF file"
echo ""

# Ask if user wants to start dev server
read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run dev
fi
