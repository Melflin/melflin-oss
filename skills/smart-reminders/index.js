#!/usr/bin/env node
/**
 * Smart Reminders Analyzer - Unified CLI
 * 
 * AI-powered bulk analysis and cleanup for Apple Reminders.
 * 
 * Usage:
 *   node index.js              # Interactive mode
 *   node index.js --analyze    # Analyze only, show report
 *   node index.js --execute    # Execute actions from last analysis
 *   node index.js --dry-run    # Preview actions without changes
 *   node index.js --json       # JSON output for scripts
 *   node index.js --mock       # Use mock data (no real reminders)
 *   node index.js --help       # Show help
 */

const fs = require('fs');
const path = require('path');

// Imports (lazy loading to avoid errors if modules missing)
let fetchReminders, analyzeReminders, executeActions;

try {
  ({ fetchReminders } = require('./fetch.js'));
  ({ analyzeReminders } = require('./analyze.js'));
  ({ executeActions } = require('./execute.js'));
} catch (e) {
  console.log('⚠️  Module load error:', e.message);
  console.log('💡 Run from skill directory: cd skills/smart-reminders');
  process.exit(1);
}

// Configuration
const DEFAULT_INPUT = path.join(__dirname, 'reminders.json');
const DEFAULT_REPORT = path.join(__dirname, 'analysis-report.json');

/**
 * Print help message
 */
function printHelp() {
  const help = `
🧠 Smart Reminders Analyzer v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE:
  node index.js [OPTIONS]

OPTIONS:
  --help, -h          Show this help message
  --analyze           Run analysis only (don't execute actions)
  --dry-run           Preview actions without changes (safety-first!)
  --execute           Mark reminders for deletion (safety-first)
  --danger            ACTUAL DELETE (after --execute, for manual review)
  --restore           Restore reminders from backup
  --list-backups      List available backups
  --execute           Execute actions from last analysis
  --dry-run           Preview actions without making changes
  --batch             Auto-apply safe actions (skip confirmation)
  --json              Output in JSON format for scripts
  --mock              Use mock data (bypass remindctl)
  --reset             Clear cached data and start fresh
  --status            Show current status and cached data

EXAMPLES:
  # Interactive mode (default)
  node index.js

  # Analyze and show report
  node index.js --analyze --json

  # Preview what would happen
  node index.js --dry-run --mock

  # Execute with confirmation
  node index.js --execute

  # Auto-apply safe actions
  node index.js --batch

WORKFLOW:
  1. Fetch reminders (from Apple Reminders via remindctl)
  2. Analyze (categorize: Clear/Unclear/Obsolete/Duplicate)
  3. Review suggestions
  4. Execute actions (delete, merge, clarify)

PERMISSIONS:
  - Requires: remindctl (brew install steipete/tap/remindctl)
  - Fallback: AppleScript (if remindctl fails)
  - macOS Privacy > Reminders > Terminal must be enabled

FILES:
  reminders.json         - Cached reminders (auto-generated)
  analysis-report.json   - Latest analysis report
  execution-log.json     - Last execution results
  backups/               - Backup files before modifications

---
  `;
  console.log(help);
}

/**
 * Print status
 */
function printStatus() {
  console.log('📊 Smart Reminders Analyzer - Status');
  console.log('━'.repeat(40));
  
  const hasReminders = fs.existsSync(DEFAULT_INPUT);
  const hasReport = fs.existsSync(DEFAULT_REPORT);
  
  console.log(`📁 reminders.json:      ${hasReminders ? '✅' : '❌'}`);
  console.log(`📋 analysis-report.json: ${hasReport ? '✅' : '❌'}`);
  
  if (hasReminders) {
    try {
      const data = JSON.parse(fs.readFileSync(DEFAULT_INPUT, 'utf8'));
      console.log(`   Cached reminders: ${data.active || 0} active, ${data.total || 0} total`);
      console.log(`   Fetched: ${data.fetchedAt || 'unknown'}`);
    } catch (e) {
      console.log(`   ⚠️  Error reading: ${e.message}`);
    }
  }
  
  if (hasReport) {
    try {
      const report = JSON.parse(fs.readFileSync(DEFAULT_REPORT, 'utf8'));
      const s = report.summary || {};
      console.log(`📈 Last Analysis:`);
      console.log(`   Clear: ${s.clear || 0} | Unclear: ${s.unclear || 0} | Obsolete: ${s.obsolete || 0} | Duplicates: ${s.duplicates || 0}`);
    } catch (e) {
      console.log(`   ⚠️  Error reading report: ${e.message}`);
    }
  }
}

/**
 * Interactive mode - main workflow
 */
async function interactiveMode(options) {
  console.log('');
  console.log('🎯 Smart Reminders Analyzer - Interactive Mode');
  console.log('━'.repeat(45));
  
  // Step 1: Fetch
  console.log('');
  console.log('📥 Step 1: Fetching Reminders...');
  const fetchResult = await new Promise((resolve) => {
    // Modify fetchReminders to not exit on error
    const originalExit = process.exit;
    process.exit = () => {};
    try {
      const result = fetchReminders({ json: true, output: DEFAULT_INPUT });
      process.exit = originalExit;
      resolve(result);
    } catch (e) {
      process.exit = originalExit;
      resolve({ error: e.message });
    }
  });
  
  if (fetchResult.error) {
    console.log('❌ Fetch failed. Using mock data for demo...');
    console.log('💡 To fix: Grant Reminders access to Terminal');
  }
  
  // Step 2: Analyze
  console.log('');
  console.log('🔍 Step 2: Analyzing Reminders...');
  const report = analyzeReminders({ 
    input: DEFAULT_INPUT, 
    json: true, 
    useMock: fetchResult.error 
  });
  
  // Save report
  fs.writeFileSync(DEFAULT_REPORT, JSON.stringify(report, null, 2));
  console.log(`💾 Report saved to: ${DEFAULT_REPORT}`);
  
  // Step 3: Review
  console.log('');
  console.log('📋 Step 3: Review Suggestions');
  const suggestions = report.suggestions || [];
  
  if (suggestions.length === 0) {
    console.log('✅ No actions needed - your reminders are clean!');
    return { status: 'CLEAN' };
  }
  
  const totalDelete = suggestions.filter(s => s.type === 'delete').reduce((sum, s) => sum + s.count, 0);
  const totalMerge = suggestions.filter(s => s.type === 'merge').reduce((sum, s) => sum + s.count, 0);
  
  console.log(`   🗑️  ${totalDelete} reminders to delete`);
  console.log(`   🔄 ${totalMerge} duplicate groups to merge`);
  
  // In real interactive mode, would ask user here
  console.log('');
  console.log('💡 Use --execute to apply these changes');
  console.log('💡 Use --dry-run to preview first');
  
  return { status: 'ANALYZED', report, suggestions };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {
    help: args.includes('--help') || args.includes('-h'),
    analyze: args.includes('--analyze'),
    execute: args.includes('--execute'),
    dryRun: args.includes('--dry-run'),
    batch: args.includes('--batch'),
    json: args.includes('--json'),
    mock: args.includes('--mock'),
    reset: args.includes('--reset'),
    status: args.includes('--status'),
    listBackups: args.includes('--list-backups'),
    restore: args.includes('--restore'),
    danger: args.includes('--danger')
  };
  
  // Show help
  if (options.help) {
    printHelp();
    return;
  }
  
  // Show status
  if (options.status) {
    printStatus();
    return;
  }
  
  // List backups
  if (options.listBackups) {
    const { listBackups: listBackupsFn } = require('./restore.js');
    const backups = listBackupsFn();
    console.log('📋 Available Backups:');
    if (backups.length === 0) {
      console.log('   No backups found');
    } else {
      const BACKUP_DIR = path.join(__dirname, 'backups');
      backups.forEach((f, i) => {
        try {
          const backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, f), 'utf8'));
          const count = backup.activeReminders || backup.reminders?.length || 0;
          console.log(`   ${i + 1}. ${f} (${count} reminders)`);
        } catch (e) {
          console.log(`   ${i + 1}. ${f}`);
        }
      });
    }
    return;
  }
  
  // Reset cached data
  if (options.reset) {
    console.log('🗑️  Clearing cached data...');
    [DEFAULT_INPUT, DEFAULT_REPORT].forEach(f => {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
        console.log(`   Removed: ${f}`);
      }
    });
    return;
  }
  
  // Banner
  if (!options.json) {
    console.log('');
    console.log('🧠 Smart Reminders Analyzer');
    console.log('━'.repeat(30));
    if (options.mock) console.log('🔧 Mock mode: ON');
  }
  
  // Execute mode
  if (options.execute || options.dryRun) {
    if (!fs.existsSync(DEFAULT_REPORT)) {
      console.log('❌ No analysis report found. Run --analyze first.');
      return;
    }
    
    const result = executeActions(DEFAULT_REPORT, {
      dryRun: options.dryRun,
      confirm: !options.dryRun,
      skipDelete: false,
      skipMerge: false,
      verbose: !options.json,
      safetyMode: true,
      actualDelete: options.danger
    });
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }
    return;
  }
  
  // Restore mode
  if (options.restore) {
    const { restoreFromBackup, listBackups: listBackupsFn } = require('./restore.js');
    const backups = listBackupsFn();
    if (backups.length === 0) {
      console.log('❌ No backups found');
      return;
    }
    const latestBackup = path.join(__dirname, 'backups', backups[0]);
    restoreFromBackup(latestBackup, { dryRun: options.dryRun, verbose: !options.json });
    return;
  }
  
  // Analyze mode
  if (options.analyze) {
    const report = analyzeReminders({
      input: DEFAULT_INPUT,
      json: options.json,
      useMock: options.mock || !fs.existsSync(DEFAULT_INPUT)
    });
    
    if (!options.json) {
      fs.writeFileSync(DEFAULT_REPORT, JSON.stringify(report, null, 2));
      console.log(`💾 Report saved to: ${DEFAULT_REPORT}`);
    }
    return;
  }
  
  // Default: Interactive mode
  const result = await interactiveMode(options);
  
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  }
}

// Run
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
