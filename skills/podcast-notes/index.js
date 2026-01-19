#!/usr/bin/env node
/**
 * Podcast → Notes: CLI Interface
 * 
 * Unified command for podcast to notes workflow.
 * 
 * Usage:
 *   node index.js <url> [--dry-run] [--mock]
 * 
 * Workflow:
 *   1. Fetch audio from URL
 *   2. Transcribe audio
 *   3. Extract insights
 *   4. Save to Obsidian
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  tmpDir: '/tmp/podcast-notes',
  audioFile: '/tmp/podcast-notes/audio.mp3',
  analysisFile: '/tmp/podcast-notes/analysis.json',
  vaultPath: process.env.OBSIDIAN_VAULT || '~/Obsidian/Melf2025'
};

const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const url = args.find(a => !a.startsWith('--') && a !== '-h');
const dryRun = args.includes('--dry-run');
const mock = args.includes('--mock');

function showHelpMessage() {
  console.log(`
🎧 Podcast → Notes CLI
======================

Usage: node index.js <url> [options]

Arguments:
  <url>              Podcast/video URL to process

Options:
  --help, -h         Show this help message
  --dry-run          Preview without creating files
  --mock             Use mock data (no external calls)

Examples:
  node index.js "https://youtube.com/watch?v=..."
  node index.js "https://podcast.example.com/episode-1" --dry-run
  node index.js "https://spotify.com/episode/..." --mock

Workflow:
  1. Fetch audio from URL
  2. Transcribe audio
  3. Extract insights
  4. Save to Obsidian
`);
}

function log(step, message) {
  console.log(`\n${'➡️'.repeat(step)} ${message}`);
}

function header(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🎧 ${title}`);
  console.log('='.repeat(50));
}

async function main() {
  if (showHelp || args.length === 0) {
    showHelpMessage();
    process.exit(0);
  }

  if (!url) {
    console.error('❌ Error: URL required');
    console.error('Usage: node index.js <url> [--dry-run] [--mock]');
    console.error('\nExamples:');
    console.error('  node index.js "https://youtube.com/watch?v=..."');
    console.error('  node index.js "https://podcast.example.com/episode-1" --dry-run');
    console.error('  node index.js "https://spotify.com/episode/..." --mock');
    process.exit(1);
  }

  header('Podcast → Notes');
  console.log(`URL: ${url}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : mock ? 'MOCK' : 'LIVE'}`);

  if (dryRun) {
    console.log('\n🧪 Dry run - no files will be created');
  }

  try {
    // Step 1: Fetch
    log(1, 'Fetching audio...');
    if (!dryRun) {
      if (mock) {
        console.log('  [MOCK] Simulated audio download');
        fs.mkdirSync(CONFIG.tmpDir, { recursive: true });
        fs.writeFileSync(CONFIG.audioFile, 'mock-audio-data');
      } else {
        const fetchCmd = `node fetch.js "${url}" --output=${CONFIG.audioFile}`;
        execSync(fetchCmd, { cwd: __dirname, stdio: 'inherit' });
      }
    }

    // Step 2: Transcribe & Analyze
    log(2, 'Transcribing & extracting insights...');
    if (!dryRun) {
      if (mock) {
        console.log('  [MOCK] Simulated transcription');
      } else {
        const analyzeCmd = `node analyze.js "${CONFIG.audioFile}" --json > "${CONFIG.analysisFile}"`;
        execSync(analyzeCmd, { cwd: __dirname, stdio: 'inherit' });
      }
    }

    // Step 3: Save
    log(3, 'Saving to Obsidian...');
    if (!dryRun) {
      if (mock) {
        console.log('  [MOCK] Simulated save');
        const mockData = JSON.stringify({
          url,
          transcript: 'Mock transcript...',
          analysis: {
            duration: '~60 min',
            insights: ['Mock insight 1', 'Mock insight 2'],
            topics: ['productivity'],
            summary: 'Mock summary'
          }
        }, null, 2);
        fs.writeFileSync(CONFIG.analysisFile, mockData);
      }
      
      const executeCmd = `node execute.js "${CONFIG.analysisFile}" --destination="${CONFIG.vaultPath}"`;
      execSync(executeCmd, { cwd: __dirname, stdio: 'inherit' });
    }

    // Summary
    console.log('\n' + '✅'.repeat(25));
    console.log('🎉 Podcast → Notes complete!');
    console.log('='.repeat(50));
    
    if (!dryRun) {
      console.log(`📁 Audio: ${CONFIG.audioFile}`);
      console.log(`📊 Analysis: ${CONFIG.analysisFile}`);
      console.log(`📂 Vault: ${CONFIG.vaultPath}`);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
