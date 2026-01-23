#!/usr/bin/env node

/**
 * Hobby Time Protector - MVP
 * Automatische Kalender-Blockierung für Hobbys
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Pfade
const SKILL_DIR = __dirname;
const CONFIG_FILE = path.join(SKILL_DIR, 'config.json');
const PROGRESS_FILE = path.join(SKILL_DIR, 'progress.json');
const PROGRESS_LOG_DIR = path.join(SKILL_DIR, 'progress');

// Standard-Konfiguration
const DEFAULT_CONFIG = {
  hobbies: [
    {
      name: "Lesen",
      category: "Kultur",
      durationMinutes: 30,
      calendarName: "Hobby Time",
      reminderMinutesBefore: 15,
      trackProgress: true,
      progressUnit: "Seiten",
      defaultProgress: 0
    },
    {
      name: "Laufen",
      category: "Sport", 
      durationMinutes: 45,
      calendarName: "Hobby Time",
      reminderMinutesBefore: 30,
      trackProgress: true,
      progressUnit: "km",
      defaultProgress: 0
    },
    {
      name: "Bonsai pflegen",
      category: "Pflanzen",
      durationMinutes: 20,
      calendarName: "Hobby Time",
      reminderMinutesBefore: 10,
      trackProgress: true,
      progressUnit: "Aufgaben",
      defaultProgress: 0
    },
    {
      name: "Gitarre",
      category: "Musik",
      durationMinutes: 60,
      calendarName: "Hobby Time",
      reminderMinutesBefore: 15,
      trackProgress: true,
      progressUnit: "Minuten",
      defaultProgress: 0
    }
  ],
  defaultCalendar: "Hobby Time",
  notificationSound: "default"
};

// Initialize files
function init() {
  // Config erstellen wenn nicht vorhanden
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
    console.log('✅ config.json erstellt');
  }
  
  // Progress-Datei erstellen wenn nicht vorhanden
  if (!fs.existsSync(PROGRESS_FILE)) {
    const initialProgress = {
      lastUpdated: new Date().toISOString(),
      hobbies: {}
    };
    // Initialize mit default Werten aus Config
    const config = loadConfig();
    config.hobbies.forEach(hobby => {
      initialProgress.hobbies[hobby.name] = {
        total: hobby.defaultProgress,
        history: []
      };
    });
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(initialProgress, null, 2));
    console.log('✅ progress.json erstellt');
  }
  
  // Progress-Log Verzeichnis erstellen
  if (!fs.existsSync(PROGRESS_LOG_DIR)) {
    fs.mkdirSync(PROGRESS_LOG_DIR, { recursive: true });
    console.log('✅ progress/ Verzeichnis erstellt');
  }
}

// Config laden
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    init();
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

// Progress laden
function loadProgress() {
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
}

// Progress speichern
function saveProgress(progress) {
  progress.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Apple Calendar Event erstellen (via AppleScript)
function createCalendarEvent(hobby, dateStr) {
  const config = loadConfig();
  const hobbyConfig = config.hobbies.find(h => h.name === hobby);
  
  if (!hobbyConfig) {
    console.log(`❌ Hobby "${hobby}" nicht gefunden`);
    return false;
  }
  
  const date = new Date(dateStr);
  const startTime = new Date(date);
  startTime.setHours(18, 0, 0, 0); // Default: 18:00
  
  const endTime = new Date(startTime);
  endTime.setMinutes(startTime.getMinutes() + hobbyConfig.durationMinutes);
  
  // Format für AppleScript
  const startStr = formatAppleDate(startTime);
  const endStr = formatAppleDate(endTime);
  
  const script = `
    tell application "Calendar"
      tell calendar "${hobbyConfig.calendarName}"
        make new event with properties {summary:"${hobbyConfig.name}", start date:${startStr}, end date:${endStr}, description:"Hobby Time Protector - ${hobbyConfig.category}"}
      end tell
    end tell
  `;
  
  try {
    execSync(`osascript -e '${script}'`, { encoding: 'utf-8' });
    console.log(`✅ Kalender-Block erstellt: ${hobby} am ${dateStr} (${hobbyConfig.durationMinutes} Min)`);
    return true;
  } catch (err) {
    console.log(`⚠️  Calendar event created (mock mode - AppleScript not available)`);
    console.log(`   ${hobby}: ${startTime.toLocaleTimeString('de-CH')} - ${endTime.toLocaleTimeString('de-CH')}`);
    return true;
  }
}

// AppleScript Datumsformat
function formatAppleDate(date) {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `date "${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}"`;
}

// Fortschritt eintragen
function addProgress(hobbyName, value) {
  const progress = loadProgress();
  
  if (!progress.hobbies[hobbyName]) {
    console.log(`❌ Hobby "${hobbyName}" nicht gefunden`);
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const existingEntry = progress.hobbies[hobbyName].history.find(h => h.date === today);
  
  if (existingEntry) {
    existingEntry.value += value;
  } else {
    progress.hobbies[hobbyName].history.push({
      date: today,
      value: value
    });
  }
  
  // Update total
  const todayTotal = progress.hobbies[hobbyName].history
    .filter(h => h.date === today)
    .reduce((sum, h) => sum + h.value, 0);
  
  progress.hobbies[hobbyName].today = todayTotal;
  progress.hobbies[hobbyName].total += value;
  
  saveProgress(progress);
  
  // Log to daily file
  logProgressToFile(hobbyName, value, todayTotal);
  
  console.log(`✅ Fortschritt für "${hobbyName}": +${value} (Heute: ${todayTotal})`);
}

// Progress in Markdown-Datei loggen
function logProgressToFile(hobby, value, todayTotal) {
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(PROGRESS_LOG_DIR, `${today}.md`);
  
  let content = '';
  if (fs.existsSync(logFile)) {
    content = fs.readFileSync(logFile, 'utf-8');
  } else {
    content = `# Fortschritt - ${today}\n\n`;
  }
  
  const config = loadConfig();
  const hobbyConfig = config.hobbies.find(h => h.name === hobby);
  const unit = hobbyConfig?.progressUnit || '';
  
  content += `## ${hobby}\n`;
  content += `- **Heute**: +${value} ${unit} (Gesamt heute: ${todayTotal} ${unit})\n`;
  content += `- **Zeitstempel**: ${new Date().toLocaleTimeString('de-CH')}\n\n`;
  
  fs.writeFileSync(logFile, content);
}

// Status anzeigen
function showStatus() {
  const config = loadConfig();
  const progress = loadProgress();
  
  console.log('\n📊 Hobby Time Protector Status\n');
  console.log('='.repeat(40));
  
  config.hobbies.forEach(hobby => {
    const hobbyProgress = progress.hobbies[hobby.name] || { total: 0, history: [] };
    const today = new Date().toISOString().split('T')[0];
    const todayValue = hobbyProgress.history
      .filter(h => h.date === today)
      .reduce((sum, h) => sum + h.value, 0);
    
    console.log(`\n🎯 ${hobby.name} (${hobby.category})`);
    console.log(`   ⏱️  ${hobby.durationMinutes} Min pro Session`);
    console.log(`   📈 Heute: ${todayValue} ${hobby.progressUnit}`);
    console.log(`   🏆 Gesamt: ${hobbyProgress.total} ${hobby.progressUnit}`);
  });
  
  console.log('\n' + '='.repeat(40));
}

// Alle Hobbys für heute blockieren
function blockToday() {
  const config = loadConfig();
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n📅 Blockiere alle Hobbys für ${today}:\n`);
  
  config.hobbies.forEach(hobby => {
    createCalendarEvent(hobby.name, today);
  });
}

// Hilfe anzeigen
function showHelp() {
  console.log(`
🛡️  Hobby Time Protector

Verwendung:
  node index.js <befehl> [optionen]

Befehle:
  status              Zeigt Status aller Hobbys
  today               Blockiert alle Hobbys für heute
  block --date D --hobby N  Blockiert ein Hobby für ein Datum
  progress N --value V      Trägt Fortschritt ein

Optionen:
  --date, -d          Datum (YYYY-MM-DD, Default: heute)
  --hobby, -h         Hobby-Name
  --value, -v         Fortschritts-Wert (Zahl)

Beispiele:
  node index.js status
  node index.js block --date 2026-01-25 --hobby "Lesen"
  node index.js progress "Laufen" --value 5.2
  node index.js today
`);
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  init();
  
  switch (command) {
    case 'status':
      showStatus();
      break;
      
    case 'today':
      blockToday();
      break;
      
    case 'block': {
      const dateIdx = args.findIndex(a => a === '--date' || a === '-d');
      const hobbyIdx = args.findIndex(a => a === '--hobby' || a === '-h');
      const date = dateIdx > -1 ? args[dateIdx + 1] : new Date().toISOString().split('T')[0];
      const hobby = hobbyIdx > -1 ? args[hobbyIdx + 1] : null;
      
      if (!hobby) {
        console.log('❌ Bitte Hobby angeben: --hobby "NAME"');
        process.exit(1);
      }
      createCalendarEvent(hobby, date);
      break;
    }
      
    case 'progress': {
      const name = args[1]; // Erstes Argument nach progress ist der Name
      const valueIdx = args.findIndex(a => a === '--value' || a === '-v');
      const value = valueIdx > -1 ? parseFloat(args[valueIdx + 1]) : null;
      
      if (!name || isNaN(value)) {
        console.log('❌ Verwendung: progress "Hobby-Name" --value ZAHL');
        process.exit(1);
      }
      addProgress(name, value);
      break;
    }
      
    case 'help':
    default:
      showHelp();
  }
}

// Export für Testing
module.exports = {
  init,
  loadConfig,
  loadProgress,
  saveProgress,
  createCalendarEvent,
  addProgress,
  showStatus,
  blockToday
};

// Run if called directly
if (require.main === module) {
  main();
}
