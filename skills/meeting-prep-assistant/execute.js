/**
 * execute.js - Briefing Generation for Meeting Prep Assistant
 * 
 * Generates AI-powered meeting briefings
 */

function generateBriefing(meeting, context, format = 'brief') {
    const lines = [];
    
    lines.push(`## 📅 ${meeting.title || 'Untitled Meeting'}`);
    lines.push('');
    lines.push(`**Time:** ${meeting.start || 'TBD'}`);
    lines.push(`**Location:** ${meeting.location || 'TBD'}`);
    lines.push('');
    
    if (context.attendees.length > 0) {
        lines.push(`**Attendees:** ${context.attendees.join(', ')}`);
        lines.push('');
    }
    
    lines.push('### 📝 Context');
    if (context.emails.length === 0) {
        lines.push('_No related emails found_');
    } else {
        context.emails.forEach(e => lines.push(`- ${e.subject}`));
    }
    lines.push('');
    
    lines.push('### 💡 Briefing');
    lines.push('_AI-generated summary will appear here_');
    lines.push('');
    
    if (format === 'json') {
        return JSON.stringify({ meeting, context }, null, 2);
    }
    
    return lines.join('\n');
}

module.exports = { generateBriefing };
