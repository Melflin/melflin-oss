#!/usr/bin/env node
/**
 * Meeting Prep Assistant - Context Aggregator
 * 
 * Gathers context for upcoming meetings:
 * - Email search (when available)
 * - Past meeting notes
 * - Action items
 * 
 * Usage: node aggregate.js [--meetings=meetings.json] [--json]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_MEETINGS = path.join(__dirname, 'meetings.json');
const OBSIDIAN_PATH = process.env.OBSIDIAN_PATH || null; // Optional: path to Obsidian vault

// Mock data for testing/development
const MOCK_CONTEXT = {
  emails: [
    {
      from: "Sandra",
      subject: "Q1 Planning - Budget Questions",
      date: "2026-01-15",
      snippet: "I reviewed the budget proposal and have a few questions...",
      relevance: 0.9
    },
    {
      from: "Team",
      subject: "Weekly Standup Agenda",
      date: "2026-01-17",
      snippet: "Agenda for tomorrow's standup: 1) Project status, 2) Blockers...",
      relevance: 0.8
    }
  ],
  pastMeetings: [
    {
      title: "Weekly Team Sync",
      date: "2026-01-15",
      notes: "Completed Q4 review, started planning for Q1. Stefan to send budget proposal.",
      actionItems: [
        { task: "Send budget proposal", owner: "Stefan", status: "pending" },
        { task: "Review timeline", owner: "Sandra", status: "pending" }
      ]
    }
  ],
  projectNotes: [
    {
      title: "Q1 Project Overview",
      path: "/Projects/Q1-Planning.md",
      content: "Main objectives for Q1: 1) Complete migration, 2) Launch new feature..."
    }
  ]
};

/**
 * Search emails for meeting-related content
 * Returns mock data when real integration unavailable
 */
function searchEmails(keywords, options = {}) {
  const { mock = true, limit = 5 } = options;
  
  if (mock) {
    // Filter mock emails by keywords
    const relevantEmails = MOCK_CONTEXT.emails.filter(email => {
      const searchText = `${email.subject} ${email.snippet}`.toLowerCase();
      return keywords.some(k => searchText.includes(k.toLowerCase()));
    });
    return relevantEmails.slice(0, limit);
  }
  
  // TODO: Real email integration when m365 CLI or Apple Mail access available
  return [];
}

/**
 * Find past meeting notes
 */
function findPastMeetingNotes(meetingTitle, options = {}) {
  const { mock = true } = options;
  
  if (mock) {
    // Return mock past meeting
    return MOCK_CONTEXT.pastMeetings.filter(pm => {
      return pm.title.toLowerCase().includes(meetingTitle.toLowerCase().split(' ')[0]);
    });
  }
  
  // TODO: Real integration with calendar notes or Obsidian
  return [];
}

/**
 * Extract action items from past meetings
 */
function extractActionItems(pastMeetings, options = {}) {
  const { mock = true } = options;
  
  if (mock) {
    const allItems = [];
    pastMeetings.forEach(pm => {
      if (pm.actionItems) {
        pm.actionItems.forEach(item => {
          allItems.push({
            ...item,
            fromMeeting: pm.title,
            fromDate: pm.date
          });
        });
      }
    });
    return allItems;
  }
  
  return [];
}

/**
 * Find related project notes from Obsidian
 */
function findProjectNotes(keywords, options = {}) {
  const { mock = true, limit = 3 } = options;
  
  if (mock) {
    return MOCK_CONTEXT.projectNotes.slice(0, limit);
  }
  
  // TODO: Real Obsidian integration
  if (OBSIDIAN_PATH && fs.existsSync(OBSIDIAN_PATH)) {
    return [];
  }
  
  return [];
}

/**
 * Main aggregation function
 */
function aggregateContext(meetingsPath, options = {}) {
  const { 
    mock = true,
    json = false,
    verbose = !json  // Auto-disable verbose when json is true
  } = options;
  
  if (!json) {
    console.log('🔍 Meeting Prep Assistant - Context Aggregator');
    console.log('━'.repeat(48));
  }
  
  // Load meetings
  let meetings = [];
  try {
    const data = JSON.parse(fs.readFileSync(meetingsPath, 'utf8'));
    meetings = data.meetings || data.upcoming || [];
    if (!json) console.log(`📥 Loaded ${meetings.length} meetings from ${meetingsPath}`);
  } catch (error) {
    if (!json) console.log(`⚠️  Failed to load meetings: ${error.message}`);
    return { error: 'NO_MEETINGS' };
  }
  
  if (meetings.length === 0) {
    if (!json) console.log('⚠️  No meetings found');
    return { error: 'NO_MEETINGS' };
  }
  
  // Process each meeting
  const context = {
    aggregatedAt: new Date().toISOString(),
    meetings: []
  };
  
  for (const meeting of meetings) {
    if (verbose) {
      console.log('');
      console.log(`📅 Processing: ${meeting.title}`);
    }
    
    // Extract keywords from meeting title
    const keywords = meeting.title
      .split(' ')
      .filter(w => w.length > 3 && !['the', 'and', 'from', 'with'].includes(w.toLowerCase()));
    
    // Gather context
    const emails = searchEmails(keywords, { mock, limit: 3 });
    const pastMeetings = findPastMeetingNotes(meeting.title, { mock });
    const actionItems = extractActionItems(pastMeetings, { mock });
    const projectNotes = findProjectNotes(keywords, { mock, limit: 2 });
    
    const meetingContext = {
      id: meeting.id,
      title: meeting.title,
      time: meeting.start,
      keywords,
      context: {
        emails,
        pastMeetings,
        actionItems,
        projectNotes
      },
      relevance: {
        emails: emails.length,
        pastMeetings: pastMeetings.length,
        actionItems: actionItems.length,
        projectNotes: projectNotes.length
      }
    };
    
    context.meetings.push(meetingContext);
    
    if (verbose) {
      console.log(`   📧 Emails: ${emails.length}`);
      console.log(`   📋 Past meetings: ${pastMeetings.length}`);
      console.log(`   ✅ Action items: ${actionItems.length}`);
      console.log(`   📁 Project notes: ${projectNotes.length}`);
    }
  }
  
  // Summary
  if (!json) {
    const totalEmails = context.meetings.reduce((sum, m) => sum + m.context.emails.length, 0);
    const totalActions = context.meetings.reduce((sum, m) => sum + m.context.actionItems.length, 0);
    
    console.log('');
    console.log('📊 Context Summary:');
    console.log(`   Total meetings processed: ${context.meetings.length}`);
    console.log(`   Total related emails: ${totalEmails}`);
    console.log(`   Total action items: ${totalActions}`);
  }
  
  return context;
}

/**
 * Generate AI prompt for briefing
 */
function generateBriefingPrompt(context) {
  const prompt = `You are a meeting briefing assistant. Generate a concise briefing for the following meetings based on the gathered context.

MEETINGS AND CONTEXT:
${JSON.stringify(context, null, 2)}

Generate a briefing for each meeting in this format:
---
## Meeting: [Title]
**Time:** [Start time]
**Attendees:** [Extracted from context if available]

### 📝 Agenda
- [Key discussion points]

### 📚 Background
- [Relevant context from emails, past meetings, notes]

### ✅ Open Action Items
- [Any pending action items relevant to this meeting]

### 💡 Suggested Talking Points
- [2-3 things to mention or ask about]
---

Keep briefings concise and actionable. Focus on what's relevant for preparation.`;
  
  return prompt;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    meetings: args.find(a => a.startsWith('--meetings='))?.split('=')[1] || DEFAULT_MEETINGS,
    json: args.includes('--json'),
    mock: !args.includes('--no-mock'),
    verbose: !args.includes('--quiet')
  };
  
  const result = aggregateContext(options.meetings, options);
  
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  }
  
  // Also output AI prompt if requested
  if (args.includes('--prompt')) {
    console.log('');
    console.log('='.repeat(50));
    console.log('AI PROMPT:');
    console.log('='.repeat(50));
    console.log(generateBriefingPrompt(result));
  }
}

module.exports = { 
  aggregateContext, 
  searchEmails, 
  findPastMeetingNotes, 
  extractActionItems,
  findProjectNotes,
  generateBriefingPrompt 
};
