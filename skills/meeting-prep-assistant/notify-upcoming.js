#!/usr/bin/env node
/**
 * notify-upcoming.js - Proactive Meeting Notifications
 * 
 * Run via cron every 30 minutes to notify about meetings in 2h
 * Usage: node notify-upcoming.js [--hours=2] [--channel=telegram]
 */

const { fetchMeetings } = require('./fetch');
const { analyzeContext } = require('./analyze');
const { generateBriefing } = require('./execute');
const path = require('path');

// CLI Arguments
const args = process.argv.slice(2);
const hoursArg = args.find(a => a.startsWith('--hours=')) || '--hours=2';
const hours = parseInt(hoursArg.split('=')[1]);

const channelArg = args.find(a => a.startsWith('--channel='));
const channel = channelArg ? channelArg.split('=')[1] : 'telegram';

// Path to CLAWDBOT for sending messages
const CLAWDBOT_CLI = '/Users/melf/GitRepo/clawdbot/clawdbot';

async function notifyUpcomingMeetings() {
    console.log(`🔔 Checking for meetings in the next ${hours} hours...\n`);
    
    const meetings = fetchMeetings(hours);
    
    if (meetings.length === 0) {
        console.log('No upcoming meetings.');
        return [];
    }
    
    const notifications = [];
    
    for (const meeting of meetings) {
        console.log(`📌 Processing: ${meeting.title}`);
        
        const context = await analyzeContext(meeting);
        const briefing = await generateBriefing(meeting, context, 'brief');
        
        // Format for messaging
        const message = `📅 *${meeting.title}*\n` +
            `🕐 ${meeting.start}\n` +
            `📍 ${meeting.location || 'TBD'}\n\n` +
            briefing.split('\n').slice(3).join('\n'); // Skip header
        
        // Send notification via Clawdbot
        const notifyCmd = `"${CLAWDBOT_CLI}" message send --channel=${channel} --message="${message.replace(/"/g, '\\"')}"`;
        
        try {
            const { execSync } = require('child_process');
            // In real usage, uncomment:
            // execSync(notifyCmd, { encoding: 'utf8' });
            console.log(`   ✅ Would send to ${channel}: ${meeting.title}`);
        } catch (e) {
            console.log(`   ⚠️  Failed to send: ${e.message}`);
        }
        
        notifications.push({
            meeting: meeting.title,
            time: meeting.start,
            channel,
            status: 'pending'
        });
    }
    
    return notifications;
}

// Self-test
if (require.main === module) {
    notifyUpcomingMeetings()
        .then(results => {
            console.log(`\n📊 ${results.length} notification(s) queued`);
            process.exit(0);
        })
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = { notifyUpcomingMeetings };
