#!/bin/bash
# Demo: Knowledge Sync
# Shows: List → Review → Export to Obsidian

echo "🔄 Knowledge Sync Demo"
echo "======================"
echo ""

echo "📚 Step 1: List all synced content..."
echo "$ cd skills/knowledge-sync && node index.js list"
echo "→ Your Library:"
echo "  📖 'Atomic Habits' - James Clear (Read: 2025-11)"
echo "  📖 'Deep Work' - Cal Newport (Read: 2025-10)"
echo "  📖 'Thinking, Fast and Slow' - Daniel Kahneman (Read: 2025-09)"
echo "  🎧 'Huberman Lab' - Episode: 'Sleep Fundamentals'"
echo "  🎧 'Lex Fridman' - Episode: 'AI and Future'"
echo ""

echo "📝 Step 2: Weekly review..."
echo "$ node index.js review --week 3"
echo "→ Week 3 Review Summary:"
echo "  • 5 highlights synced"
echo "  • 3 new notes created in Obsidian"
echo "  • Topics: Productivity, Neuroscience, AI"
echo ""

echo "📓 Step 3: Export specific book to Obsidian..."
echo "$ node index.js export \"Atomic Habits\" --template book"
echo "→ Created: ~/Obsidian/Notes/Books/Atomic-Habits.md"
echo ""

echo "📖 Generated Note Preview:"
cat << 'EOF'
---
title: Atomic Habits
author: James Clear
date: 2025-11
tags: [productivity, habits, psychology]
---

# Atomic Habits - Key Insights

## Core Concepts

### 1. The Compound Effect
> "Small habits, when compounded, lead to remarkable results."

### 2. Identity-Based Habits
> "The goal is not to read a book, but to become a reader."

## Actionable Takeaways
- [ ] Focus on systems, not goals
- [ ] Make habits obvious, attractive, easy, satisfying
- [ ] Environment design > willpower

---
*Synced: 2026-01-19*
EOF
echo ""

echo "🎉 Demo complete! Your knowledge is now interconnected."
