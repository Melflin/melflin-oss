#!/bin/bash
# Demo: Meeting Prep Assistant
# Shows: Calendar → Context → Briefing

echo "📅 Meeting Prep Assistant Demo"
echo "================================"
echo ""

echo "📋 Step 1: Get upcoming meetings..."
echo "$ cd skills/meeting-prep-assistant && node index.js today"
echo "→ Found 3 meetings today:"
echo "  • 09:30 - Weekly Standup (1h, Zoom)"
echo "  • 14:00 - Client Review (2h, Office)"
echo "  • 16:30 - 1:1 with Sandra (30min, Café)"
echo ""

echo "🔍 Step 2: Gather context (emails, docs)..."
echo "$ node index.js brief \"Client Review\""
echo "→ Searching emails... found 12 relevant"
echo "→ Searching calendar... found 3 related events"
echo "→ Context gathered in 0.3s"
echo ""

echo "📝 Step 3: AI Briefing generation..."
echo "$ node index.js brief \"Client Review\" --output markdown"
echo "→ Generated briefing:"
cat << 'EOF'
# Briefing: Client Review
**Date:** Today, 14:00
**Duration:** 2h
**Location:** Office

## Context from Emails
- Client requested "budget update before Q2"
- Previous meeting notes: "Focus on mobile app features"
- Action items: Review mockups, approve design direction

## Key Talking Points
1. Q1 Budget Report (attached)
2. Mobile App Mockups v2
3. Timeline adjustment discussion

## Suggested Prep
- [ ] Review budget spreadsheet
- [ ] Prepare design comparison
- [ ] Check previous meeting notes

EOF
echo ""

echo "🔔 Step 4: Proactive notification (2h before)..."
echo "$ node notify-upcoming.js --channel telegram"
echo "→ Briefing sent to Telegram!"
echo ""

echo "🎉 Demo complete! You're now 5x faster at meeting prep."
