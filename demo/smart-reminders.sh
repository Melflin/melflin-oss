#!/bin/bash
# Demo: Smart Reminders Analyzer
# Shows: Fetch → Analyze → Action suggestions

echo "🧙‍♂️ Smart Reminders Analyzer Demo"
echo "=================================="
echo ""

echo "📋 Step 1: Fetching your reminders..."
echo "$ cd skills/smart-reminders && node index.js fetch"
echo "→ Found 122 active reminders"
echo ""

echo "🧠 Step 2: AI Analysis..."
echo "$ node index.js analyze --json"
echo "→ Analysis:"
echo "  • 119 Clear (98%)"
echo "  • 2 Unclear (needs more detail)"
echo "  • 1 Duplicate (delete one)"
echo ""

echo "⚡ Step 3: Dry-run suggestions..."
echo "$ node index.js execute --dry-run"
echo "→ Suggested actions:"
echo "  • DELETE: 'old shopping list' (completed 2025-12-01)"
echo "  • CLARIFY: 'Call [name]' (who?)"
echo "  • MERGE: 2x 'Tax documents' reminders"
echo ""

echo "✅ Step 4: Real execution (with backup)..."
echo "$ node index.js execute --backup"
echo "→ Backup saved: backup/reminders-2026-01-19.json"
echo "→ Executed 3 deletions, 2 clarifications"
echo ""

echo "🎉 Demo complete! Your reminders are now organized."
