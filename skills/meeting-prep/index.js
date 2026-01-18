#!/usr/bin/env node
/**
 * Meeting Prep Assistant - Unified CLI & Scheduler
 * 
 * Combines fetch + aggregate + brief + deliver in one command.
 * Can run on-demand or scheduled (cron).
 * 
 * Usage: node index.js [--calendar=Name] [--hours=2] [--channels=telegram,reminders] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DEFAULT_CALENDAR = 'Arbeit';
const DEFAULT_HOURS = 2; // Generate briefings 2 hours before meetings

/**
 * Print help message
 */
function printHelp() {
  const help = `
📅 Meeting Prep Assistant v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE:
  node index.js [OPTIONS]

OPTIONS:
  --help, -h           Show this help
  --calendar=<name>     Calendar name (default: ${DEFAULT_CALENDAR})
  --hours=<n>           Hours before meeting to trigger (default: ${DEFAULT_HOURS})
  --channels=<c1,c2>    Delivery channels (default: all)
                         Options: telegram, reminders, obsidian, file
  --dry-run, -n         Preview without sending
  --json                Output as JSON
  --quiet               Minimize output
  --schedule            Print cron schedule example

EXAMPLES:
  # Run full pipeline
  node index.js

  # Dry-run preview
  node index.js --dry-run

  # Work calendar, 1 hour before
  node index.js --calendar=Arbeit --hours=1

  # Telegram only
  node index.js --channels=telegram

  # Show cron schedule
  node index.js --schedule

WORKFLOW:
  1. Fetch meetings from calendar
  2. Aggregate context (emails, notes, action items)
  3. Generate briefings
  4. Deliver to configured channels

CHANNELS:
  📱 Telegram - Send to Telegram (requires Clawdbot)
  ⏰ Reminders - Create Apple Reminder
  📁 Obsidian - Save as Markdown note
  💾 File - Save JSON to outputs/

---
  `;
  console.log(help);
}

/**
 * Print cron schedule example
 */
function printSchedule() {
  console.log(`
⏰ Cron Schedule Examples:

# Run every hour, generate briefings 2h before meetings
0 * * * * cd /path/to/meeting-prep && node index.js --hours=2 --channels=telegram,reminders

# Run every 30 minutes
*/30 * * * * cd /path/to/meeting-prep && node index.js --hours=2 --channels=reminders

# Daily at 8am (for same-day meetings)
0 8 * * * cd /path/to/meeting-prep && node index.js --hours=24 --channels=obsidian,file

TROUBLESHOOTING:
- Check logs: outputs/briefings-*.json
- Dry-run first: node index.js --dry-run
- Test channels: node deliver.js --telegram --dry-run
  `);
}

/**
 * Run the full pipeline
 */
async function runPipeline(options = {}) {
  const {
    calendar = DEFAULT_CALENDAR,
    hours = DEFAULT_HOURS,
    channels = 'all',
    dryRun = false,
    json = false,
    quiet = false
  } = options;
  
  if (!quiet) {
    console.log('');
    console.log('📅 Meeting Prep Assistant v1.0');
    console.log('━'.repeat(32));
    console.log(`📆 Calendar: ${calendar}`);
    console.log(`⏰ Trigger: ${hours}h before meeting`);
    console.log(`📤 Channels: ${channels}`);
    if (dryRun) console.log(`🧪 Mode: DRY-RUN`);
  }
  
  const steps = [];
  let allSuccess = true;
  
  // Step 1: Fetch meetings
  if (!quiet) console.log('');
  try {
    if (!quiet) console.log('📥 Step 1: Fetching meetings...');
    const fetchCmd = `node fetch.js --calendar="${calendar}" --quiet`;
    const output = execSync(fetchCmd, { encoding: 'utf8', timeout: 30000, cwd: __dirname });
    const meetings = JSON.parse(output);
    const upcoming = (meetings.upcoming || []).filter(m => {
      const meetingTime = new Date(m.startISO);
      const hoursUntil = (meetingTime - new Date()) / (1000 * 60 * 60);
      return hoursUntil > 0 && hoursUntil <= hours;
    });
    steps.push({ step: 'fetch', success: true, count: upcoming.length });
    if (!quiet) console.log(`   ✅ Found ${upcoming.length} meetings in next ${hours}h`);
  } catch (error) {
    if (!quiet) console.log(`   ⚠️  Fetch failed: ${error.message}`);
    steps.push({ step: 'fetch', success: false, error: error.message });
    allSuccess = false;
  }
  
  if (steps[0]?.count === 0 && allSuccess) {
    if (!quiet) {
      console.log('   ℹ️  No meetings found in the specified timeframe');
      console.log('   💡 Try: node index.js --hours=24');
    }
    return { steps, success: true, noMeetings: true };
  }
  
  // Step 2: Aggregate context
  try {
    if (!quiet) console.log('🔍 Step 2: Aggregating context...');
    const aggCmd = `node aggregate.js --quiet --json`;
    const output = execSync(aggCmd, { encoding: 'utf8', timeout: 30000, cwd: __dirname });
    steps.push({ step: 'aggregate', success: true });
    if (!quiet) console.log('   ✅ Context aggregated');
  } catch (error) {
    if (!quiet) console.log(`   ⚠️  Aggregate failed: ${error.message}`);
    steps.push({ step: 'aggregate', success: false, error: error.message });
    allSuccess = false;
  }
  
  // Step 3: Generate briefings
  try {
    if (!quiet) console.log('📋 Step 3: Generating briefings...');
    const briefCmd = `node brief.js --quiet --json`;
    const output = execSync(briefCmd, { encoding: 'utf8', timeout: 30000, cwd: __dirname });
    const briefings = JSON.parse(output);
    steps.push({ step: 'brief', success: true, count: briefings.briefings?.length || 0 });
    if (!quiet) console.log(`   ✅ Generated ${briefings.briefings?.length || 0} briefings`);
  } catch (error) {
    if (!quiet) console.log(`   ⚠️  Brief failed: ${error.message}`);
    steps.push({ step: 'brief', success: false, error: error.message });
    allSuccess = false;
  }
  
  // Step 4: Deliver
  if (allSuccess) {
    try {
      if (!quiet) console.log('📤 Step 4: Delivering...');
      const channelArgs = channels === 'all' ? '--all' : `--channels=${channels}`;
      const dryRunArg = dryRun ? '--dry-run' : '';
      const quietArg = quiet ? '--quiet' : '';
      const deliverCmd = `node deliver.js ${channelArgs} ${dryRunArg} ${quietArg} --json`;
      const output = execSync(deliverCmd, { encoding: 'utf8', timeout: 60000, cwd: __dirname });
      const result = JSON.parse(output);
      steps.push({ 
        step: 'deliver', 
        success: true, 
        delivered: result.delivered?.length || 0,
        failed: result.failed?.length || 0
      });
      if (!quiet) {
        console.log(`   ✅ Delivered: ${result.delivered?.length || 0}`);
        if (result.failed?.length > 0) {
          console.log(`   ⚠️  Failed: ${result.failed.length}`);
        }
      }
    } catch (error) {
      if (!quiet) console.log(`   ⚠️  Deliver failed: ${error.message}`);
      steps.push({ step: 'deliver', success: false, error: error.message });
      allSuccess = false;
    }
  }
  
  // Summary
  const result = {
    success: allSuccess,
    steps,
    timestamp: new Date().toISOString()
  };
  
  if (!quiet) {
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Steps: ${steps.length}`);
    console.log(`   Success: ${allSuccess ? 'Yes' : 'No'}`);
  }
  
  return result;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    help: args.includes('--help') || args.includes('-h'),
    calendar: args.find(a => a.startsWith('--calendar='))?.split('=')[1] || DEFAULT_CALENDAR,
    hours: parseInt(args.find(a => a.startsWith('--hours='))?.split('=')[1]) || DEFAULT_HOURS,
    channels: args.find(a => a.startsWith('--channels='))?.split('=')[1] || 'all',
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    json: args.includes('--json'),
    quiet: args.includes('--quiet'),
    schedule: args.includes('--schedule')
  };
  
  if (options.help) {
    printHelp();
    return;
  }
  
  if (options.schedule) {
    printSchedule();
    return;
  }
  
  const result = runPipeline(options);
  
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = { runPipeline, printHelp, printSchedule };
