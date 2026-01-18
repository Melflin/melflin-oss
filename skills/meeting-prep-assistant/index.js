/**
 * index.js - Meeting Prep Assistant CLI
 * 
 * Auto-generated briefing for upcoming meetings
 */

const { fetchMeetings } = require('./fetch');
const { analyzeContext } = require('./analyze');
const { generateBriefing } = require('./execute');

// CLI Arguments
const args = process.argv.slice(2);
const hoursArg = args.find(a => a.startsWith('--hours='));
const hours = hoursArg ? parseInt(hoursArg.split('=')[1]) : 24;

const formatArg = args.find(a => a.startsWith('--format='));
const format = formatArg ? formatArg.split('=')[1] : 'brief';

async function main() {
    console.log('📅 Meeting Prep Assistant');
    console.log('=========================\n');
    
    // Fetch upcoming meetings
    const meetings = fetchMeetings(hours);
    
    if (meetings.length === 0) {
        console.log('No upcoming meetings found.');
        return;
    }
    
    console.log(`Found ${meetings.length} meeting(s) in the next ${hours}h:\n`);
    
    // Process each meeting
    for (const meeting of meetings) {
        console.log(`📌 ${meeting.title || 'Untitled'}`);
        console.log(`   Time: ${meeting.start || 'TBD'}`);
        console.log(`   Location: ${meeting.location || 'TBD'}`);
        console.log('');
        
        // Analyze context (placeholder)
        const context = await analyzeContext(meeting);
        
        // Generate briefing
        const briefing = generateBriefing(meeting, context, format);
        console.log(briefing);
        console.log('\n---\n');
    }
}

main().catch(console.error);
