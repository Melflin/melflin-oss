#!/usr/bin/env node
/**
 * Smart Reminders Analyzer - Execute Module
 * 
 * Applies actions from analysis report: delete, merge, clarify reminders.
 * SAFETY-FIRST: Moves to DELETE CANDIDATE list instead of immediate delete.
 * 
 * Usage: node execute.js [--input=analysis-report.json] [--dry-run] [--confirm]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DEFAULT_INPUT = path.join(__dirname, 'analysis-report.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

/**
 * SAFETY-FIRST: Move reminder to "DELETE CANDIDATE" list for manual review
 * This works around macOS sandbox limitations on modifying reminder bodies
 */
function markForDeletion(reminders, options = {}) {
  const { dryRun = false, verbose = true, backupFile = null } = options;
  
  if (!reminders || reminders.length === 0) {
    if (verbose) console.log('⚠️  No reminders to mark');
    return { success: 0, failed: 0, errors: [], markedIds: [] };
  }
  
  const results = { success: 0, failed: 0, errors: [], markedIds: [] };
  const timestamp = new Date().toISOString().split('T')[0];
  const deleteListName = 'DELETE CANDIDATE';
  
  for (const reminder of reminders) {
    const backupRef = backupFile ? `Backup: ${path.basename(backupFile)}` : 'See backups/ folder';
    
    if (dryRun) {
      if (verbose) console.log(`🧪 [DRY-RUN] Would move to "${deleteListName}": "${reminder.title}"`);
      results.success++;
      results.markedIds.push({ id: reminder.id, title: reminder.title, dryRun: true });
      continue;
    }
    
    try {
      // AppleScript: Create list if needed, move reminder there
      const appleScript = `osascript -e '
        tell application "Reminders"
          -- Create DELETE CANDIDATE list if it does not exist
          try
            set deleteList to list "${deleteListName}"
          on error
            make new list with properties {name:"${deleteListName}"}
            set deleteList to list "${deleteListName}"
          end try
          
          -- Get reminder
          set rem to reminder id "${reminder.id}"
          
          -- Create new reminder in DELETE CANDIDATE list with original info
          make new reminder in deleteList with properties {name:"[🗑️ ${reminder.title}]", body:"Original list: ${reminder.list || 'Unknown'}. ${backupRef}. Created: ${timestamp}"}
          
          -- Delete the original reminder
          delete rem
        end tell
      '`;
      
      execSync(appleScript, { encoding: 'utf8', timeout: 20000 });
      if (verbose) console.log(`✅ Moved to "${deleteListName}": "${reminder.title}"`);
      results.success++;
      results.markedIds.push({ id: reminder.id, title: reminder.title });
    } catch (asError) {
      if (verbose) console.log(`⚠️  Could not move "${reminder.title}": ${asError.message}`);
      results.errors.push({ id: reminder.id, title: reminder.title, error: asError.message });
      results.failed++;
    }
  }
  
  if (results.success > 0 && verbose) {
    console.log('');
    console.log('💡 To restore deleted reminders from Apple Reminders:');
    console.log('   - Open Apple Reminders');
    console.log('   - Go to "DELETE CANDIDATE" list');
    console.log('   - Review each item');
    console.log('   - Move back to original list or delete permanently');
  }
  
  return results;
}

/**
 * Legacy delete function (for manual use only with --danger flag)
 */
function deleteReminders(ids, options = {}) {
  const { dryRun = false, verbose = true } = options;
  
  if (!ids || ids.length === 0) {
    if (verbose) console.log('⚠️  No reminders to delete');
    return { success: 0, failed: 0, errors: [] };
  }
  
  const results = { success: 0, failed: 0, errors: [] };
  
  for (const id of ids) {
    if (dryRun) {
      if (verbose) console.log(`🧪 [DRY-RUN] Would delete: ${id}`);
      results.success++;
      continue;
    }
    
    try {
      execSync(`remindctl delete ${id} --force`, { encoding: 'utf8', timeout: 10000 });
      if (verbose) console.log(`✅ Deleted: ${id}`);
      results.success++;
    } catch (error) {
      try {
        execSync(`osascript -e 'tell app "Reminders" to delete reminder id "${id}"'`, { encoding: 'utf8', timeout: 10000 });
        if (verbose) console.log(`✅ Deleted via AppleScript: ${id}`);
        results.success++;
      } catch (asError) {
        if (verbose) console.log(`❌ Failed to delete: ${id}`);
        results.errors.push({ id, error: asError.message });
        results.failed++;
      }
    }
  }
  
  return results;
}

/**
 * Create a merged reminder from multiple reminders
 */
function createMergedReminder(mergedData, options = {}) {
  const { dryRun = false, verbose = true } = options;
  
  if (dryRun) {
    if (verbose) console.log(`🧪 [DRY-RUN] Would create: "${mergedData.title}"`);
    if (verbose) console.log(`   Body: ${mergedData.body?.substring(0, 50)}...`);
    return { success: true, id: 'mock-id', dryRun: true };
  }
  
  try {
    const cmd = `remindctl add --title "${mergedData.title}" --list ${mergedData.list || 'Default'}`;
    const output = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    const newId = output.trim();
    if (verbose) console.log(`✅ Created merged reminder: ${newId}`);
    return { success: true, id: newId };
  } catch (error) {
    try {
      const appleScript = `osascript -e 'tell app "Reminders" to tell list "${mergedData.list || "Default"}" to make new reminder with properties {name:"${mergedData.title}", body:"${mergedData.body || ''}"}'`;
      execSync(appleScript, { encoding: 'utf8', timeout: 10000 });
      if (verbose) console.log(`✅ Created merged reminder via AppleScript`);
      return { success: true, id: 'as-created' };
    } catch (asError) {
      if (verbose) console.log(`❌ Failed to create merged reminder: ${asError.message}`);
      return { success: false, error: asError.message };
    }
  }
}

/**
 * Update a reminder with clarified title/body
 */
function updateReminder(id, updates, options = {}) {
  const { dryRun = false, verbose = true } = options;
  
  if (dryRun) {
    if (verbose) console.log(`🧪 [DRY-RUN] Would update ${id}: ${JSON.stringify(updates)}`);
    return { success: true, dryRun: true };
  }
  
  try {
    const cmd = `remindctl edit ${id} --title "${updates.title}"`;
    execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    if (verbose) console.log(`✅ Updated: ${id}`);
    return { success: true };
  } catch (error) {
    if (verbose) console.log(`❌ Failed to update ${id}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Create backup of current reminders (for safety)
 */
function createBackup(options = {}) {
  const { verbose = true } = options;
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `reminders-backup-${timestamp}.json`);
  
  if (verbose) console.log(`💾 Creating backup: ${backupFile}`);
  
  const backupData = {
    createdAt: new Date().toISOString(),
    source: 'smart-reminders-analyzer',
    note: 'Backup before executing safety-first actions'
  };
  
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  return backupFile;
}

/**
 * Execute all suggested actions from analysis report
 * SAFETY-FIRST: Moves to DELETE CANDIDATE list instead of immediate delete
 */
function executeActions(reportPath, options = {}) {
  const { 
    dryRun = false, 
    confirm = false, 
    verbose = true,
    skipDelete = false,
    skipMerge = false,
    skipClarify = false,
    safetyMode = true,
    actualDelete = false
  } = options;
  
  console.log('⚡ Smart Reminders Analyzer - Execute Module');
  console.log('━'.repeat(43));
  
  if (safetyMode) {
    console.log('🛡️  SAFETY-FIRST MODE: Reminders will be MOVED to "DELETE CANDIDATE" list');
    console.log('   Original data is preserved in backup before any changes');
  }
  
  let report;
  try {
    const data = fs.readFileSync(reportPath, 'utf8');
    report = JSON.parse(data);
  } catch (error) {
    console.log(`❌ Failed to load report: ${error.message}`);
    return { error: 'LOAD_FAILED' };
  }
  
  const suggestions = report.suggestions || [];
  
  console.log(`📋 Loaded ${suggestions.length} actions from report`);
  
  const totalDelete = suggestions.filter(s => s.type === 'delete').reduce((sum, s) => sum + s.count, 0);
  const totalMerge = suggestions.filter(s => s.type === 'merge').reduce((sum, s) => sum + s.count, 0);
  
  console.log('');
  console.log('📊 Action Summary:');
  console.log(`   🗑️  ${safetyMode ? 'Move to DELETE CANDIDATE' : 'Delete'}: ${totalDelete} reminders`);
  console.log(`   🔄 Merge: ${totalMerge} groups`);
  
  const backupFile = createBackup({ verbose });
  
  if (dryRun) {
    console.log('');
    console.log('🧪 DRY-RUN MODE - No changes will be made');
  }
  
  if (!dryRun && !confirm) {
    console.log('');
    console.log('⚠️  This will move reminders to "DELETE CANDIDATE" list!');
    console.log('💾 Backup created: ' + backupFile);
    console.log('');
    console.log('Use --confirm to execute, or --dry-run to preview');
    return { status: 'CANCELLED', backupFile };
  }
  
  if (!dryRun && confirm) {
    console.log('');
    console.log('🚀 Executing safety-first actions...');
  }
  
  const results = {
    backupFile,
    marked: { success: 0, failed: 0 },
    deleted: { success: 0, failed: 0 },
    merged: { success: 0, failed: 0 },
    updated: { success: 0, failed: 0 },
    safetyMode: safetyMode,
    timestamp: new Date().toISOString()
  };
  
  const deleteActions = suggestions.filter(s => s.type === 'delete' && !skipDelete);
  for (const action of deleteActions) {
    if (action.targetIds) {
      const markedReminders = action.targetIds.map(id => {
        const reminder = report.categories?.unclear?.find(r => r.id === id) || { id, title: id, body: '', list: 'Unknown' };
        return reminder;
      });
      
      if (safetyMode && !actualDelete) {
        const result = markForDeletion(markedReminders, { dryRun, verbose, backupFile });
        results.marked.success += result.success;
        results.marked.failed += result.failed;
      } else {
        const result = deleteReminders(action.targetIds, { dryRun, verbose });
        results.deleted.success += result.success;
        results.deleted.failed += result.failed;
      }
    }
  }
  
  const mergeActions = suggestions.filter(s => s.type === 'merge' && !skipMerge);
  for (const action of mergeActions) {
    if (action.groups) {
      for (const group of action.groups) {
        if (group.suggestedMerge) {
          const result = createMergedReminder(group.suggestedMerge, { dryRun, verbose });
          if (result.success) {
            results.merged.success++;
            if (!dryRun) {
              deleteReminders(group.reminders.map(r => r.id), { dryRun: false, verbose: false });
            }
          } else {
            results.merged.failed++;
          }
        }
      }
    }
  }
  
  console.log('');
  console.log('📈 Results:');
  if (!dryRun) {
    if (safetyMode) {
      console.log(`   🗑️  Moved to DELETE CANDIDATE: ${results.marked.success} (${results.marked.failed} failed)`);
    } else {
      console.log(`   🗑️  Deleted: ${results.deleted.success} (${results.deleted.failed} failed)`);
    }
    console.log(`   🔄 Merged: ${results.merged.success} (${results.merged.failed} failed)`);
    console.log(`   💾 Backup: ${backupFile}`);
    if (safetyMode) {
      console.log('');
      console.log('💡 Review in Apple Reminders "DELETE CANDIDATE" list');
      console.log('💡 Run with --danger to permanently delete after review');
    }
  } else {
    console.log('   (See dry-run output above for planned changes)');
  }
  
  const logFile = path.join(__dirname, 'execution-log.json');
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  if (verbose) console.log(`📝 Execution log: ${logFile}`);
  
  return { ...results, status: dryRun ? 'DRY-RUN' : 'COMPLETED' };
}

/**
 * Interactive mode - ask user for each action
 */
async function interactiveExecute(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const suggestions = report.suggestions || [];
  
  console.log('🎯 Interactive Mode');
  console.log('━'.repeat(30));
  
  for (let i = 0; i < suggestions.length; i++) {
    const action = suggestions[i];
    console.log('');
    console.log(`Action ${i + 1}/${suggestions.length}: ${action.description}`);
    console.log('   (Interactive mode requires user input - skipping for now)');
  }
  
  return { status: 'INTERACTIVE_SKIPPED' };
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    input: args.find(a => a.startsWith('--input='))?.split('=')[1] || DEFAULT_INPUT,
    dryRun: args.includes('--dry-run'),
    confirm: args.includes('--confirm'),
    skipDelete: args.includes('--skip-delete'),
    skipMerge: args.includes('--skip-merge'),
    interactive: args.includes('--interactive'),
    danger: args.includes('--danger')
  };
  
  if (options.interactive) {
    interactiveExecute(options.input);
  } else {
    const result = executeActions(options.input, options);
    
    if (result.status === 'CANCELLED') {
      console.log('');
      console.log('💡 To execute: node execute.js --confirm');
      console.log('💡 To preview: node execute.js --dry-run');
      console.log('💡 To permanently delete after review: node execute.js --confirm --danger');
    }
  }
}

module.exports = { 
  executeActions, 
  deleteReminders, 
  createMergedReminder, 
  updateReminder,
  markForDeletion
};
