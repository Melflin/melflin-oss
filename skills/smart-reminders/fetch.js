#!/usr/bin/env node
/**
 * Smart Reminders Analyzer - Fetch Module
 * 
 * Fetches all reminders from Apple Reminders via remindctl CLI.
 * Falls back to AppleScript if remindctl fails.
 * 
 * Output: JSON array of reminder objects
 * 
 * Usage: node fetch.js [--json]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_FILE = path.join(__dirname, 'reminders.json');

/**
 * Fetch reminders using remindctl CLI
 */
function fetchViaRemindctl() {
  try {
    console.log('📥 Fetching via remindctl...');
    
    // Get all reminders as JSON
    const output = execSync('remindctl all --json', {
      encoding: 'utf8',
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    const reminders = JSON.parse(output);
    console.log(`✅ Found ${reminders.length} reminders via remindctl`);
    return reminders;
    
  } catch (error) {
    console.log(`⚠️  remindctl failed: ${error.message}`);
    return null;
  }
}

/**
 * Fetch reminders using AppleScript (fallback)
 * Uses chunked processing for large datasets (683+ reminders)
 */
function fetchViaAppleScript() {
  try {
    console.log('📥 Fetching via AppleScript (chunked mode)...');
    
    // Get count first
    const countStr = execSync(`osascript -e 'tell app "Reminders" to count every reminder'`, {
      encoding: 'utf8',
      timeout: 10000
    });
    
    const totalCount = parseInt(countStr.trim()) || 0;
    console.log(`📊 Total reminders: ${totalCount}`);
    
    // Use external AppleScript file for better performance
    const scriptPath = path.join(__dirname, 'fetch-realms.applescript');
    const chunkSize = 25; // Smaller chunks for stability
    const allReminders = [];
    
    for (let i = 0; i < totalCount; i += chunkSize) {
      const remaining = totalCount - i;
      const currentChunk = Math.min(chunkSize, remaining);
      
      try {
        const output = execSync(`osascript "${scriptPath}" ${i} ${currentChunk}`, {
          encoding: 'utf8',
          timeout: 20000
        });
        
        const batchReminders = parseAppleScriptOutput(output);
        allReminders.push(...batchReminders);
        
        // Progress indicator
        const progress = Math.round(((i + currentChunk) / totalCount) * 100);
        process.stdout.write(`\r   Progress: ${progress}% (${allReminders.length}/${totalCount})`);
      } catch (batchError) {
        console.log(`\n⚠️  Chunk ${i}-${i+currentChunk} failed, skipping...`);
        continue;
      }
    }
    
    console.log(`\n✅ Total: ${allReminders.length} reminders fetched`);
    return allReminders;
    
  } catch (error) {
    console.log(`⚠️  AppleScript failed: ${error.message}`);
    return null;
  }
}

/**
 * Parse AppleScript output (||| delimiter format, ;;; record separator)
 */
function parseAppleScriptOutput(output) {
  if (!output || !output.trim()) return [];
  
  const reminders = [];
  // Support both old format (:::) and new format (;;;|||)
  const entries = output.trim().split('|||;;;|||');
  
  for (const entry of entries) {
    if (!entry.trim()) continue;
    
    const parts = entry.split('|||');
    if (parts.length >= 6) {
      reminders.push({
        id: parts[0].trim(),
        title: parts[1].trim(),
        body: parts[2].trim(),
        dueDate: parts[3].trim() !== 'missing value' ? parts[3].trim() : null,
        completed: parts[4].trim() === 'true',
        list: parts[5].trim()
      });
    }
  }
  
  return reminders;
}

/**
 * Transform reminders to standard format
 */
function normalizeReminders(reminders) {
  if (!reminders || !Array.isArray(reminders)) return [];
  
  return reminders.map((r, index) => ({
    id: r.id || r.bundleid || `reminder-${index}`,
    title: r.name || r.title || r.title || 'Untitled',
    body: r.body || r.notes || r.description || '',
    dueDate: r.dueDate || r.due_date || r.due || null,
    completed: r.completed || r.iscompleted || false,
    list: r.listName || r.list_name || r.list || 'Default',
    createdAt: null,
    modifiedAt: null
  }));
}

/**
 * Main fetch function
 */
function fetchReminders(options = {}) {
  const { json = false, output = null } = options;
  
  console.log('🔍 Smart Reminders Analyzer - Fetch Module');
  console.log('━'.repeat(40));
  
  // Try different methods
  let reminders = fetchViaRemindctl();
  
  if (!reminders) {
    console.log('🔄 Trying fallback methods...');
    reminders = fetchViaAppleScript();
  }
  
  if (!reminders) {
    console.log('❌ All fetch methods failed!');
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Grant Reminders access: System Preferences > Privacy > Reminders');
    console.log('   2. Run: remindctl status');
    console.log('   3. Try: tccutil reset Reminders com.apple.Reminders');
    return { error: 'FETCH_FAILED', message: 'Unable to fetch reminders' };
  }
  
  // Normalize data format
  const normalized = normalizeReminders(reminders);
  
  // Filter out completed reminders (optional)
  const activeOnly = normalized.filter(r => !r.completed);
  
  const result = {
    total: normalized.length,
    active: activeOnly.length,
    completed: normalized.length - activeOnly.length,
    reminders: activeOnly,
    fetchedAt: new Date().toISOString()
  };
  
  // Output
  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Total: ${result.total}`);
    console.log(`   Active: ${result.active}`);
    console.log(`   Completed: ${result.completed}`);
    console.log('');
    console.log(`💾 Saved to: ${output || OUTPUT_FILE}`);
  }
  
  // Save to file
  const savePath = output || OUTPUT_FILE;
  fs.writeFileSync(savePath, JSON.stringify(result, null, 2));
  console.log(`✅ Saved ${activeOnly.length} active reminders to ${savePath}`);
  
  return result;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    json: args.includes('--json'),
    output: args.find(a => a.startsWith('--output='))?.split('=')[1] || null
  };
  
  const result = fetchReminders(options);
  
  // Exit with error code if fetch failed
  if (result.error) {
    process.exit(1);
  }
}

module.exports = { fetchReminders, normalizeReminders };
