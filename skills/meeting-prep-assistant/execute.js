/**
 * execute.js - Briefing Generation for Meeting Prep Assistant
 * 
 * Generates AI-powered meeting briefings
 */

/**
 * Generate a structured briefing for a meeting
 * @param {Object} meeting - Meeting object
 * @param {Object} context - Aggregated context
 * @param {string} format - Output format (brief|detailed|json)
 * @returns {string} Formatted briefing
 */
function generateBriefing(meeting, context, format = 'brief') {
    if (format === 'json') {
        return JSON.stringify({ meeting, context }, null, 2);
    }
    
    const lines = [];
    
    // Header
    lines.push(`## 📅 ${meeting.title || 'Untitled Meeting'}`);
    lines.push('');
    
    // Basics
    lines.push(`**🕐 ${meeting.start || 'Time TBD'}**`);
    if (meeting.location && meeting.location !== 'TBD') {
        lines.push(`**📍 ${meeting.location}**`);
    }
    lines.push('');
    
    // Attendees
    if (context.attendees.length > 0) {
        lines.push(`**👥 Teilnehmer:** ${context.attendees.join(', ')}`);
        lines.push('');
    }
    
    // Email Context
    lines.push('### 📧 Zugehörige Emails');
    if (context.emails.length === 0) {
        lines.push('_Keine relevanten Emails gefunden_');
    } else {
        context.emails.forEach(email => {
            const readStatus = email.read ? '✓' : '●';
            lines.push(`- ${readStatus} **${email.date}** - ${email.sender}: ${email.subject}`);
        });
    }
    lines.push('');
    
    // Quick Prep Points
    lines.push('### 🎯 Prep-Punkte');
    lines.push('- [ ] Meeting-Ziel klären');
    lines.push('- [ ] Agenda-Punkte vorbereiten');
    if (context.emails.length > 0) {
        lines.push(`- [ ] ${context.emails[0].subject} ansprechen`);
    }
    if (context.searchQuery) {
        lines.push(`- [ ] Context: "${context.searchQuery}"`);
    }
    lines.push('');
    
    // Notes Section
    lines.push('### 📝 Notizen');
    lines.push('_Hier können deine Notizen während dem Meeting rein_');
    lines.push('');
    
    return lines.join('\n');
}

module.exports = { generateBriefing };
