#!/bin/bash
# Demo: Podcast → Notes
# Shows: URL → Transcribe → Summarize → Obsidian

echo "🎧 Podcast → Notes Demo"
echo "======================="
echo ""

echo "🎙️ Step 1: Input podcast URL..."
echo "$ cd skills/podcast-notes && node index.js fetch \"https://youtube.com/watch?v=example\""
echo "→ Detected: YouTube podcast format"
echo "→ Downloading audio..."
echo "→ Converting to WAV for Whisper..."
echo ""

echo "📝 Step 2: Transcription (local Whisper)..."
echo "$ node index.js transcribe audio.wav"
echo "→ Using: whisper-cli (local, free!)"
echo "→ Transcription time: ~2min for 30min episode"
echo "→ Accuracy: 94%"
echo ""

echo "🧠 Step 3: AI Summary & Key Insights..."
echo "$ node index.js summarize transcript.txt --model minimax"
echo "→ Generating summary..."
echo ""
cat << 'EOF'
## Episode Summary: The Future of AI

**Duration:** 45 minutes
**Topics:** Artificial Intelligence, Ethics, Future

### Key Insights
1. **Alignment Problem** - How to ensure AI goals match human values
2. **Economic Impact** - Automation will affect 40% of jobs in next decade
3. **Creative AI** - LLMs as thought partners, not replacements

### Memorable Quotes
> "AI won't replace humans, but humans with AI will replace humans without AI."

### Timestamps
- 03:15 - Introduction
- 12:30 - Alignment problem deep dive
- 28:45 - Economic predictions
- 40:00 - Closing thoughts
EOF
echo ""

echo "📓 Step 4: Export to Obsidian..."
echo "$ node index.js export transcript.txt --obsidian --tags \"[AI, technology, podcast]\""
echo "→ Created: ~/Obsidian/Notes/Podcasts/Future-of-AI-2026-01-19.md"
echo ""

echo "🔗 Frontmatter:"
cat << 'EOF'
---
title: The Future of AI
source: Huberman Lab
date: 2026-01-19
duration: 45min
tags: [AI, technology, podcast]
---

# The Future of AI

[Full transcription and summary...]
EOF
echo ""

echo "🎉 Demo complete! Your podcasts are now searchable knowledge."
