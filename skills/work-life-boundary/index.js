#!/usr/bin/env node

/**
 * Work-Life Boundary Skill
 * Automatische "Arbeit aus" Uhrzeit zum Schutz deiner Familien-Zeit
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = '1.0.0';
const CONFIG_DIR = path.join(process.env.HOME, '.melflin');
const CONFIG_FILE = path.join(CONFIG_DIR, 'work-life-boundary.json');

const program = new Command();

program
  .name('melflin-work-life-boundary')
  .description('💼➡️🏠 Automatische "Arbeit aus" Uhrzeit für Familien-Zeit')
  .version(VERSION);

// Helper: Config laden
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Helper: Config speichern
function saveConfig(config) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log('✅ Konfiguration gespeichert');
}

// Helper: Notification senden
function sendNotification(title, message) {
  const script = `osascript -e 'display notification "${message}" with title "${title}"'`;
  try {
    execSync(script);
    return true;
  } catch (e) {
    console.log('🔔 ' + title + ': ' + message);
    return false;
  }
}

// Command: Setup / Konfiguration
program
  .command('setup')
  .description('Boundary-Zeit und Grundeinstellungen konfigurieren')
  .option('--time <time>', 'Arbeit aus Zeit (z.B. "18:00")', '18:00')
  .option('--work-calendars <calendars>', 'Arbeits-Kalender (komma-getrennt)', 'Arbeit')
  .option('--family-calendars <calendars>', 'Familien-Kalender (komma-getrennt)', 'Familie')
  .option('--reminder <minutes>', 'Erinnerung vor Boundary (Minuten)', '15')
  .action((options) => {
    console.log('🔧 Work-Life Boundary Setup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const config = {
      boundaryTime: options.time,
      workCalendars: options.workCalendars.split(',').map(c => c.trim()),
      familyCalendars: options.familyCalendars.split(',').map(c => c.trim()),
      reminderMinutes: parseInt(options.reminder),
      snoozeMinutes: 30,
      notifications: true,
      homekitEnabled: false,
      createdAt: new Date().toISOString()
    };
    
    saveConfig(config);
    
    console.log('┌──────────────────────────────────────┐');
    console.log(`│  Boundary Zeit:  ${options.time}              │`);
    console.log(`│  Erinnerung:     ${options.reminder} min vor Boundary    │`);
    console.log(`│  Work Calendars: ${options.workCalendars}          │`);
    console.log(`│  Family Calendars: ${options.familyCalendars}            │`);
    console.log('└──────────────────────────────────────┘');
    
    sendNotification('🏠 Work-Life Boundary', `Eingerichtet: Arbeitsende um ${options.time}`);
  });

// Command: Status anzeigen
program
  .command('status')
  .description('Aktuellen Boundary-Status anzeigen')
  .action(() => {
    const config = loadConfig();
    
    console.log('💼➡️🏠 Work-Life Boundary Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!config) {
      console.log('❌ Noch nicht konfiguriert!');
      console.log('   Run: melflin-work-life-boundary setup --time "18:00"');
      return;
    }
    
    const now = new Date();
    const [hours, minutes] = config.boundaryTime.split(':');
    const boundaryDate = new Date();
    boundaryDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    let timeUntilBoundary = boundaryDate - now;
    if (timeUntilBoundary < 0) {
      timeUntilBoundary = 24 * 60 * 60 * 1000 + timeUntilBoundary; // Morgen
    }
    
    const hoursLeft = Math.floor(timeUntilBoundary / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeUntilBoundary % (1000 * 60 * 60)) / (1000 * 60));
    
    console.log(`┌──────────────────────────────────────┐`);
    console.log(`│  ⏰  Boundary Zeit:  ${config.boundaryTime}              │`);
    console.log(`│  ⏳  Zeit bis Boundary: ${hoursLeft}h ${minutesLeft}m            │`);
    console.log(`│  🔔  Erinnerung:     ${config.reminderMinutes} min vor             │`);
    console.log(`│  🛡️  Protection:      ${config.notifications ? 'Aktiv' : 'Inaktiv'}            │`);
    console.log(`└──────────────────────────────────────┘`);
    
    // Check ob Boundary bald erreicht
    if (timeUntilBoundary < config.reminderMinutes * 60 * 1000) {
      console.log('\n⚠️  Boundary bald erreicht!');
      sendNotification('⚠️ Work-Life Boundary', 'Arbeit bald beenden!');
    }
  });

// Command: Manuelle Erinnerung
program
  .command('remind')
  .description('Manuelle Boundary-Erinnerung auslösen')
  .action(() => {
    const config = loadConfig();
    if (!config) {
      console.log('❌ Bitte zuerst konfigurieren: melflin-work-life-boundary setup');
      return;
    }
    
    sendNotification('🔔 Work-Life Boundary', `Zeit für Familien-Zeit! (${config.boundaryTime})`);
    console.log('✅ Erinnerung gesendet');
  });

// Command: Konfiguration bearbeiten
program
  .command('config')
  .description('Konfiguration bearbeiten')
  .option('--edit', 'Konfiguration im Editor öffnen')
  .option('--show', 'Aktuelle Konfiguration anzeigen')
  .action((options) => {
    if (options.show) {
      const config = loadConfig();
      if (config) {
        console.log(JSON.stringify(config, null, 2));
      } else {
        console.log('❌ Keine Konfiguration gefunden');
      }
      return;
    }
    
    if (options.edit) {
      const editor = process.env.EDITOR || 'nano';
      const config = loadConfig();
      if (!config) {
        console.log('❌ Keine Konfiguration. Bitte zuerst setup ausführen.');
        return;
      }
      
      const tempFile = '/tmp/work-life-boundary.json';
      fs.writeFileSync(tempFile, JSON.stringify(config, null, 2));
      
      try {
        execSync(`${editor} ${tempFile}`);
        const newConfig = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
        saveConfig(newConfig);
        fs.unlinkSync(tempFile);
      } catch (e) {
        console.log('Editor nicht verfügbar. Nutze setup für neue Konfiguration.');
      }
      return;
    }
    
    console.log('Nutze: melflin-work-life-boundary config --show oder --edit');
  });

// Default: help
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log('💼➡️🏠 Work-Life Boundary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Automatische "Arbeit aus" Uhrzeit für Familien-Zeit');
  console.log('');
  program.outputHelp();
}
