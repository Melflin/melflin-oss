/**
 * analyze.js - Context Aggregation for Meeting Prep Assistant
 * 
 * Gathers context from emails, notes, and past meetings
 */

const { execSync } = require('child_process');
const path = require('path');

const MAIL_SCRIPTS = path.join(__dirname, '..', '..', 'melflin', 'skills', 'apple-mail', 'scripts');

/**
 * Search Apple Mail for emails matching a query
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Array} List of matching emails
 */
function searchEmails(query, limit = 5) {
    try {
        const scriptPath = path.join(MAIL_SCRIPTS, 'mail-fast-search.sh');
        const output = execSync(
            `"${scriptPath}" "${query}" ${limit}`,
            { encoding: 'utf8' }
        );
        
        if (!output.trim() || output.includes('No results')) {
            return [];
        }
        
        // Parse output: "ID | ReadStatus | Date | Sender | Subject"
        const lines = output.trim().split('\n');
        return lines.map(line => {
            const parts = line.split('|').map(s => s.trim());
            if (parts.length >= 5) {
                return {
                    id: parts[0],
                    read: parts[1] !== '●',
                    date: parts[2],
                    sender: parts[3],
                    subject: parts[4]
                };
            }
            return null;
        }).filter(Boolean);
    } catch (error) {
        console.error('Email search failed:', error.message);
        return [];
    }
}

/**
 * Extract key terms from meeting title for search
 * @param {string} title - Meeting title
 * @returns {string} Search query
 */
function extractSearchTerms(title) {
    if (!title) return '';
    
    // Remove common words, extract key terms
    const stopWords = ['meeting', 'meeting:', 'sync', 'call', 'discussion', 'review', 'standup', 'update', 'weekly', 'daily', '1:1', '1:1:', 'the'];
    const terms = title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 2 && !stopWords.includes(t));
    
    // Return first 2-3 most relevant terms
    return terms.slice(0, 3).join(' ');
}

/**
 * Analyze context for a meeting
 * @param {Object} meeting - Meeting object
 * @returns {Object} Aggregated context
 */
async function analyzeContext(meeting) {
    const context = {
        emails: [],
        notes: [],
        pastMeetings: [],
        attendees: meeting.attendees || [],
        searchQuery: null
    };
    
    // Extract search terms from meeting title
    const searchQuery = extractSearchTerms(meeting.title);
    context.searchQuery = searchQuery;
    
    // Search for related emails if we have a good query
    if (searchQuery.length > 2) {
        console.log(`   🔍 Searching emails for: "${searchQuery}"`);
        context.emails = searchEmails(searchQuery, 5);
    }
    
    // TODO: Obsidian notes integration
    // Would search Obsidian vault for meeting-related notes
    // context.notes = await searchObsidianNotes(searchQuery);
    
    // TODO: Past meetings integration
    // Would look at calendar events from the same series/recurrence
    // context.pastMeetings = await getPastMeetings(meeting);
    
    return context;
}

module.exports = { analyzeContext, searchEmails, extractSearchTerms };
