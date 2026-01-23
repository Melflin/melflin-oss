/**
 * Weather Integration for Activity Suggestor
 * Uses Open-Meteo API (free, no API key required)
 */

const https = require('https');

const ZURICH = {
  latitude: 47.3769,
  longitude: 8.5417
};

/**
 * Fetch current weather for Zurich
 * @returns {Promise<Object>} Weather data
 */
function getCurrentWeather() {
  return new Promise((resolve, reject) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ZURICH.latitude}&longitude=${ZURICH.longitude}&current_weather=true&timezone=Europe%2FZurich`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const weather = JSON.parse(data);
          resolve(parseWeatherData(weather));
        } catch (error) {
          reject(new Error(`Failed to parse weather data: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch weather: ${error.message}`));
    });
  });
}

/**
 * Parse Open-Meteo response into usable format
 * @param {Object} rawData - Raw API response
 * @returns {Object} Parsed weather data
 */
function parseWeatherData(rawData) {
  const current = rawData.current_weather;
  
  return {
    temperature: current.temperature,
    windspeed: current.windspeed,
    weathercode: current.weathercode,
    isDay: current.is_day !== undefined ? current.is_day : 1,
    timestamp: current.time,
    location: 'Zürich',
    
    // Derived conditions
    conditions: getWeatherCondition(current.weathercode),
    isGoodForOutdoors: isGoodForOutdoors(current),
    recommendation: getRecommendation(current)
  };
}

/**
 * Get human-readable weather condition from WMO code
 * @param {number} code - WMO weather code
 * @returns {string} Weather condition
 */
function getWeatherCondition(code) {
  const conditions = {
    0: 'Klarer Himmel',
    1: 'Überwiegend klar',
    2: 'Teilweise bewölkt',
    3: 'Bedeckt',
    45: 'Nebel',
    48: 'Reif Nebel',
    51: 'Leichter Nieselregen',
    53: 'Mässiger Nieselregen',
    55: 'Starker Nieselregen',
    61: 'Leichter Regen',
    63: 'Mässiger Regen',
    65: 'Starker Regen',
    71: 'Leichter Schneefall',
    73: 'Mässiger Schneefall',
    75: 'Starker Schneefall',
    80: 'Leichte Regenschauer',
    81: 'Mässige Regenschauer',
    82: 'Starke Regenschauer',
    95: 'Gewitter',
    96: 'Gewitter mit Hagel',
    99: 'Schweres Gewitter mit Hagel'
  };
  
  return conditions[code] || 'Unbekannt';
}

/**
 * Determine if weather is good for outdoor activities
 * @param {Object} weather - Current weather data
 * @returns {boolean} True if good for outdoors
 */
function isGoodForOutdoors(weather) {
  // Good conditions: codes 0, 1, 2
  // Acceptable: code 3 (if warm enough)
  // Bad: everything else
  
  if (weather.weathercode <= 2) {
    return true;
  }
  
  if (weather.weathercode === 3 && weather.temperature >= 15) {
    return true;
  }
  
  return false;
}

/**
 * Get activity recommendation based on weather
 * @param {Object} weather - Current weather data
 * @returns {string} Recommendation text
 */
function getRecommendation(weather) {
  if (isGoodForOutdoors(weather)) {
    if (weather.temperature >= 20) {
      return 'Perfektes Wetter für Outdoor-Aktivitäten!';
    } else if (weather.temperature >= 10) {
      return 'Gutes Wetter für draussen, aber etwas kühl.';
    } else {
      return 'Klar, aber kühl - warm anziehen für draussen!';
    }
  } else if (weather.weathercode >= 51 && weather.weathercode <= 82) {
    return 'Regen vorhergesagt - ideal für Indoor-Aktivitäten.';
  } else if (weather.weathercode >= 71) {
    return 'Schnee! Zeit für Winter-Aktivitäten drinnen oder draussen.';
  } else if (weather.weathercode >= 95) {
    return 'Gewitter - besser drinnen bleiben.';
  }
  
  return 'Mix aus drinnen und draussen.';
}

module.exports = {
  getCurrentWeather,
  parseWeatherData,
  getWeatherCondition,
  isGoodForOutdoors,
  getRecommendation,
  ZURICH
};
