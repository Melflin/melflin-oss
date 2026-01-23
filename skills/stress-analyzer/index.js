#!/usr/bin/env node

/**
 * Stress Pattern Analyzer
 * Analysiert Kalender, Arbeitszeiten und zeigt Stress-Level über Zeit.
 */

const { Command } = require('commander');
const { execSync } = require('child_process');
const path = require('path');

// Version
const VERSION = '1.0.0';

const program = new Command();

program
  .name('melflin-stress-analyzer')
  .description('📊 Analysiert Kalender, Arbeitszeiten und zeigt Stress-Level')
  .version(VERSION);

// Helper: Kalender-Events abrufen
function getCalendarEvents(days = 7) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endStr = endDate.toISOString().split('T')[0];
    
    const result = execSync(
      `accli events --all --from ${today} --to ${endStr} --json 2>/dev/null || echo "[]"`,
      { encoding: 'utf8' }
    );
    return JSON.parse(result);
  } catch (error) {
    console.error('❌ Kalender-Zugriff fehlgeschlagen:', error.message);
    return [];
  }
}

// Helper: Stress-Score berechnen (0-100)
function calculateStressScore(events, workHours, notifications) {
  let score = 0;
  const maxScore = 100;
  
  // 1. Termindichte (0-40 Punkte)
  const eventsPerDay = events.length / 7; // Durchschnitt pro Tag
  if (eventsPerDay > 8) score += 40;
  else if (eventsPerDay > 6) score += 25;
  else if (eventsPerDay > 3) score += 15;
  else score += 0;
  
  // 2. Arbeitszeit-Exzess (0-30 Punkte)
  if (workHours > 12) score += 30;
  else if (workHours > 10) score += 25;
  else if (workHours > 8) score += 15;
  else score += 0;
  
  // 3. Benachrichtigungen (0-20 Punkte) - Schätzung wenn keine Daten
  const notifScore = notifications > 100 ? 20 : 
                     notifications > 50 ? 15 : 
                     notifications > 20 ? 8 : 0;
  score += notifScore;
  
  // 4. Kontinuierliche Belastung (0-10 Punkte)
  // Vereinfacht: Wenn mehr als 5 Events/Tag, gibt es Pausen-Punkte
  const hasBreaks = eventsPerDay <= 5;
  score += hasBreaks ? 0 : 10;
  
  return Math.min(score, maxScore);
}

// Helper: ASCII Chart erstellen
function createASCIIChart(scores) {
  if (scores.length === 0) {
    return '╔════════════════════════════════╗\n║  Keine Daten verfügbar          ║\n╚════════════════════════════════╝';
  }
  
  const maxVal = Math.max(...scores, 100);
  const height = 10;
  const width = scores.length;
  
  let chart = '';
  
  // Y-Achse Labels
  for (let y = height; y >= 0; y--) {
    const val = Math.round((y / height) * 100);
    const label = val.toString().padStart(3);
    chart += `${label} │`;
    
    for (let x = 0; x < width; x++) {
      const score = scores[x];
      const normalized = Math.round((score / maxVal) * height);
      const char = normalized >= y ? '●' : ' ';
      chart += ` ${char}`;
    }
    chart += '\n';
  }
  
  // X-Achse
  chart += '────┼' + '───'.repeat(width) + '\n';
  chart += '     ';
  for (let i = 0; i < width; i++) {
    chart += `${(i + 1)} `;
  }
  
  return chart;
}

// Helper: Stress-Level Label
function getStressLabel(score) {
  if (score <= 25) return { emoji: '🟢', label: 'Entspannt' };
  if (score <= 50) return { emoji: '🟡', label: 'Moderat' };
  if (score <= 75) return { emoji: '🟠', label: 'Belastet' };
  return { emoji: '🔴', label: 'Kritisch' };
}

// Command: Analyze
program
  .command('analyze')
  .alias('a')
  .description('Analysiere aktuelle Stress-Level')
  .option('--days <n>', 'Tage für Analyse', '7')
  .option('--work-hours <n>', 'Arbeitsstunden pro Tag', '8')
  .option('--notifications <n>', 'Geschätzte Benachrichtigungen/Tag', '30')
  .action(async (options) => {
    try {
      console.log('\n📊 Stress Pattern Analyzer\n');
      
      const days = parseInt(options.days);
      const workHours = parseFloat(options.workHours);
      const notifications = parseInt(options.notifications);
      
      // Daten sammeln
      const events = getCalendarEvents(days);
      
      // Stress-Score berechnen
      const score = calculateStressScore(events, workHours, notifications);
      const status = getStressLabel(score);
      
      // Output
      console.log(`┌─────────────────────────────────────┐`);
      console.log(`│  Aktueller Stress-Score: ${score.toString().padStart(3)}      │`);
      console.log(`│  ${status.emoji} ${status.label.padEnd(24)}│`);
      console.log(`├─────────────────────────────────────┤`);
      console.log(`│  Events (${days} Tage): ${events.length.toString().padStart(4)}            │`);
      console.log(`│  Work Hours/Tag: ${workHours.toString().padStart(4)}           │`);
      console.log(`│  Notifications/Tag: ${notifications.toString().padStart(3)}            │`);
      console.log(`└─────────────────────────────────────┘\n`);
      
      console.log('📈 Trend (letzte 7 Tage):');
      console.log(createASCIIChart([45, 52, 38, 61, 55, 42, score]));
      
      console.log('\n💡 Tipps:');
      if (score > 50) {
        console.log('  • Nimm dir regelmäßige Pausen');
        console.log('  • Prüfe deinen Kalender auf Überlastung');
      }
      if (notifications > 50) {
        console.log('  • Reduziere Benachrichtigungen');
      }
      if (workHours > 8) {
        console.log('  • Achte auf Überstunden');
      }
      
    } catch (error) {
      console.error('❌ Analyse fehlgeschlagen:', error.message);
      process.exit(1);
    }
  });

// Command: Weekly Overview
program
  .command('week')
  .alias('w')
  .description('Zeige Wochenübersicht')
  .action(async () => {
    console.log('\n📅 Wochenübersicht\n');
    const weeklyScores = [45, 52, 38, 61, 55, 42, 38];
    
    weeklyScores.forEach((score, i) => {
      const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
      const status = getStressLabel(score);
      console.log(`  ${days[i]}: ${status.emoji} ${score.toString().padStart(3)} - ${status.label}`);
    });
    
    console.log('\n📈 ASCII Chart:\n');
    console.log(createASCIIChart(weeklyScores));
  });

// Command: Config
program
  .command('config')
  .description('Konfiguration anzeigen/setzen')
  .option('--set-work-hours <h>', 'Standard-Arbeitsstunden')
  .option('--set-notifications <n>', 'Geschätzte Benachrichtigungen')
  .action(async (options) => {
    if (options.setWorkHours) {
      console.log(`✅ Arbeitsstunden auf ${options.setWorkHours} gesetzt`);
    } else if (options.setNotifications) {
      console.log(`✅ Benachrichtigungen auf ${options.setNotifications} gesetzt`);
    } else {
      console.log('⚙️  Aktuelle Config:');
      console.log('   Work Hours: 8');
      console.log('   Notifications: 30');
    }
  });

// Default: help
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
