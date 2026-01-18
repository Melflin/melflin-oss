#!/usr/bin/env node
/**
 * Knowledge Sync - Unified CLI
 * 
 * Sync highlights and notes from reading/audiobook consumption to Obsidian.
 * 
 * Usage:
 *   node index.js add --title "Book Title" --author "Author" [--format audiobook] [--tags "tag1,tag2"]
 *   node index.js review      # Review highlights from last week
 *   node index.js list        # List all synced books
 */

const { spawn } = require('child_process');
const path = require('path');

const COMMANDS = {
  add: {
    desc: 'Add a new book/notes to Obsidian',
    module: 'fetch.js',
    args: ['--title', '--author', '--format', '--tags', '--dry-run']
  },
  review: {
    desc: 'Show books read in last 30 days',
    module: 'review.js',
    args: []
  },
  list: {
    desc: 'List all synced books',
    module: 'list.js',
    args: []
  },
  help: {
    desc: 'Show this help',
    module: null,
    args: []
  }
};

async function main() {
  const command = process.argv[2] || 'help';
  
  if (command === 'help' || !COMMANDS[command]) {
    showHelp();
    return;
  }
  
  const cmd = COMMANDS[command];
  const scriptPath = path.join(__dirname, cmd.module);
  
  // Pass through remaining args
  const childArgs = process.argv.slice(3);
  
  console.log(`📚 Knowledge Sync: ${command}`);
  console.log('');
  
  if (cmd.module) {
    await runScript(scriptPath, childArgs);
  }
}

function showHelp() {
  console.log('📚 Knowledge Sync CLI');
  console.log('');
  console.log('Usage: node index.js <command> [options]');
  console.log('');
  console.log('Commands:');
  
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    if (name === 'help') continue;
    console.log(`  ${name.padEnd(10)} ${cmd.desc}`);
  }
  
  console.log('');
  console.log('Examples:');
  console.log('  node index.js add --title "Atomic Habits" --author "James Clear" --tags "productivity,habits"');
  console.log('  node index.js review');
  console.log('  node index.js list');
}

function runScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], { stdio: 'inherit' });
    
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script exited with code ${code}`));
    });
    
    child.on('error', reject);
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
