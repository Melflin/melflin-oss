#!/usr/bin/env node
/**
 * Smart Reminders Analyzer - AI Analysis Module
 * 
 * Takes reminders JSON, categorizes via AI, outputs analysis report.
 * 
 * Usage: node analyze.js [--input=reminders.json] [--json]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_INPUT = path.join(__dirname, 'reminders.json');

// Mock data for testing (simulating 20 reminders)
const MOCK_REMINDERS = [
  { id: '1', title: 'Buy milk', body: '', dueDate: '2026-01-19', list: 'Personal', completed: false },
  { id: '2', title: 'test', body: '', dueDate: null, list: 'Default', completed: false },
  { id: '3', title: 'Call mom', body: 'Discuss birthday plans', dueDate: '2026-01-20', list: 'Personal', completed: false },
  { id: '4', title: 'asfeda', body: '', dueDate: null, list: 'Default', completed: false },
  { id: '5', title: 'Meeting Q3 2025', body: '', dueDate: '2025-09-15', list: 'Work', completed: false },
  { id: '6', title: 'Withings setup', body: 'Setup new scale', dueDate: null, list: 'Tech', completed: false },
  { id: '7', title: 'Install Withings', body: '', dueDate: null, list: 'Tech', completed: false },
  { id: '8', title: 'Withings app', body: '', dueDate: null, list: 'Tech', completed: false },
  { id: '9', title: 'Withings skill', body: '', dueDate: null, list: 'Tech', completed: false },
  { id: '10', title: 'Check Withings integration', body: '', dueDate: null, list: 'Tech', completed: false },
  { id: '11', title: 'Renew insurance', body: 'Auto-renew before Feb 1', dueDate: '2026-01-25', list: 'Finance', completed: false },
  { id: '12', title: 'check', body: '', dueDate: null, list: 'Default', completed: false },
  { id: '13', title: 'Buy milk', body: 'Get 2% milk', dueDate: '2026-01-19', list: 'Personal', completed: false },
  { id: '14', title: 'Prepare presentation', body: 'Q4 review', dueDate: '2026-01-22', list: 'Work', completed: false },
  { id: '15', title: 'xyz123', body: '', dueDate: null, list: 'Default', completed: false },
  { id: '16', title: 'Book vacation', body: 'Check flights to Portugal', dueDate: null, list: 'Travel', completed: false },
  { id: '17', title: 'Doctor appointment', body: 'Annual checkup', dueDate: '2026-02-01', list: 'Health', completed: false },
  { id: '18', title: 'Setup Withings', body: 'Complete setup', dueDate: null, list: 'Tech', completed: false },
  { id: '19', title: 'something', body: '', dueDate: null, list: 'Default', completed: false },
  { id: '20', title: 'Pay credit card', body: 'Due on 25th', dueDate: '2026-01-25', list: 'Finance', completed: false }
];

/**
 * Simple keyword-based categorization (fallback when AI unavailable)
 */
function categorizeSimple(reminders) {
  const categories = {
    clear: [],
    unclear: [],
    obsolete: [],
    duplicate: []
  };
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Track seen titles for duplicate detection
  const titleMap = new Map();
  
  for (const reminder of reminders) {
    const title = reminder.title.toLowerCase().trim();
    const body = (reminder.body || '').toLowerCase().replace('missing value', '').trim();
    const dueDate = reminder.dueDate ? new Date(reminder.dueDate) : null;
    
    // Check for gibberish/unclear (short, no context, no body)
    const hasContext = body.length > 5 || dueDate !== null;
    const isGibberish = /^([a-z]{1,4}|[0-9]{1,4}|[xyz]{3,})$/.test(title) && title.length < 6;
    const isVague = ['test', 'check', 'something', 'todo', 'later'].includes(title) && !hasContext;
    
    if (isGibberish || isVague) {
      categories.unclear.push({
        ...reminder,
        reason: isGibberish ? 'Appears to be gibberish text' : 'Too vague/incomplete'
      });
      continue;
    }
    
    // Check for obsolete (due date > 30 days ago)
    if (dueDate && dueDate < thirtyDaysAgo) {
      categories.obsolete.push({
        ...reminder,
        reason: `Due date ${reminder.dueDate} is more than 30 days ago`
      });
      continue;
    }
    
    // Check for duplicates (similar titles)
    const normalizedTitle = title.replace(/[^a-z0-9]/g, '');
    let isDuplicate = false;
    
    for (const [existingNorm, group] of titleMap) {
      // Check for high similarity
      if (normalizedTitle.includes(existingNorm) || existingNorm.includes(normalizedTitle)) {
        if (Math.abs(normalizedTitle.length - existingNorm.length) < 5) {
          group.push(reminder);
          isDuplicate = true;
          break;
        }
      }
    }
    
    if (isDuplicate) {
      categories.duplicate.push(reminder);
    } else {
      // Store for future comparison
      titleMap.set(normalizedTitle, [reminder]);
      categories.clear.push(reminder);
    }
  }
  
  return categories;
}

/**
 * AI-powered categorization (placeholder for Claude API integration)
 */
function categorizeAI(reminders) {
  // TODO: Implement Claude API call for smarter categorization
  // For now, fall back to simple categorization
  console.log('💡 Using simple categorization (AI integration coming soon)');
  return categorizeSimple(reminders);
}

/**
 * Generate analysis report
 */
function generateReport(categories) {
  const { clear, unclear, obsolete, duplicate } = categories;
  
  // Group duplicates
  const duplicateGroups = groupDuplicates(duplicate);
  
  const report = {
    summary: {
      total: clear.length + unclear.length + obsolete.length + duplicate.length,
      clear: clear.length,
      unclear: unclear.length,
      obsolete: obsolete.length,
      duplicates: duplicate.length,
      duplicateGroups: duplicateGroups.length
    },
    categories,
    duplicateGroups,
    suggestions: generateSuggestions(categories),
    fetchedAt: new Date().toISOString()
  };
  
  return report;
}

/**
 * Group similar reminders together
 */
function groupDuplicates(duplicates) {
  const groups = [];
  const processed = new Set();
  
  for (let i = 0; i < duplicates.length; i++) {
    if (processed.has(duplicates[i].id)) continue;
    
    const group = [duplicates[i]];
    processed.add(duplicates[i].id);
    
    for (let j = i + 1; j < duplicates.length; j++) {
      if (processed.has(duplicates[j].id)) continue;
      
      // Check similarity
      const similarity = calculateSimilarity(
        duplicates[i].title.toLowerCase(),
        duplicates[j].title.toLowerCase()
      );
      
      if (similarity > 0.5) {
        group.push(duplicates[j]);
        processed.add(duplicates[j].id);
      }
    }
    
    if (group.length > 1) {
      groups.push({
        id: `group-${groups.length + 1}`,
        reminders: group,
        suggestedMerge: generateMergeSuggestion(group)
      });
    }
  }
  
  return groups;
}

/**
 * Calculate string similarity (simple version)
 */
function calculateSimilarity(str1, str2) {
  const norm1 = str1.replace(/[^a-z0-9]/g, '');
  const norm2 = str2.replace(/[^a-z0-9]/g, '');
  
  if (norm1 === norm2) return 1;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.7;
  
  // Levenshtein-based similarity would be better, but this is a simple fallback
  return 0;
}

/**
 * Generate merge suggestion for duplicate group
 */
function generateMergeSuggestion(group) {
  if (group.length < 2) return null;
  
  // Use the most complete reminder as base
  const base = group.reduce((a, b) => 
    (b.body?.length || 0) > (a.body?.length || 0) ? b : a
  );
  
  return {
    title: `Consolidate ${group.length} reminders into one`,
    combinedTitle: base.title,
    combinedBody: `Merged from ${group.length} reminders:\n` + 
      group.map(r => `- ${r.title}`).join('\n'),
    action: 'merge'
  };
}

/**
 * Generate action suggestions
 */
function generateSuggestions(categories) {
  const suggestions = [];
  
  // Delete unclear
  if (categories.unclear.length > 0) {
    suggestions.push({
      type: 'delete',
      count: categories.unclear.length,
      description: `Delete ${categories.unclear.length} unclear reminders (gibberish/vague)`,
      action: 'delete_unclear',
      targetIds: categories.unclear.map(r => r.id)
    });
  }
  
  // Delete obsolete
  if (categories.obsolete.length > 0) {
    suggestions.push({
      type: 'delete',
      count: categories.obsolete.length,
      description: `Delete ${categories.obsolete.length} obsolete reminders (past due > 30 days)`,
      action: 'delete_obsolete',
      targetIds: categories.obsolete.map(r => r.id)
    });
  }
  
  // Merge duplicates
  if (categories.duplicate.length > 0) {
    const groups = groupDuplicates(categories.duplicate);
    suggestions.push({
      type: 'merge',
      count: groups.length,
      description: `Merge ${categories.duplicate.length} duplicates into ${groups.length} reminders`,
      action: 'merge_duplicates',
      groups: groups
    });
  }
  
  return suggestions;
}

/**
 * Main analysis function
 */
function analyzeReminders(options = {}) {
  const { input = DEFAULT_INPUT, json = false, useMock = true } = options;
  
  console.log('🧠 Smart Reminders Analyzer - AI Analysis Module');
  console.log('━'.repeat(42));
  
  let reminders;
  
  // Load reminders from file or use mock data
  if (useMock || !fs.existsSync(input)) {
    console.log('📊 Using mock data for testing (20 reminders)');
    reminders = MOCK_REMINDERS;
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(input, 'utf8'));
      reminders = data.reminders || data;
      console.log(`📥 Loaded ${reminders.length} reminders from ${input}`);
    } catch (error) {
      console.log(`⚠️  Failed to load ${input}: ${error.message}`);
      console.log('🔄 Falling back to mock data');
      reminders = MOCK_REMINDERS;
    }
  }
  
  console.log('');
  console.log('🔍 Analyzing reminders...');
  
  // Categorize
  const categories = categorizeAI(reminders);
  
  // Generate report
  const report = generateReport(categories);
  
  // Output
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  
  return report;
}

/**
 * Print formatted report
 */
function printReport(report) {
  const { summary, categories, duplicateGroups, suggestions } = report;
  
  console.log('');
  console.log('📊 Analysis Summary:');
  console.log(`   Total: ${summary.total} reminders`);
  console.log(`   ✅ Clear: ${summary.clear} (${Math.round(summary.clear/summary.total*100)}%)`);
  console.log(`   ⚠️  Unclear: ${summary.unclear} (${Math.round(summary.unclear/summary.total*100)}%)`);
  console.log(`   🗑️  Obsolete: ${summary.obsolete} (${Math.round(summary.obsolete/summary.total*100)}%)`);
  console.log(`   🔄 Duplicates: ${summary.duplicates} (${Math.round(summary.duplicates/summary.total*100)}%)`);
  
  console.log('');
  console.log('⚠️  Unclear Reminders:');
  categories.unclear.forEach((r, i) => {
    console.log(`   ${i+1}. "${r.title}" - ${r.reason}`);
  });
  
  console.log('');
  console.log('🗑️  Obsolete Reminders:');
  categories.obsolete.forEach((r, i) => {
    console.log(`   ${i+1}. "${r.title}" (Due: ${r.dueDate || 'no date'}) - ${r.reason}`);
  });
  
  if (duplicateGroups.length > 0) {
    console.log('');
    console.log('🔄 Duplicate Groups:');
    duplicateGroups.forEach((g, i) => {
      console.log(`   Group ${i+1} (${g.reminders.length} items):`);
      g.reminders.forEach(r => console.log(`     - "${r.title}"`));
      console.log(`     → Merge to: "${g.suggestedMerge?.combinedTitle}"`);
    });
  }
  
  console.log('');
  console.log('💡 Recommended Actions:');
  suggestions.forEach((s, i) => {
    console.log(`   ${i+1}. ${s.description}`);
  });
  
  console.log('');
  console.log(`📈 Potential Result: ${summary.total} → ${summary.clear + duplicateGroups.length} reminders (${Math.round((1 - (summary.clear + duplicateGroups.length)/summary.total)*100)}% reduction)`);
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    json: args.includes('--json'),
    input: args.find(a => a.startsWith('--input='))?.split('=')[1] || DEFAULT_INPUT,
    useMock: args.includes('--mock') || !fs.existsSync(DEFAULT_INPUT)
  };
  
  const result = analyzeReminders(options);
  
  // Save report
  const reportPath = path.join(__dirname, 'analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`💾 Report saved to: ${reportPath}`);
}

module.exports = { analyzeReminders, categorizeSimple, generateReport };
