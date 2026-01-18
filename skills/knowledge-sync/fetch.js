#!/usr/bin/env node
/**
 * Knowledge Sync - Fetch Module
 * 
 * For manual workflow: Creates a new book note from template
 * 
 * Usage:
 *   node fetch.js --title "Book Title" --author "Author Name" [--format audiobook] [--tags "tag1,tag2"]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'book-note.md');
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 
  '/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher';

async function main() {
  const args = parseArgs();
  
  if (!args.title || !args.author) {
    console.log('Usage: node fetch.js --title "Book Title" --author "Author" [--format audiobook] [--tags "tag1,tag2"]');
    console.log('');
    console.log('Options:');
    console.log('  --title    Book title (required)');
    console.log('  --author   Author name (required)');
    console.log('  --format   audiobook|ebook|physical (default: audiobook)');
    console.log('  --tags     Comma-separated tags');
    console.log('  --dry-run  Preview without creating file');
    process.exit(1);
  }
  
  // Ensure vault path exists
  if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    console.log(`Creating directory: ${OBSIDIAN_VAULT_PATH}`);
    fs.mkdirSync(OBSIDIAN_VAULT_PATH, { recursive: true });
  }
  
  // Load template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // Replace placeholders
  const today = new Date().toISOString().split('T')[0];
  const content = template
    .replace(/\{\{title\}\}/g, args.title)
    .replace(/\{\{author\}\}/g, args.author)
    .replace(/\{\{date\}\}/g, today)
    .replace(/\{\{date_finished\}\}/g, args.dateFinished || today)
    .replace(/\{\{rating\}\}/g, args.rating || '?')
    .replace(/\{\{tags\}\}/g, args.tags || '')
    .replace(/\{\{format\}\}/g, args.format || 'audiobook');
  
  // Generate filename
  const safeTitle = args.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  const filename = `${safeTitle}.md`;
  const filePath = path.join(OBSIDIAN_VAULT_PATH, filename);
  
  if (args.dryRun) {
    console.log('=== DRY RUN - Preview ===');
    console.log(`Filename: ${filename}`);
    console.log(`Path: ${filePath}`);
    console.log('');
    console.log(content);
  } else {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
    console.log(`📝 Open in Obsidian to edit`);
  }
}

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  
  return args;
}

main().catch(console.error);
