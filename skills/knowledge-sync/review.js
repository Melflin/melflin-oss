#!/usr/bin/env node
/**
 * Knowledge Sync - Review Module
 * 
 * Show books read in the last 30 days for weekly review.
 */

const fs = require('fs');
const path = require('path');

const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 
  '/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher';

const DAYS = parseInt(process.argv[2]) || 30;

function main() {
  if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    console.log(`📚 No books directory found: ${OBSIDIAN_VAULT_PATH}`);
    console.log('   Run "node index.js add" to add your first book!');
    return;
  }
  
  const files = fs.readdirSync(OBSIDIAN_VAULT_PATH).filter(f => f.endsWith('.md'));
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS);
  
  console.log(`📚 Books read in the last ${DAYS} days:`);
  console.log('');
  
  let recentBooks = [];
  
  for (const file of files) {
    const filePath = path.join(OBSIDIAN_VAULT_PATH, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = parseFrontmatter(frontmatterMatch[1]);
    const addedDate = new Date(frontmatter.date_added);
    
    if (addedDate >= cutoffDate) {
      recentBooks.push({
        file,
        title: frontmatter.title,
        author: frontmatter.author,
        date: frontmatter.date_added,
        rating: frontmatter.rating,
        source: frontmatter.source
      });
    }
  }
  
  if (recentBooks.length === 0) {
    console.log('   No books added recently.');
    console.log('   Add a book: node index.js add --title "Book Title" --author "Author"');
  } else {
    for (const book of recentBooks) {
      const stars = book.rating ? '★'.repeat(parseInt(book.rating)) : '☆';
      console.log(`  📖 ${book.title} - ${book.author}`);
      console.log(`     ${book.date} | ${book.source || 'N/A'} | ${stars}`);
      console.log('');
    }
  }
  
  console.log('💡 Tip: Add highlights and notes in Obsidian!');
}

function parseFrontmatter(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      result[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  
  return result;
}

main();
