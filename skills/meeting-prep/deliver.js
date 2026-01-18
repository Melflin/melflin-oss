#!/usr/bin/env node
/**
 * Meeting Prep Assistant - Delivery Module
 * 
 * Delivers briefings to various channels:
 * - Telegram (via Clawdbot message)
 * - Apple Reminder (via remindctl)
 * - Obsidian Note (file write)
 * - Local file
 * 
 * Usage: node deliver.js [--brief=briefings.json] [--telegram] [--reminders] [--obsidian] [--all]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DEFAULT_BRIEFINGS = path.join(__dirname, 'briefings.json');
const OUTPUTS_DIR = path.join(__dirname, 'outputs');

/**
 * Deliver briefing to Telegram
 */
function deliverToTelegram(briefing, options = {}) {
  const { dryRun = false, channel = 'telegram', verbose = true } = options;
  
  if (verbose) {
    console.log('📱 Telegram Delivery:');
    console.log(`   Title: ${briefing.title}`);
    console.log(`   Time: ${briefing.time}`);
    console.log(`   Channels: ${channel}`);
  }
  
  if (dryRun) {
    if (verbose) console.log('   🧪 [DRY-RUN] Would send to Telegram');
    return { success: true, dryRun: true };
  }
  
  // In a real implementation, this would use Clawdbot's message API
  if (verbose) {
    console.log('   ⚠️  Telegram delivery requires Clawdbot integration');
    console.log('   💡 Use Clawdbot directly: message --channel=telegram --message="..."');
  }
  
  return { success: false, reason: 'CLI_ONLY_MODE' };
}

/**
 * Deliver briefing as Apple Reminder
 */
function deliverToReminders(briefing, options = {}) {
  const { dryRun = false, list = 'Erinnerungen', verbose = true } = options;
  
  if (verbose) {
    console.log('⏰ Apple Reminder Delivery:');
    console.log(`   Title: [BRIEFING] ${briefing.title}`);
    console.log(`   List: ${list}`);
    console.log(`   Due: ${briefing.date} at ${briefing.time}`);
  }
  
  if (dryRun) {
    if (verbose) console.log('   🧪 [DRY-RUN] Would create reminder');
    return { success: true, dryRun: true };
  }
  
  // Build reminder body
  const body = `📋 Meeting Briefing\n\n` +
    `Agenda: ${briefing.agenda}\n` +
    `Background: ${briefing.background}\n` +
    `Action Items: ${briefing.actionItems}`;
  
  // Try to create via remindctl
  try {
    const title = `[BRIEFING] ${briefing.title}`;
    const due = `${briefing.date}T${briefing.time}:00`;
    const cmd = `remindctl add --title "${title}" --list "${list}" --due "${due}"`;
    const output = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    console.log(`   ✅ Created reminder: ${output.trim()}`);
    return { success: true, id: output.trim() };
  } catch (error) {
    console.log(`   ⚠️  Failed to create reminder: ${error.message}`);
    console.log('   💡 Create manually or fix remindctl permissions');
    return { success: false, error: error.message };
  }
}

/**
 * Deliver briefing as Obsidian Note
 */
function deliverToObsidian(briefing, options = {}) {
  const { dryRun = false, vaultPath = null } = options;
  
  console.log('📁 Obsidian Delivery:');
  
  // Generate filename
  const dateSlug = briefing.date.replace(/-/g, '');
  const titleSlug = briefing.title.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `Meeting-Briefing-${dateSlug}-${titleSlug}.md`;
  
  // Build content
  const content = `---
title: Meeting Briefing - ${briefing.title}
date: ${briefing.date}
time: ${briefing.time}
generated: ${briefing.generatedAt}
tags: meeting, briefing
---

# 📅 ${briefing.title}

**🕐 Time:** ${briefing.time}  
**📅 Date:** ${briefing.date}

## 📝 Agenda
- ${briefing.agenda}

## 📚 Background
${briefing.background.split('\n').map(l => l.startsWith('-') ? l : `> ${l}`).join('\n')}

## ✅ Open Action Items
${briefing.actionItems.split('\n').map(l => `- [ ] ${l.replace('✅ ', '').replace('- ', '')}`).join('\n')}

## 📁 Related Notes
${briefing.relatedNotes.split('\n').map(l => `- ${l.replace('- ', '')}`).join('\n')}

---
*Generated: ${briefing.generatedAt}*
`;
  
  // Determine output path
  let outputPath;
  if (vaultPath && fs.existsSync(vaultPath)) {
    outputPath = path.join(vaultPath, 'Meeting-Briefings', filename);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } else {
    // Default to local outputs folder
    outputPath = path.join(OUTPUTS_DIR, filename);
    if (!fs.existsSync(OUTPUTS_DIR)) {
      fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
    }
  }
  
  console.log(`   File: ${filename}`);
  
  if (dryRun) {
    console.log('   🧪 [DRY-RUN] Would save to: ' + outputPath);
    return { success: true, path: outputPath, dryRun: true };
  }
  
  try {
    fs.writeFileSync(outputPath, content);
    console.log(`   ✅ Saved: ${outputPath}`);
    return { success: true, path: outputPath };
  } catch (error) {
    console.log(`   ❌ Failed to save: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Deliver briefing to local file
 */
function deliverToFile(briefing, options = {}) {
  const { dryRun = false, format = 'json' } = options;
  
  console.log('💾 File Delivery:');
  
  const dateSlug = briefing.date.replace(/-/g, '');
  const titleSlug = briefing.title.replace(/[^a-zA-Z0-9]/g, '');
  const ext = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
  const filename = `briefing-${dateSlug}-${titleSlug}.${ext}`;
  const outputPath = path.join(OUTPUTS_DIR, filename);
  
  if (!fs.existsSync(OUTPUTS_DIR)) {
    fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
  }
  
  console.log(`   File: ${filename}`);
  console.log(`   Format: ${format}`);
  
  if (dryRun) {
    console.log('   🧪 [DRY-RUN] Would save to: ' + outputPath);
    return { success: true, path: outputPath, dryRun: true };
  }
  
  try {
    let content;
    if (format === 'json') {
      content = JSON.stringify(briefing, null, 2);
    } else if (format === 'markdown') {
      content = formatBriefingAsMarkdown(briefing);
    } else {
      content = JSON.stringify(briefing, null, 2);
    }
    
    fs.writeFileSync(outputPath, content);
    console.log(`   ✅ Saved: ${outputPath}`);
    return { success: true, path: outputPath };
  } catch (error) {
    console.log(`   ❌ Failed to save: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Format briefing as Markdown
 */
function formatBriefingAsMarkdown(briefing) {
  return `# Meeting Briefing: ${briefing.title}

**Date:** ${briefing.date}  
**Time:** ${briefing.time}

## Agenda
${briefing.agenda}

## Background
${briefing.background}

## Action Items
${briefing.actionItems}

## Related Notes
${briefing.relatedNotes}

---
Generated: ${briefing.generatedAt}
`;
}

/**
 * Main delivery function
 */
function deliverBriefings(briefingsPath, options = {}) {
  const {
    telegram = false,
    reminders = false,
    obsidian = false,
    file = false,
    all = false,
    dryRun = false,
    json = false,
    quiet = false,
    verbose = !quiet
  } = options;
  
  if (!quiet) {
    console.log('📤 Meeting Prep Assistant - Delivery Module');
    console.log('━'.repeat(48));
  }
  
  // Determine channels
  const channels = [];
  if (telegram) channels.push('telegram');
  if (reminders) channels.push('reminders');
  if (obsidian) channels.push('obsidian');
  if (file) channels.push('file');
  if (all) channels.push('telegram', 'reminders', 'obsidian', 'file');
  
  if (channels.length === 0 && !json) {
    console.log('⚠️  No delivery channel specified');
    console.log('');
    console.log('OPTIONS:');
    console.log('  --telegram    Send to Telegram');
    console.log('  --reminders   Create Apple Reminder');
    console.log('  --obsidian    Save as Obsidian note');
    console.log('  --file        Save to local file');
    console.log('  --all         Deliver to all channels');
    console.log('  --dry-run     Preview without sending');
    return { error: 'NO_CHANNEL' };
  }
  
  // Load briefings
  let briefings = [];
  try {
    const data = JSON.parse(fs.readFileSync(briefingsPath, 'utf8'));
    briefings = data.briefings || [];
    if (!json) console.log(`📥 Loaded ${briefings.length} briefings from ${briefingsPath}`);
  } catch (error) {
    if (!json) console.log(`⚠️  Failed to load briefings: ${error.message}`);
    if (!json) console.log('💡 Run brief.js first to generate briefings');
    return { error: 'NO_BRIEFINGS' };
  }
  
  if (briefings.length === 0) {
    if (!json) console.log('⚠️  No briefings found');
    return { error: 'NO_BRIEFINGS' };
  }
  
  // Deliver each briefing
  const results = {
    delivered: [],
    failed: [],
    channels
  };
  
  for (const briefing of briefings) {
    if (verbose) {
      console.log('');
      console.log(`📅 Processing: ${briefing.title}`);
    }
    
    // Deliver to each channel
    for (const channel of channels) {
      let result;
      
      switch (channel) {
        case 'telegram':
          result = deliverToTelegram(briefing, { dryRun, channel });
          break;
        case 'reminders':
          result = deliverToReminders(briefing, { dryRun });
          break;
        case 'obsidian':
          result = deliverToObsidian(briefing, { dryRun });
          break;
        case 'file':
          result = deliverToFile(briefing, { dryRun, format: 'json' });
          break;
      }
      
      if (result.success) {
        results.delivered.push({ briefing: briefing.title, channel, ...result });
      } else {
        results.failed.push({ briefing: briefing.title, channel, ...result });
      }
    }
  }
  
  // Summary
  if (!json) {
    console.log('');
    console.log('📊 Delivery Summary:');
    console.log(`   Total briefings: ${briefings.length}`);
    console.log(`   Delivered: ${results.delivered.length}`);
    console.log(`   Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log('');
      console.log('⚠️  Failed deliveries:');
      results.failed.forEach(f => {
        console.log(`   - ${f.briefing} (${f.channel}): ${f.error || 'unknown'}`);
      });
    }
  }
  
  return results;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    brief: args.find(a => a.startsWith('--brief='))?.split('=')[1] || DEFAULT_BRIEFINGS,
    telegram: args.includes('--telegram'),
    reminders: args.includes('--reminders'),
    obsidian: args.includes('--obsidian'),
    file: args.includes('--file'),
    all: args.includes('--all'),
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    json: args.includes('--json'),
    quiet: args.includes('--quiet'),
    verbose: !args.includes('--quiet')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📤 Meeting Prep Assistant - Delivery Module

USAGE:
  node deliver.js [OPTIONS]

OPTIONS:
  --brief=<file>     Briefing file (default: briefings.json)
  --telegram         Send to Telegram
  --reminders        Create Apple Reminder
  --obsidian         Save as Obsidian note
  --file             Save to local file
  --all              Deliver to all channels
  --dry-run, -n      Preview without sending
  --json             Output as JSON
  --help, -h         Show this help

EXAMPLES:
  # Preview all deliveries
  node deliver.js --all --dry-run

  # Send to Telegram
  node deliver.js --telegram

  # Create Apple Reminders
  node deliver.js --reminders

  # Save all to files
  node deliver.js --all --obsidian

WORKFLOW:
  1. node fetch.js --calendar=Arbeit    # Get meetings
  2. node aggregate.js                  # Get context
  3. node brief.js --json > briefings.json  # Generate briefings
  4. node deliver.js --telegram         # Deliver to channels
    `);
    return;
  }
  
  const result = deliverBriefings(options.brief, options);
  
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = {
  deliverBriefings,
  deliverToTelegram,
  deliverToReminders,
  deliverToObsidian,
  deliverToFile
};
