/**
 * fetch.js - Calendar Integration for Meeting Prep Assistant
 * 
 * Fetches upcoming meetings from Apple Calendar using accli
 */

const { execSync } = require('child_process');

/**
 * Fetch meetings for the next N hours
 * @param {number} hours - Look ahead period
 * @returns {Array} List of meetings
 */
function fetchMeetings(hours = 24) {
    try {
        const from = new Date().toISOString().split('T')[0];
        const to = new Date(Date.now() + hours * 60 * 60 * 1000)
            .toISOString().split('T')[0];
        
        const output = execSync(
            `accli events "Kalender" --from ${from} --to ${to} --json`,
            { encoding: 'utf8' }
        );
        
        return JSON.parse(output);
    } catch (error) {
        console.error('Failed to fetch meetings:', error.message);
        return [];
    }
}

/**
 * Get meeting by ID
 * @param {string} meetingId 
 * @returns {Object|null}
 */
function getMeetingById(meetingId) {
    // Placeholder: accli doesn't support ID-based lookup
    // Will implement when needed
    return null;
}

module.exports = { fetchMeetings, getMeetingById };
