#!/usr/bin/env node
/**
 * Podcast → Notes: Fetch Module
 * 
 * Downloads audio from podcast/YouTube URL and prepares for transcription.
 * 
 * Usage:
 *   node fetch.js <url> [--output <path>]
 * 
 * Dependencies:
 *   - yt-dlp (YouTube/podcast downloader)
 *   - ffmpeg (audio processing)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const url = args[0];
const outputArg = args.find(a => a.startsWith('--output='));
const outputPath = outputArg ? outputArg.split('=')[1] : '/tmp/podcast-audio.mp3';

if (!url) {
  console.error('❌ Error: URL required');
  console.error('Usage: node fetch.js <url> [--output=<path>]');
  process.exit(1);
}

console.log(`📥 Fetching audio from: ${url}`);
console.log(`📁 Output: ${outputPath}`);

try {
  // Using yt-dlp for extraction
  const cmd = `yt-dlp -f bestaudio -o "${outputPath}" --extract-audio --audio-format mp3 "${url}"`;
  console.log(`🔧 Running: ${cmd}`);
  
  execSync(cmd, { stdio: 'inherit' });
  
  if (fs.existsSync(outputPath)) {
    console.log('✅ Audio downloaded successfully');
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
  } else {
    throw new Error('Output file not created');
  }
} catch (error) {
  console.error(`❌ Error fetching audio: ${error.message}`);
  process.exit(1);
}
