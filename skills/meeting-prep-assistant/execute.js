/**
 * execute.js - Briefing Generation for Meeting Prep Assistant
 * 
 * Generates AI-powered meeting briefings
 * Uses MiniMax API for intelligent summaries
 */

const https = require('https');
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, 'templates');

/**
 * Generate AI-powered summary using MiniMax API
 * @param {Object} meeting - Meeting object
 * @param {Object} context - Aggregated context
 * @returns {string|null} AI-generated summary or null on error
 */
async function generateAISummary(meeting, context) {
    const apiKey = process.env.MINIMAX_API_KEY;
    
    if (!apiKey) {
        console.log('   ⚠️  No MINIMAX_API_KEY - using template fallback');
        return null;
    }
    
    const prompt = `Du bist ein Assistent, der Meeting-Vorbereitungen erstellt.
    
**Meeting:** ${meeting.title || 'Untitled'}
**Zeit:** ${meeting.start || 'TBD'}
**Ort:** ${meeting.location || 'TBD'}
**Teilnehmer:** ${context.attendees?.join(', ') || 'N/A'}

**Zugehörige Emails:**
${context.emails?.length > 0 
    ? context.emails.map(e => `- ${e.date} | ${e.sender}: ${e.subject}`).join('\n')
    : '- Keine relevanten Emails gefunden'}

Erstelle eine kurze, hilfreiche Zusammenfassung mit:
1. Meeting-Ziel (was soll erreicht werden?)
2. 3 konkrete Prep-Punkte (basierend auf dem Meeting-Titel und den Emails)
3. Gesprächsthemen die angesprochen werden sollten

Antworte auf Deutsch, maximal 150 Wörter, strukturiert als Liste.`;

    return new Promise((resolve) => {
        const data = JSON.stringify({
            model: 'minimax/MiniMax-M2.1',
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const options = {
            hostname: 'api.minimax.chat',
            path: '/v1/text/chatcompletion_v2',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 15000
        };

        const req = https.request(options, (res) => {
            let chunks = '';
            res.on('data', d => chunks += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(chunks);
                    if (parsed.choices?.[0]?.message?.content) {
                        resolve(parsed.choices[0].message.content);
                    } else {
                        console.log('   ⚠️  AI API returned unexpected response format');
                        resolve(null);
                    }
                } catch (e) {
                    console.log('   ⚠️  Failed to parse AI response');
                    resolve(null);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ⚠️  AI API request failed: ${error.message}`);
            resolve(null);
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log('   ⚠️  AI API request timed out');
            resolve(null);
        });

        req.write(data);
        req.end();
    });
}

/**
 * Generate template fallback summary
 * @param {Object} meeting - Meeting object
 * @param {Object} context - Aggregated context
 * @returns {string} Template-based summary
 */
function generateTemplateFallback(meeting, context) {
    const lines = [];
    
    lines.push(`**🎯 Meeting-Ziel:**`);
    lines.push('- Kläre das Hauptziel des Meetings');
    lines.push('');
    
    lines.push(`**📋 Vorbereitungs-Punkte:**`);
    lines.push(`- [ ] Agenda-Punkte durchgehen`);
    if (context.emails && context.emails.length > 0) {
        lines.push(`- [ ] ${context.emails[0].subject} vorbereiten`);
    }
    if (meeting.location && meeting.location !== 'TBD') {
        lines.push(`- [ ] Location/Link prüfen: ${meeting.location}`);
    }
    lines.push('');
    
    lines.push(`**💡 Kontext:**`);
    if (context.searchQuery) {
        lines.push(`- Zugehöriges Thema: "${context.searchQuery}"`);
    }
    if (context.emails && context.emails.length > 0) {
        lines.push(`- ${context.emails.length} zugehörige Email(s) gefunden`);
    }
    
    return lines.join('\n');
}

/**
 * Generate a structured briefing for a meeting
 * @param {Object} meeting - Meeting object
 * @param {Object} context - Aggregated context
 * @param {string} format - Output format (brief|detailed|json)
 * @returns {string} Formatted briefing
 */
async function generateBriefing(meeting, context, format = 'brief') {
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
    if (context.attendees && context.attendees.length > 0) {
        lines.push(`**👥 Teilnehmer:** ${context.attendees.join(', ')}`);
        lines.push('');
    }
    
    // AI Summary (if available)
    if (process.env.USE_AI !== 'false') {
        lines.push('### 🤖 AI Zusammenfassung');
        try {
            const aiSummary = await generateAISummary(meeting, context);
            if (aiSummary) {
                lines.push(aiSummary);
            } else {
                lines.push(generateTemplateFallback(meeting, context));
            }
        } catch (error) {
            console.log(`   ⚠️  Error in AI generation: ${error.message}`);
            lines.push(generateTemplateFallback(meeting, context));
        }
        lines.push('');
    } else {
        lines.push('### 📋 Vorbereitung');
        lines.push(generateTemplateFallback(meeting, context));
        lines.push('');
    }
    
    // Email Context
    lines.push('### 📧 Zugehörige Emails');
    if (!context.emails || context.emails.length === 0) {
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
    if (context.emails && context.emails.length > 0 && context.emails[0].subject) {
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

module.exports = { generateBriefing, generateAISummary };
