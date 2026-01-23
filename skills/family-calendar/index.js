#!/usr/bin/env node

/**
 * Family Calendar Unifier
 * Aggregiert mehrere Apple Calendar Kalender in einer unified View
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

// Version
const VERSION = '1.0.0';

// Kalender-Konfiguration
const CALENDARS = {
  arbeit: 'Arbeit',
  sandra: 'Sandra',
  arthur: 'Arthur'
};

const program = new Command();

program
  .name('family-calendar')
  .description('Aggregiert Apple Calendar Kalender in einer unified View')
  .version(VERSION);

// Config laden
function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return { calendars: CALENDARS, defaultRange: 'week' };
}

// Dummy Events für MVP (später durch echte Calendar API ersetzen)
function getDummyEvents() {
  const today = new Date();
  return [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(),
      end: new Date(today.getTime() + 10 * 60 * 60 * 1000).toISOString(),
      calendar: 'arbeit',
      location: 'Büro'
    },
    {
      id: '2',
      title: 'Arzttermin Sandra',
      start: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(today.getTime() + 25 * 60 * 60 * 1000).toISOString(),
      calendar: 'sandra',
      location: 'Praxis Mainaustrasse'
    },
    {
      id: '3',
      title: 'Fussballtraining Arthur',
      start: new Date(today.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      end: new Date(today.getTime() + 50 * 60 * 60 * 1000).toISOString(),
      calendar: 'arthur',
      location: 'Sportplatz'
    },
    {
      id: '4',
      title: 'Workshop',
      start: new Date(today.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      end: new Date(today.getTime() + 76 * 60 * 60 * 1000).toISOString(),
      calendar: 'arbeit',
      location: 'Conference Room A'
    }
  ];
}

// Kalender-Name zu Key finden
function getCalendarKey(name) {
  return Object.keys(CALENDARS).find(key => CALENDARS[key] === name);
}

// Events formatieren für Output
function formatEvent(event, config) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const dateStr = start.toLocaleDateString('de-CH');
  const timeStr = `${start.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}`;
  
  return {
    date: dateStr,
    time: timeStr,
    title: event.title,
    calendar: event.calendar,
    location: event.location || '-'
  };
}

// JSON Output
function outputJSON(events) {
  console.log(JSON.stringify({
    generated: new Date().toISOString(),
    count: events.length,
    events: events
  }, null, 2));
}

// Table Output
function outputTable(events) {
  console.log('\n📅 Family Calendar - Übersicht\n');
  console.log(' Datum         | Zeit              | Titel                    | Kalender | Ort');
  console.log('---------------|-------------------|--------------------------|----------|------');
  
  events.forEach(event => {
    const formatted = formatEvent(event);
    const datePad = formatted.date.padEnd(12, ' ');
    const timePad = formatted.time.padEnd(18, ' ');
    const titlePad = formatted.title.padEnd(24, ' ');
    const calPad = formatted.calendar.padEnd(8, ' ');
    console.log(` ${datePad} | ${timePad} | ${titlePad} | ${calPad} | ${formatted.location}`);
  });
  
  console.log(`\n📊 Total: ${events.length} Termine\n`);
}

// list command
program
  .command('list')
  .description('Liste aggregierte Kalender-Einträge')
  .option('--calendar <name>', 'Nach Kalender filtern (arbeit|sandra|arthur)')
  .option('--from <date>', 'Startdatum (YYYY-MM-DD)')
  .option('--to <date>', 'Enddatum (YYYY-MM-DD)')
  .option('--days <n>', 'Anzahl Tage (Standard: 7)')
  .option('--json', 'JSON Output')
  .option('--dry-run', 'Nur simulieren')
  .action(async (options) => {
    const config = loadConfig();
    
    console.log('⬇️  Lade Kalender-Events...');
    
    try {
      // TODO: Echte Calendar API Integration hier einfügen
      // MVP: Dummy Events
      let events = getDummyEvents();
      
      // Nach Kalender filtern
      if (options.calendar) {
        const validCalendars = Object.keys(CALENDARS);
        if (!validCalendars.includes(options.calendar)) {
          console.error(`❌ Unbekannter Kalender: ${options.calendar}`);
          console.log(`   Verfügbare: ${validCalendars.join(', ')}`);
          process.exit(1);
        }
        events = events.filter(e => e.calendar === options.calendar);
      }
      
      // Nach Datum filtern
      if (options.from) {
        const fromDate = new Date(options.from);
        events = events.filter(e => new Date(e.start) >= fromDate);
      }
      
      if (options.to) {
        const toDate = new Date(options.to);
        events = events.filter(e => new Date(e.end) <= toDate);
      }
      
      // Nach Tagen filtern
      if (options.days) {
        const now = new Date();
        const futureDate = new Date(now.getTime() + options.days * 24 * 60 * 60 * 1000);
        events = events.filter(e => new Date(e.start) <= futureDate);
      }
      
      if (options.dryRun) {
        console.log('🔍 Dry-Run: Würde folgende Events anzeigen:');
        console.log(JSON.stringify(events.map(e => e.title), null, 2));
        return;
      }
      
      console.log(`✅ ${events.length} Events geladen`);
      
      // Output
      if (options.json) {
        outputJSON(events);
      } else {
        outputTable(events);
      }
      
    } catch (error) {
      console.error('❌ Fehler beim Laden der Events:', error.message);
      process.exit(1);
    }
  });

// conflicts command
program
  .command('conflicts')
  .description('Zeige Terminkonflikte')
  .option('--dry-run', 'Nur simulieren')
  .action(async (options) => {
    console.log('🔍 Suche nach Konflikten...');
    
    try {
      const events = getDummyEvents();
      
      // Konflikte finden (gleiche Zeit, verschiedene Kalender)
      const conflicts = [];
      for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
          const e1 = events[i];
          const e2 = events[j];
          
          const start1 = new Date(e1.start).getTime();
          const end1 = new Date(e1.end).getTime();
          const start2 = new Date(e2.start).getTime();
          const end2 = new Date(e2.end).getTime();
          
          // Überlappung prüfen
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              event1: e1,
              event2: e2,
              overlap: true
            });
          }
        }
      }
      
      if (options.dryRun) {
        console.log('🔍 Dry-Run: Würde folgende Konflikte anzeigen:');
        console.log(JSON.stringify(conflicts.map(c => `${c.event1.title} vs ${c.event2.title}`), null, 2));
        return;
      }
      
      console.log(`✅ ${conflicts.length} Konflikte gefunden\n`);
      
      if (conflicts.length > 0) {
        console.log('⚠️  Terminkonflikte:\n');
        conflicts.forEach((c, i) => {
          console.log(`${i + 1}. ${c.event1.title} (${c.event1.calendar})`);
          console.log(`   vs ${c.event2.title} (${c.event2.calendar})\n`);
        });
      } else {
        console.log('🎉 Keine Terminkonflikte gefunden!');
      }
      
    } catch (error) {
      console.error('❌ Fehler:', error.message);
      process.exit(1);
    }
  });

// status command
program
  .command('status')
  .description('Zeige Kalender-Status')
  .action(() => {
    const config = loadConfig();
    console.log('\n📅 Family Calendar Status\n');
    console.log(' Kalender          | Status');
    console.log('-------------------|--------');
    Object.entries(config.calendars).forEach(([key, name]) => {
      console.log(` ${name.padEnd(16)} | ✅ Aktiv`);
    });
    console.log('');
  });

// Default: help
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
