#!/usr/bin/env node
/**
 * Meeting Prep Assistant - Calendar Fetcher
 * 
 * Fetches upcoming meetings from Apple Calendar via accli.
 * 
 * Usage: node fetch.js [--from=YYYY-MM-DD] [--to=YYYY-MM-DD] [--calendar=Name] [--json]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_CALENDAR = 'Arbeit';  // Stefan's work calendar
const DEFAULT_FROM = new Date().toISOString().split('T')[0];
const DEFAULT_TO = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Tomorrow
const OUTPUT_FILE = path.join(__dirname, 'meetings.json');

/**
 * List available calendars
 */
function listCalendars() {
  try {
    const output = execSync('accli calendars --json', {
      encoding: 'utf8',
      timeout: 15000
    });
    return JSON.parse(output);
  } catch (error) {
    console.log(`⚠️  Failed to list calendars: ${error.message}`);
    return { calendars: [] };
  }
}

/**
 * Fetch events from a calendar
 */
function fetchEvents(calendarName, from, to) {
  try {
    const output = execSync(`accli events "${calendarName}" --from ${from} --to ${to} --json`, {
      encoding: 'utf8',
      timeout: 30000
    });
    return JSON.parse(output);
  } catch (error) {
    console.log(`⚠️  Failed to fetch events: ${error.message}`);
    return { events: [], count: 0 };
  }
}

/**
 * Format meeting for output
 */
function formatMeeting(event) {
  return {
    id: event.id,
    uid: event.uid,
    title: event.summary,
    location: event.location,
    description: event.description,
    allDay: event.allDay,
    start: event.start,
    end: event.end,
    startISO: event.startISO,
    endISO: event.endISO,
    isRecurring: event.isRecurring,
    calendar: event.calendar
  };
}

/**
 * Main fetch function
 */
function fetchMeetings(options = {}) {
  const { 
    calendar = DEFAULT_CALENDAR,
    from = DEFAULT_FROM,
    to = DEFAULT_TO,
    json = false,
    quiet = false,
    listCalendars: listCals = false,
    output = null
  } = options;
  
  if (!quiet) {
    console.log('📅 Meeting Prep Assistant - Calendar Fetcher');
    console.log('━'.repeat(45));
  }
  
  // List calendars if requested
  if (listCals) {
    console.log('📋 Available Calendars:');
    const result = listCalendars();
    result.calendars.forEach((cal, i) => {
      const writable = cal.writable ? '✓' : '○';
      console.log(`   ${i + 1}. ${cal.name} ${writable}`);
    });
    return result;
  }
  
  if (!quiet) {
    console.log(`📥 Fetching meetings from "${calendar}"`);
    console.log(`   From: ${from}`);
    console.log(`   To: ${to}`);
    console.log('');
  }
  
  // Fetch events
  const result = fetchEvents(calendar, from, to);
  const meetings = (result.events || []).map(formatMeeting);
  
  // Summary
  if (!quiet) {
    console.log(`📊 Found ${result.count} meetings`);
    
    if (meetings.length === 0) {
      console.log('   No upcoming meetings in this timeframe');
    } else {
      meetings.forEach((m, i) => {
        const time = m.allDay 
          ? 'All day' 
          : `${m.start.substring(11, 16)} - ${m.end.substring(11, 16)}`;
        console.log(`   ${i + 1}. ${m.title} (${time})`);
      });
    }
  }
  
  // Filter to only upcoming (within 24h) for "today/tomorrow" view
  const now = new Date();
  const upcomingMeetings = meetings.filter(m => {
    const meetingTime = new Date(m.startISO);
    const hoursUntil = (meetingTime - now) / (1000 * 60 * 60);
    return hoursUntil > 0 && hoursUntil < 24;
  });
  
  const outputData = {
    calendar,
    from,
    to,
    totalMeetings: meetings.length,
    upcomingWithin24h: upcomingMeetings.length,
    meetings: meetings,
    upcoming: upcomingMeetings,
    fetchedAt: new Date().toISOString()
  };
  
  // Save to file
  const savePath = output || OUTPUT_FILE;
  fs.writeFileSync(savePath, JSON.stringify(outputData, null, 2));
  if (!quiet) {
    console.log('');
    console.log(`💾 Saved to: ${savePath}`);
  }
  
  return outputData;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    calendar: args.find(a => a.startsWith('--calendar='))?.split('=')[1] || DEFAULT_CALENDAR,
    from: args.find(a => a.startsWith('--from='))?.split('=')[1] || DEFAULT_FROM,
    to: args.find(a => a.startsWith('--to='))?.split('=')[1] || DEFAULT_TO,
    json: args.includes('--json'),
    listCalendars: args.includes('--list-calendars'),
    quiet: args.includes('--quiet'),
    output: args.find(a => a.startsWith('--output='))?.split('=')[1] || null
  };
  
  const result = fetchMeetings(options);
  
  if (options.json || options.quiet) {
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = { fetchMeetings, listCalendars, fetchEvents };
