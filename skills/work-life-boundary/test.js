/**
 * Work-Life Boundary Test-Skript
 * 
 * Testet die CLI-Funktionalitäten
 */

const { execSync } = require('child_process');
const path = require('path');

const CLI_PATH = path.join(__dirname, 'index.js');
const CONFIG_FILE = require('path').join(process.env.HOME, '.melflin', 'work-life-boundary.json');

console.log('🧪 Work-Life Boundary Tests');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Hilfe anzeigen
console.log('Test 1: Hilfe anzeigen');
try {
  execSync(`node ${CLI_PATH} --help`, { encoding: 'utf8' });
  console.log('✅ --help funktioniert\n');
} catch (e) {
  console.log('❌ --help fehlgeschlagen\n');
}

// Test 2: Setup ausführen
console.log('Test 2: Setup ausführen');
try {
  execSync(`node ${CLI_PATH} setup --time "19:00" --work-calendars "Arbeit,Job" --family-calendars "Familie,Kids" --reminder 15`, { encoding: 'utf8' });
  console.log('✅ Setup erfolgreich\n');
} catch (e) {
  console.log('❌ Setup fehlgeschlagen:', e.message, '\n');
}

// Test 3: Status anzeigen
console.log('Test 3: Status anzeigen');
try {
  const output = execSync(`node ${CLI_PATH} status`, { encoding: 'utf8' });
  console.log(output);
  console.log('✅ Status funktioniert\n');
} catch (e) {
  console.log('❌ Status fehlgeschlagen\n');
}

// Test 4: Konfiguration anzeigen
console.log('Test 4: Konfiguration anzeigen');
try {
  execSync(`node ${CLI_PATH} config --show`, { encoding: 'utf8' });
  console.log('✅ Config --show funktioniert\n');
} catch (e) {
  console.log('❌ Config --show fehlgeschlagen\n');
}

// Test 5: Manuelle Erinnerung
console.log('Test 5: Manuelle Erinnerung (nur Terminal, ohne Notification)');
console.log('   (übersprungen - würde Notification senden)\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 Alle Tests abgeschlossen!');
console.log('\n📝 Bitte manuell testen:');
console.log('   - Notification Center Benachrichtigungen');
console.log('   - Apple Calendar Integration');
console.log('   - calendar.js Module');
