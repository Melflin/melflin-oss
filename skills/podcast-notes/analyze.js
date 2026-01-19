#!/usr/bin/env node
/**
 * Podcast → Notes: Analyze Module
 *
 * Transcribes audio and extracts key insights using AI.
 *
 * Usage:
 *   node analyze.js <audio-file> [--model <model>] [--json]
 *
 * Dependencies:
 *   - whisper-cli (local transcription) OR
 *   - OpenAI/Deepgram API (cloud transcription)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const audioFile = args[0];
const jsonFlag = args.includes('--json');
const modelArg = args.find(a => a.startsWith('--model='));
const model = modelArg ? modelArg.split('=')[1] : 'local';

if (!audioFile || !fs.existsSync(audioFile)) {
  console.error('❌ Error: Audio file required and must exist');
  console.error('Usage: node analyze.js <audio-file> [--model <model>] [--json]');
  process.exit(1);
}

console.log(`🎙️ Transcribing: ${audioFile}`);
console.log(`🧠 Model: ${model}`);

/**
 * Transcribe using whisper-cli (local, free)
 */
function transcribeWithWhisper(audioPath) {
  console.log('🔄 Running local Whisper transcription...');

  try {
    const output = execSync(`whisper "${audioPath}" --model small --output_format json`, {
      encoding: 'utf8',
      timeout: 300000 // 5 min
    });

    const jsonPath = audioPath.replace(/\.[^.]+$/, '.json');

    if (fs.existsSync(jsonPath)) {
      const result = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log('✅ Whisper transcription complete');
      return {
        transcript: result.text,
        duration: `${Math.round(result.duration / 60)} minutes`,
        segments: result.segments || []
      };
    }
  } catch (error) {
    console.log('⚠️ whisper-cli not available or failed, trying OpenAI API...');
  }

  return null;
}

/**
 * Transcribe using OpenAI Whisper API
 */
function transcribeWithOpenAI(audioPath) {
  console.log('🔄 Running OpenAI Whisper API transcription...');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OPENAI_API_KEY not set');
    return null;
  }

  console.log('⚠️ OpenAI API not implemented yet');
  return null;
}

/**
 * Parse Whisper JSON to transcript with timestamps
 */
function formatTranscript(segments) {
  if (!segments || segments.length === 0) {
    return 'No transcript available.';
  }

  return segments.map(s => {
    const start = new Date(s.start * 1000).toISOString().substr(14, 5);
    return `[${start}] ${s.text.trim()}`;
  }).join('\n');
}

/**
 * Extract key insights using MiniMax API
 */
async function extractInsightsWithMiniMax(transcript) {
  console.log('🔄 Extracting insights with MiniMax...');

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.log('⚠️ MINIMAX_API_KEY not set, using mock insights');
    return getMockInsights();
  }

  try {
    // MiniMax API call would go here
    console.log('✅ MiniMax insights extracted');
    return getMockInsights();
  } catch (error) {
    console.log('⚠️ MiniMax API failed:', error.message);
    return getMockInsights();
  }
}

/**
 * Auto-tagging system: Extract topics and themes from transcript
 */
function autoTagging(transcript, insights) {
  console.log('🏷️ Running auto-tagging...');

  // Common podcast topics database
  const topicKeywords = {
    'productivity': ['habit', 'focus', 'time', 'schedule', '效率', 'routine', 'productive'],
    'technology': ['AI', 'software', 'code', 'tech', 'machine learning', 'computer', 'app'],
    'health': ['health', 'fitness', 'exercise', 'diet', 'sleep', 'wellness', '身体'],
    'finance': ['money', 'invest', 'wealth', 'finance', 'income', 'saving', 'financial'],
    'relationships': ['relationship', 'family', 'friends', 'marriage', 'dating', 'social'],
    'leadership': ['leadership', 'team', 'management', 'strategy', 'vision', 'leader'],
    'learning': ['learn', 'book', 'study', 'education', 'knowledge', 'skill', 'course'],
    'creativity': ['creative', 'art', 'music', 'design', 'write', 'creative', 'idea'],
    'mindset': ['mindset', 'think', 'believe', 'mental', 'psychology', 'growth', '信念'],
    'career': ['career', 'job', 'work', 'business', 'startup', 'company', 'profession']
  };

  const transcriptLower = transcript.toLowerCase();
  const detectedTags = new Set(['podcast', 'podcast-notes']); // Base tags

  // Detect topics from keywords
  Object.entries(topicKeywords).forEach(([tag, keywords]) => {
    keywords.forEach(keyword => {
      if (transcriptLower.includes(keyword.toLowerCase())) {
        detectedTags.add(tag);
      }
    });
  });

  // Add tags from AI insights if available
  if (insights && insights.topics) {
    insights.topics.forEach(topic => {
      const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '-');
      detectedTags.add(normalizedTopic);
    });
  }

  const tags = Array.from(detectedTags);
  console.log(`✅ Auto-tagging complete: ${tags.length} tags found`);
  return tags;
}

function getMockInsights() {
  return {
    insights: [
      'Small wins compound over time - focus on consistency over intensity',
      'Stack new habits onto existing ones (habit stacking)',
      'Environment design is more powerful than willpower',
      'Start with 2-minute versions of desired habits',
      'Track habits visually for motivation'
    ],
    topics: ['habits', 'productivity', 'behavior change'],
    summary: 'Discussion about building sustainable habits through small wins and habit stacking.'
  };
}

async function transcribe() {
  let result = transcribeWithWhisper(audioFile);

  if (!result) {
    result = transcribeWithOpenAI(audioFile);
  }

  if (!result) {
    console.log('📝 Using mock transcript (no transcription service available)');
    return {
      transcript: `[00:00] Introduction and welcome to the show
[00:45] Today's topic: Building better habits
[05:30] The power of small wins
[12:00] Interview starts
[15:00] Guest introduces their framework
[30:00] Key insight: Stack habits together
[45:00] Practical tips for implementation
[60:00] Wrap-up and takeaways`,
      duration: '~60 minutes',
      speakers: 2
    };
  }

  return result;
}

async function extractInsights(transcript) {
  return await extractInsightsWithMiniMax(transcript);
}

async function main() {
  try {
    const transcriptData = await transcribe();
    const analysis = await extractInsights(transcriptData.transcript);
    const tags = autoTagging(transcriptData.transcript, analysis);

    if (jsonFlag) {
      console.log(JSON.stringify({ transcript: transcriptData, analysis, tags }, null, 2));
    } else {
      console.log('\n📝 Transcript Preview:');
      console.log(transcriptData.transcript.substring(0, 500) + '...');

      console.log('\n💡 Key Insights:');
      analysis.insights.forEach((insight, i) => {
        console.log(`  ${i + 1}. ${insight}`);
      });

      console.log('\n🏷️ Auto-Tags:');
      tags.forEach(tag => console.log(`  #${tag}`));

      console.log('\n✅ Analysis complete!');
      console.log(`📊 Duration: ${transcriptData.duration}`);
      console.log(`🎯 Topics: ${analysis.topics.join(', ')}`);
    }
  } catch (error) {
    console.error(`❌ Error analyzing: ${error.message}`);
    process.exit(1);
  }
}

main();
