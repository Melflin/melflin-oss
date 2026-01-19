#!/bin/bash
# Run all demos in sequence

echo "🧙‍♂️ Melflin OSS Skills - Complete Demo"
echo "======================================"
echo ""

# Demo 1: Smart Reminders
echo "▶️ Demo 1: Smart Reminders Analyzer"
bash demo/smart-reminders.sh
echo ""

# Demo 2: Meeting Prep
echo "▶️ Demo 2: Meeting Prep Assistant"
bash demo/meeting-prep.sh
echo ""

# Demo 3: Knowledge Sync
echo "▶️ Demo 3: Knowledge Sync"
bash demo/knowledge-sync.sh
echo ""

# Demo 4: Podcast Notes
echo "▶️ Demo 4: Podcast → Notes"
bash demo/podcast-notes.sh
echo ""

echo "🎊 All demos complete!"
echo "→ Check out the skills at: https://github.com/Melflin/melflin-oss"
echo "→ Give us a ⭐ if you like what you see!"
