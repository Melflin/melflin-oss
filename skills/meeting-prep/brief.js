#!/usr/bin/env node
/**
 * Meeting Prep Assistant - Briefing Generator
 * 
 * Generates AI-powered briefings for upcoming meetings.
 * 
 * Usage: node brief.js [--context=context.json] [--json] [--telegram]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_CONTEXT = path.join(__dirname, 'context.json');

/**
 * Generate AI briefing for a single meeting
 */
function generateBriefing(meetingContext, options = {}) {
  const { model = 'minimax' } = options;
  
  const { title, time, context } = meetingContext;
  
  // Build context summary
  const emailsSummary = context.emails.length > 0 
    ? context.emails.map(e => `- From ${e.from}: "${e.subject}" (${e.date})`).join('\n')
    : '- No related emails found';
  
  const actionsSummary = context.actionItems.length > 0
    ? context.actionItems.map(a => `- [${a.status}] ${a.task} (${a.owner}, from ${a.fromMeeting})`).join('\n')
    : '- No pending action items';
  
  const notesSummary = context.projectNotes.length > 0
    ? context.projectNotes.map(n => `- ${n.title} (${n.path})`).join('\n')
    : '- No related project notes';
  
  // Generate the briefing
  const briefing = {
    title,
    time: time.substring(11, 16), // Just the time
    date: time.substring(0, 10),
    agenda: `Meeting: ${title}`,
    background: emailsSummary,
    actionItems: actionsSummary,
    relatedNotes: notesSummary,
    generatedAt: new Date().toISOString()
  };
  
  return briefing;
}

/**
 * Format briefing for Telegram
 */
function formatForTelegram(briefing) {
  const lines = [
    `📅 **MEETING BRIEFING**`,
    `━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `🏷️  *${briefing.title}*`,
    `🕐 ${briefing.time} (${briefing.date})`,
    ``,
    `📝 **Agenda**`,
    `- ${briefing.agenda}`,
    ``,
    `📚 **Background**`,
    briefing.background,
    ``,
    `✅ **Open Action Items**`,
    briefing.actionItems,
    ``,
    `📁 **Related Notes**`,
    briefing.relatedNotes,
    ``,
    `⏰ Generated: ${briefing.generatedAt.substring(11, 19)}`
  ];
  
  return lines.join('\n');
}

/**
 * Format briefing for Apple Reminders (plain text)
 */
function formatForReminders(briefing) {
  const lines = [
    `[MEETING BRIEFING] ${briefing.title}`,
    `Time: ${briefing.time}`,
    ``,
    `Background:`,
    briefing.background,
    ``,
    `Action Items:`,
    briefing.actionItems,
    ``,
    `Related Notes:`,
    briefing.relatedNotes
  ];
  
  return lines.join('\n');
}

/**
 * Format briefing for Obsidian (Markdown)
 */
function formatForObsidian(briefing) {
  const dateSlug = briefing.date.replace(/-/g, '');
  const filename = `Meeting-Briefing-${dateSlug}-${briefing.title.replace(/[^a-zA-Z0-9]/g, '')}.md`;
  
  const content = `---
title: Meeting Briefing - ${briefing.title}
date: ${briefing.date}
time: ${briefing.time}
generated: ${briefing.generatedAt}
---

# 📅 ${briefing.title}

**🕐 Time:** ${briefing.time}  
**📅 Date:** ${briefing.date}

## 📝 Agenda
- ${briefing.agenda}

## 📚 Background
${briefing.background.split('\n').map(l => `> ${l}`).join('\n')}

## ✅ Open Action Items
${briefing.actionItems.split('\n').map(l => `- [ ] ${l}`).join('\n')}

## 📁 Related Notes
${briefing.relatedNotes.split('\n').map(l => `- ${l}`).join('\n')}

---
*Generated: ${briefing.generatedAt}*
`;
  
  return { filename, content };
}

/**
 * Main briefing generation function
 */
function generateBriefings(contextPath, options = {}) {
  const { 
    json = false,
    telegram = false,
    reminders = false,
    obsidian = false,
    verbose = true,
    output = null
  } = options;
  
  if (!json) {
    console.log('📋 Meeting Prep Assistant - Briefing Generator');
    console.log('━'.repeat(48));
  }
  
  // Load context
  let context;
  try {
    const data = fs.readFileSync(contextPath, 'utf8');
    context = JSON.parse(data);
    if (!json) console.log(`📥 Loaded context for ${context.meetings?.length || 0} meetings`);
  } catch (error) {
    if (!json) console.log(`⚠️  Failed to load context: ${error.message}`);
    if (!json) console.log('💡 Run aggregate.js first to get context');
    return { error: 'NO_CONTEXT' };
  }
  
  const meetings = context.meetings || [];
  if (meetings.length === 0) {
    if (!json) console.log('⚠️  No meetings in context');
    return { error: 'NO_MEETINGS' };
  }
  
  // Generate briefings
  const briefings = [];
  
  for (const meeting of meetings) {
    if (verbose && !json) {
      console.log('');
      console.log(`📅 Processing: ${meeting.title}`);
    }
    
    const briefing = generateBriefing(meeting, options);
    briefings.push(briefing);
    
    if (verbose && !json) {
      console.log(`   ✅ Briefing generated`);
    }
  }
  
  // Output
  const result = {
    briefings,
    count: briefings.length,
    generatedAt: new Date().toISOString()
  };
  
  // Format outputs
  if (telegram) {
    if (!json) {
      console.log('');
      console.log('📱 Telegram Format (first briefing):');
      console.log('─'.repeat(40));
    }
    console.log(formatForTelegram(briefings[0]));
  }
  
  if (reminders) {
    if (!json) {
      console.log('');
      console.log('⏰ Apple Reminders Format (first briefing):');
      console.log('─'.repeat(40));
    }
    console.log(formatForReminders(briefings[0]));
  }
  
  if (obsidian) {
    const obsidianOutput = formatForObsidian(briefings[0]);
    if (!json) {
      console.log('');
      console.log('📁 Obsidian Format:');
      console.log('─'.repeat(40));
      console.log(`Filename: ${obsidianOutput.filename}`);
      console.log(`Content preview: ${obsidianOutput.content.substring(0, 200)}...`);
      
      // Save to file
      const obsidianPath = path.join(__dirname, 'outputs');
      if (!fs.existsSync(obsidianPath)) {
        fs.mkdirSync(obsidianPath, { recursive: true });
      }
      fs.writeFileSync(path.join(obsidianPath, obsidianOutput.filename), obsidianOutput.content);
      console.log(`💾 Saved to: outputs/${obsidianOutput.filename}`);
    } else {
      const obsidianPath = path.join(__dirname, 'outputs');
      if (!fs.existsSync(obsidianPath)) {
        fs.mkdirSync(obsidianPath, { recursive: true });
      }
      fs.writeFileSync(path.join(obsidianPath, obsidianOutput.filename), obsidianOutput.content);
    }
  }
  
  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (!telegram && !reminders && !obsidian) {
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Total briefings: ${result.count}`);
    briefings.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.title} (${b.time})`);
    });
  }
  
  // Save result
  if (output) {
    fs.writeFileSync(output, JSON.stringify(result, null, 2));
    if (!json) {
      console.log('');
      console.log(`💾 Saved to: ${output}`);
    }
  }
  
  return result;
}

/**
 * Interactive briefing mode
 */
async function interactiveBriefing() {
  console.log('');
  console.log('🎯 Meeting Prep Assistant - Interactive Briefing');
  console.log('━'.repeat(45));
  console.log('');
  console.log('This would generate a briefing for your next meeting.');
  console.log('');
  console.log('To use:');
  console.log('  1. Fetch meetings:   node fetch.js --calendar=Arbeit');
  console.log('  2. Aggregate context: node aggregate.js');
  console.log('  3. Generate briefing: node brief.js --telegram');
  console.log('');
  console.log('💡 Tip: Use --telegram to see Telegram-formatted output');
  console.log('💡 Tip: Use --obsidian to save as Obsidian note');
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    context: args.find(a => a.startsWith('--context='))?.split('=')[1] || DEFAULT_CONTEXT,
    json: args.includes('--json'),
    telegram: args.includes('--telegram'),
    reminders: args.includes('--reminders'),
    obsidian: args.includes('--obsidian'),
    verbose: !args.includes('--quiet'),
    output: args.find(a => a.startsWith('--output='))?.split('=')[1] || null
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📋 Meeting Prep Assistant - Briefing Generator

USAGE:
  node brief.js [OPTIONS]

OPTIONS:
  --context=<file>   Context file (default: context.json)
  --json             Output as JSON
  --telegram         Format for Telegram
  --reminders        Format for Apple Reminders
  --obsidian         Save as Obsidian note
  --output=<file>    Save output to file
  --help, -h         Show this help

EXAMPLES:
  # Generate all briefings as JSON
  node brief.js --json

  # Format for Telegram
  node brief.js --telegram

  # Save as Obsidian note
  node brief.js --obsidian

  # Full output with all formats
  node brief.js --telegram --reminders --obsidian

WORKFLOW:
  1. node fetch.js --calendar=Arbeit    # Get meetings
  2. node aggregate.js                  # Get context
  3. node brief.js --telegram           # Generate briefing
    `);
    return;
  }
  
  if (args.length === 0 || (!options.json && !options.telegram && !options.reminders && !options.obsidian)) {
    interactiveBriefing();
  } else {
    generateBriefings(options.context, options);
  }
}

module.exports = { 
  generateBriefings, 
  generateBriefing,
  formatForTelegram,
  formatForReminders,
  formatForObsidian 
};
