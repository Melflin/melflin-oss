#!/usr/bin/env node

/**
 * Activity Suggestor for Kids
 * Suggests age-appropriate activities based on weather, interests, and available time.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { getCurrentWeather, isGoodForOutdoors, getRecommendation } = require('./weather');

// Load activities database
const activities = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'activities.json'), 'utf8')
);

/**
 * Filter activities based on criteria
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered activities
 */
function filterActivities(criteria = {}) {
  let results = [...activities];
  
  // Filter by age
  if (criteria.age) {
    results = results.filter(a => 
      criteria.age >= a.age_min && criteria.age <= a.age_max
    );
  }
  
  // Filter by weather preference
  if (criteria.outdoor !== undefined) {
    if (criteria.outdoor) {
      results = results.filter(a => a.location === 'outdoor' && a.weather === 'good');
    } else {
      results = results.filter(a => a.location === 'indoor');
    }
  }
  
  // Filter by category
  if (criteria.category) {
    results = results.filter(a => a.category === criteria.category);
  }
  
  // Filter by duration
  if (criteria.maxDuration) {
    results = results.filter(a => a.duration_max <= criteria.maxDuration);
  }
  
  // Filter by cost
  if (criteria.maxCost !== undefined) {
    results = results.filter(a => a.cost <= criteria.maxCost);
  }
  
  // Filter by energy level
  if (criteria.energyLevel) {
    results = results.filter(a => a.energy_level === criteria.energyLevel);
  }
  
  // Filter by tags (search)
  if (criteria.search) {
    const searchLower = criteria.search.toLowerCase();
    results = results.filter(a => 
      a.tags.some(t => t.toLowerCase().includes(searchLower)) ||
      a.name.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
}

/**
 * Get a random activity from filtered results
 * @param {Array} activities - List of activities
 * @returns {Object|null} Random activity or null if empty
 */
function getRandomActivity(activities) {
  if (activities.length === 0) return null;
  const index = Math.floor(Math.random() * activities.length);
  return activities[index];
}

/**
 * Format activity for display
 * @param {Object} activity - Activity object
 * @returns {string} Formatted string
 */
function formatActivity(activity) {
  const duration = activity.duration_min === activity.duration_max 
    ? `${activity.duration_min} Min` 
    : `${activity.duration_min}-${activity.duration_max} Min`;
    
  const costText = activity.cost === 0 
    ? 'Kostenlos' 
    : `~${activity.cost} CHF`;
  
  return `
🎯 ${activity.name}
📝 ${activity.description}
⏱️ Dauer: ${duration}
💰 Kosten: ${costText}
📍 ${activity.location === 'indoor' ? '🏠 Drinnen' : '🌳 Draussen'}
🏷️ Tags: ${activity.tags.join(', ')}
  `.trim();
}

/**
 * Get suggestion based on weather
 * @param {number} age - Child's age
 * @returns {Object} Suggestion result
 */
async function getSuggestionForToday(age = 7) {
  try {
    const weather = await getCurrentWeather();
    const outdoorPossible = isGoodForOutdoors(weather.current_weather || { 
      temperature: weather.temperature, 
      weathercode: weather.weathercode 
    });
    
    const activities = filterActivities({
      age: age,
      outdoor: outdoorPossible
    });
    
    const suggestion = getRandomActivity(activities);
    
    return {
      weather: weather,
      outdoorPossible: outdoorPossible,
      activity: suggestion,
      allSuitable: activities
    };
  } catch (error) {
    // Fallback if weather API fails
    return {
      error: error.message,
      activity: getRandomActivity(filterActivities({ age })),
      outdoorPossible: null
    };
  }
}

/**
 * Interactive CLI mode
 */
async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ask = (question) => new Promise(resolve => {
    rl.question(question, resolve);
  });
  
  console.log('\n👶 Activity Suggestor für Kinder\n');
  console.log('Ich schlage passende Aktivitäten für Kinder vor.\n');
  
  // Get age
  const ageStr = await ask('Wie alt ist das Kind? (1-12) [7]: ');
  const age = parseInt(ageStr) || 7;
  
  // Get weather preference
  const weatherChoice = await ask(
    'Bevorzugst du drinnen (d) oder draussen (a)? [wetterbasiert]: '
  );
  
  let criteria = { age };
  
  if (weatherChoice.toLowerCase() === 'd') {
    criteria.outdoor = false;
  } else if (weatherChoice.toLowerCase() === 'a') {
    criteria.outdoor = true;
  }
  
  // Get duration preference
  const durationStr = await ask('Maximale Dauer in Minuten? [unbegrenzt]: ');
  if (durationStr) {
    criteria.maxDuration = parseInt(durationStr);
  }
  
  // Get cost preference
  const costStr = await ask('Maximaler Kostenrahmen in CHF? [10]: ');
  if (costStr) {
    criteria.maxCost = parseInt(costStr);
  }
  
  // Get search term
  const search = await ask('Nach etwas Bestimmtem suchen? (leer für alles): ');
  if (search) {
    criteria.search = search;
  }
  
  rl.close();
  
  // Get and display suggestions
  console.log('\n' + '='.repeat(50));
  
  // Check weather if no specific preference
  if (criteria.outdoor === undefined) {
    try {
      const weather = await getCurrentWeather();
      console.log(`\n🌤️ Aktuelles Wetter in ${weather.location}: ${weather.temperature}°C`);
      console.log(`   ${weather.conditions}`);
      console.log(`   ${getRecommendation(weather.current_weather || { temperature: weather.temperature, weathercode: weather.weathercode })}\n`);
      
      criteria.outdoor = isGoodForOutdoors(weather.current_weather || { 
        temperature: weather.temperature, 
        weathercode: weather.weathercode 
      });
    } catch (error) {
      console.log('\n⚠️  Wetterdaten nicht verfügbar. Zeige alle Aktivitäten.\n');
    }
  }
  
  const results = filterActivities(criteria);
  
  if (results.length === 0) {
    console.log('❌ Keine Aktivitäten gefunden, die zu deinen Kriterien passen.');
    return;
  }
  
  console.log(`📊 ${results.length} passende Aktivitäten gefunden:\n`);
  
  // Show top 5 suggestions
  results.slice(0, 5).forEach((activity, index) => {
    console.log(`${index + 1}. ${activity.name}`);
  });
  
  console.log('\n' + '-'.repeat(50));
  
  // Pick a random one
  const suggestion = getRandomActivity(results);
  if (suggestion) {
    console.log('\n✨ Meine Empfehlung für heute:\n');
    console.log(formatActivity(suggestion));
  }
}

/**
 * Quick suggestion mode
 */
async function quickSuggestion(age = 7) {
  const result = await getSuggestionForToday(age);
  
  if (result.error) {
    console.log(`\n⚠️  ${result.error}`);
    console.log('\n💡 Trotzdem ein Vorschlag:\n');
  } else {
    console.log(`\n🌤️ Wetter: ${result.weather.temperature}°C, ${result.weather.conditions}`);
    console.log(`💡 ${result.weather.recommendation}\n`);
  }
  
  if (result.activity) {
    console.log(formatActivity(result.activity));
  } else {
    console.log('❌ Keine passenden Aktivitäten gefunden.');
  }
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
👶 Activity Suggestor für Kinder

Verwendung:
  node index.js [Optionen]

Optionen:
  --help, -h     Diese Hilfe anzeigen
  --quick, -q    Schneller Vorschlag basierend auf Wetter
  --age N        Alter des Kindes (Standard: 7)
  --indoor       Nur Indoor-Aktivitäten
  --outdoor      Nur Outdoor-Aktivitäten
  --search TEXT  Nach Aktivitäten suchen
  --list         Alle Aktivitäten auflisten

Beispiele:
  node index.js --quick
  node index.js --age 5 --indoor
  node index.js --search Lego
  node index.js --list --category creative
  `);
  process.exit(0);
}

if (args.includes('--list') || args.includes('-l')) {
  const results = filterActivities({});
  console.log('\n📋 Alle verfügbaren Aktivitäten:\n');
  results.forEach((activity, index) => {
    console.log(`${index + 1}. ${activity.name} (${activity.category})`);
  });
  process.exit(0);
}

if (args.includes('--quick') || args.includes('-q')) {
  const ageIndex = args.indexOf('--age') !== -1 ? args.indexOf('--age') : args.indexOf('-a');
  const age = ageIndex !== -1 && args[ageIndex + 1] ? parseInt(args[ageIndex + 1]) : 7;
  quickSuggestion(age).then(() => process.exit(0));
}

if (args.length === 0) {
  runInteractive().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

// Handle other flags
const criteria = {};

if (args.includes('--age')) {
  const idx = args.indexOf('--age');
  criteria.age = parseInt(args[idx + 1]) || 7;
}

if (args.includes('--indoor')) {
  criteria.outdoor = false;
}

if (args.includes('--outdoor')) {
  criteria.outdoor = true;
}

if (args.includes('--search')) {
  const idx = args.indexOf('--search');
  criteria.search = args[idx + 1];
}

if (args.includes('--category')) {
  const idx = args.indexOf('--category');
  criteria.category = args[idx + 1];
}

const results = filterActivities(criteria);

if (results.length === 0) {
  console.log('❌ Keine Aktivitäten gefunden.');
  process.exit(0);
}

console.log(`\n📊 ${results.length} passende Aktivitäten gefunden:\n`);
results.slice(0, 10).forEach((activity, index) => {
  console.log(`${index + 1}. ${activity.name} - ${activity.category}`);
});

const suggestion = getRandomActivity(results);
if (suggestion) {
  console.log('\n✨ Zufälliger Vorschlag:\n');
  console.log(formatActivity(suggestion));
}
