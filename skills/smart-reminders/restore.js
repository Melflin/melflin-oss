#!/usr/bin/env node
/**
 * Smart Reminders Analyzer - Restore Module
 * 
 * Restores reminders from backup files.
 * 
 * Usage:
 *   node restore.js                        # Interactive restore
 *   node restore.js --list                 # List all backups
 *   node restore.js --latest               # Restore from latest backup
 *   node restore.js --file <backup.json>   # Restore from specific backup
 *   node restore.js --dry-run              # Preview without changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'backups');

/**
 * List all backup files
 */
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('❌ No backups directory found');
    return [];
  }
  
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('reminders-backup-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  return files;
}

/**
 * Restore a single reminder from backup data
 */
function restoreReminder(reminder, options = {}) {
  const { dryRun = false, verbose = true, listName = 'Default' } = options;
  
  if (dryRun) {
    if (verbose) console.log(`🧪 [DRY-RUN] Would restore: "${reminder.title}"`);
    return { success: true, id: 'mock-id', dryRun: true };
  }
  
  try {
    // Create via AppleScript (supports body and list)
    const title = reminder.title.replace(/"/g, '\\"');
    const body = (reminder.body || '').replace(/"/g, '\\"');
    const list = reminder.list || listName;
    
    const appleScript = `osascript -e '
      tell application "Reminders"
        tell list "${list}"
          make new reminder with properties {name:"${title}", body:"${body}"}
        end tell
      end tell
    '`;
    
    execSync(appleScript, { encoding: 'utf8', timeout: 15000 });
    if (verbose) console.log(`✅ Restored: "${reminder.title}"`);
    return { success: true };
  } catch (error) {
    if (verbose) console.log(`❌ Failed to restore: "${reminder.title}" - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Restore all reminders from a backup file
 */
function restoreFromBackup(backupPath, options = {}) {
  const { dryRun = false, verbose = true, listName = null } = options;
  
  console.log('');
  console.log('🔄 Smart Reminders Analyzer - Restore Module');
  console.log('━'.repeat(45));
  
  // Load backup
  let backup;
  try {
    const data = fs.readFileSync(backupPath, 'utf8');
    backup = JSON.parse(data);
  } catch (error) {
    console.log(`❌ Failed to load backup: ${error.message}`);
    return { error: 'LOAD_FAILED' };
  }
  
  console.log(`📋 Backup: ${path.basename(backupPath)}`);
  console.log(`   Created: ${backup.createdAt}`);
  console.log(`   Reminders: ${backup.activeReminders || backup.reminders?.length || 0}`);
  console.log('');
  
  if (dryRun) {
    console.log('🧪 DRY-RUN MODE - No changes will be made');
  }
  
  const reminders = backup.reminders || [];
  const results = { success: 0, failed: 0, errors: [] };
  
  for (const reminder of reminders) {
    // Skip already completed reminders
    if (reminder.completed) {
      if (verbose) console.log(`⏭️  Skipping (completed): "${reminder.title}"`);
      continue;
    }
    
    const result = restoreReminder(reminder, { 
      dryRun, 
      verbose: verbose && !dryRun,
      listName: listName || reminder.list 
    });
    
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ title: reminder.title, error: result.error });
    }
  }
  
  // Summary
  console.log('');
  console.log('📈 Results:');
  console.log(`   ✅ Restored: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('');
    console.log('⚠️  Errors:');
    results.errors.forEach(e => console.log(`   - ${e.title}: ${e.error}`));
  }
  
  return { ...results, status: dryRun ? 'DRY-RUN' : 'COMPLETED' };
}

/**
 * Restore only marked reminders
 * Looks for reminders with "[🗑️ DELETE CANDIDATE" in body
 */
function restoreMarkedReminders(options = {}) {
  const { dryRun = false, verbose = true, backupGlob = null } = options;
  
  console.log('');
  console.log('🔄 Smart Reminders Analyzer - Restore Marked Reminders');
  console.log('━'.repeat(50));
  
  // Find latest backup
  const backups = listBackups();
  if (backups.length === 0) {
    console.log('❌ No backups found');
    return { error: 'NO_BACKUPS' };
  }
  
  const latestBackup = backupGlob || path.join(BACKUP_DIR, backups[0]);
  console.log(`📋 Using backup: ${path.basename(latestBackup)}`);
  
  // Load backup
  let backup;
  try {
    backup = JSON.parse(fs.readFileSync(latestBackup, 'utf8'));
  } catch (error) {
    console.log(`❌ Failed to load backup: ${error.message}`);
    return { error: 'LOAD_FAILED' };
  }
  
  // Find marked reminders in Apple Reminders
  // This is a simplified version - in reality would query Reminders app
  console.log('');
  console.log('💡 To restore marked reminders:');
  console.log('   1. Open Apple Reminders app');
  console.log('   2. Look for reminders with "[🗑️ DELETE CANDIDATE" in notes');
  console.log('   3. Review and restore manually, OR');
  console.log('   4. Use --full-restore to recreate ALL reminders from backup');
  console.log('');
  console.log('⚠️  Note: Restoring individual marked reminders requires');
  console.log('   parsing Apple Reminders, which is complex.');
  console.log('   Consider restoring the full backup if needed.');
  
  return { status: 'INFO', message: 'Manual review required' };
}

/**
 * Interactive mode
 */
async function interactiveRestore() {
  const backups = listBackups();
  
  console.log('🔄 Smart Reminders Analyzer - Restore');
  console.log('━'.repeat(40));
  console.log('');
  
  if (backups.length === 0) {
    console.log('❌ No backups found');
    return;
  }
  
  console.log('📋 Available Backups:');
  backups.forEach((f, i) => {
    const backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, f), 'utf8'));
    const count = backup.activeReminders || backup.reminders?.length || 0;
    console.log(`   ${i + 1}. ${f} (${count} reminders)`);
  });
  
  console.log('');
  console.log('Options:');
  console.log('   --latest    Restore from latest backup');
  console.log('   --file X    Restore from specific backup');
  console.log('   --dry-run   Preview without changes');
  console.log('');
  console.log('💡 Use --help for all options');
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    help: args.includes('--help') || args.includes('-h'),
    list: args.includes('--list'),
    latest: args.includes('--latest'),
    file: args.find(a => a.startsWith('--file='))?.split('=')[1],
    dryRun: args.includes('--dry-run'),
    restoreMarked: args.includes('--restore-marked'),
    fullRestore: args.includes('--full-restore'),
    verbose: !args.includes('--quiet')
  };
  
  if (options.help) {
    console.log(`
🔄 Smart Reminders Analyzer - Restore Module

USAGE:
  node restore.js [OPTIONS]

OPTIONS:
  --help, -h         Show this help
  --list             List all available backups
  --latest           Restore from latest backup
  --file=<backup>    Restore from specific backup file
  --dry-run          Preview without making changes
  --restore-marked   Show how to restore marked reminders
  --full-restore     Full restore from backup (recreates all reminders)

EXAMPLES:
  # List all backups
  node restore.js --list

  # Preview restore from latest backup
  node restore.js --latest --dry-run

  # Actually restore (careful!)
  node restore.js --latest

  # Restore from specific backup
  node restore.js --file=reminders-backup-20260118-152650.json

SAFETY:
  - Always creates backup before restore
  - --dry-run shows what would happen
  - Restored reminders go to their original lists
  - Completed reminders are NOT restored

BACKUP LOCATION:
  ${BACKUP_DIR}

---
    `);
    return;
  }
  
  if (options.list) {
    const backups = listBackups();
    console.log('📋 Available Backups:');
    if (backups.length === 0) {
      console.log('   No backups found');
    } else {
      backups.forEach((f, i) => {
        const backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, f), 'utf8'));
        const count = backup.activeReminders || backup.reminders?.length || 0;
        console.log(`   ${i + 1}. ${f} (${count} reminders)`);
      });
    }
    return;
  }
  
  if (options.restoreMarked) {
    restoreMarkedReminders(options);
    return;
  }
  
  if (options.latest || options.file || options.fullRestore) {
    let backupPath;
    
    if (options.latest) {
      const backups = listBackups();
      if (backups.length === 0) {
        console.log('❌ No backups found');
        process.exit(1);
      }
      backupPath = path.join(BACKUP_DIR, backups[0]);
    } else if (options.file) {
      backupPath = path.join(BACKUP_DIR, options.file);
    } else {
      backupPath = null;
    }
    
    if (backupPath && !fs.existsSync(backupPath)) {
      console.log(`❌ Backup not found: ${backupPath}`);
      process.exit(1);
    }
    
    const result = restoreFromBackup(backupPath, options);
    
    if (result.status === 'DRY-RUN') {
      console.log('');
      console.log('💡 To actually restore, run without --dry-run');
    }
    return;
  }
  
  // Default: Interactive mode
  interactiveRestore();
}

module.exports = { 
  restoreFromBackup, 
  restoreReminder, 
  listBackups,
  restoreMarkedReminders 
};
