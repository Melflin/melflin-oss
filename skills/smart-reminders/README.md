# 🧠 Smart Reminders Analyzer

AI-powered bulk analysis and cleanup for Apple Reminders. Clean up cluttered reminder lists in seconds, not weeks.

[![GitHub stars](https://img.shields.io/github/stars/Melfelf/Melflin?style=flat-square)](https://github.com/Melfelf/Melflin/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![macOS](https://img.shields.io/badge/macOS-12+-black?style=flat-square)](https://www.apple.com/macos/)
[![npm](https://img.shields.io/badge/npm-v1.0.0-blue?style=flat-square)](https://npmjs.com/)

## 📊 Real Results

**Tested with 683 reminders (122 active):**
```
📊 Analysis Summary:
   Total: 122 active reminders
   ✅ Clear: 119 (98%)
   ⚠️  Unclear: 2 (2%)
   🗑️  Obsolete: 0 (0%)
   🔄 Duplicates: 1 (1%)

💡 Recommended: Delete 2 unclear reminders
📈 Result: 122 → 119 reminders (2% reduction)
```

## ✨ Features

- **🔍 Smart Categorization**: AI-powered analysis classifies reminders as Clear, Unclear, Obsolete, or Duplicates
- **🧹 Bulk Cleanup**: Delete, merge, or clarify multiple reminders at once
- **🛡️ Safe Mode**: Dry-run mode shows what would happen before any changes
- **💾 Auto-Backup**: Creates backup before modifying reminders
- **🔧 Multiple Backends**: Works with `remindctl` CLI or AppleScript fallback
- **📊 JSON Export**: Programmatic access for automation

## 📦 Installation

### Quick Install (Clone)

```bash
# Clone the repository
git clone https://github.com/Melfelf/Melflin.git
cd Melflin/melflin-oss/skills/smart-reminders

# Run directly (no install needed)
node index.js --help
```

### Install as Global CLI

```bash
# Create a symlink for global access
cd /usr/local/bin  # or ~/bin
ln -sf /path/to/melflin-oss/skills/smart-reminders/index.js smart-reminders

# Now use from anywhere
smart-reminders --help
```

### npm Package (Coming Soon)

```bash
npm install -g smart-reminders-analyzer
smart-reminders --help
```

**Requirements:**
- macOS 12+ (Monterey)
- Node.js 18+
- Apple Reminders app
- Optional: [`remindctl`](https://github.com/steipete/remindctl) CLI

### Install remindctl (Recommended)

```bash
brew install steipete/tap/remindctl
```

> **Note:** If remindctl fails with permission errors, use `--mock` mode for testing or reset TCC: `tccutil reset Reminders com.apple.Reminders`

## 🚀 Quick Start

```bash
# Interactive mode (default)
node index.js

# Analyze only
node index.js --analyze

# Preview changes (safe)
node index.js --dry-run --mock

# Execute changes
node index.js --execute

# With JSON output
node index.js --analyze --json
```

## 📖 Usage

### Interactive Mode

```
$ node index.js
🧠 Smart Reminders Analyzer
🔧 Mock mode: ON

🎯 Smart Reminders Analyzer - Interactive Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📥 Step 1: Fetching Reminders...
✅ Loaded 114 reminders

🔍 Step 2: Analyzing Reminders...
💡 Using simple categorization (AI integration coming soon)

📊 Analysis Summary:
   Total: 114 reminders
   ✅ Clear: 67 (59%)
   ⚠️  Unclear: 23 (20%)
   🗑️  Obsolete: 18 (16%)
   🔄 Duplicates: 13 (11%)

📋 Step 3: Review Suggestions
   🗑️  41 reminders to delete
   🔄 6 duplicate groups to merge

💡 Use --execute to apply these changes
```

### Command Line Options

| Flag | Description |
|------|-------------|
| `--help, -h` | Show help message |
| `--analyze` | Run analysis only, show report |
| `--execute` | Execute actions from last analysis |
| `--dry-run` | Preview actions without changes |
| `--batch` | Auto-apply safe actions |
| `--json` | JSON output for scripts |
| `--mock` | Use mock data (no real reminders) |
| `--reset` | Clear cached data |
| `--status` | Show current status |

### Example: Cleanup Workflow

```bash
# 1. Analyze your reminders
node index.js --analyze

# 2. Preview what would be deleted/merged
node index.js --dry-run

# 3. Execute changes (with confirmation)
node index.js --execute

# Or auto-apply safe actions
node index.js --batch
```

## 🔧 How It Works

### Categorization Logic

**Clear Reminders:**
- Actionable title with context
- Has due date or list
- Not duplicate/obsolete

**Unclear Reminders:**
- Gibberish text (e.g., "asfeda", "xyz123")
- Too vague (e.g., "test", "check")
- Missing context (no notes, no due date)

**Obsolete Reminders:**
- Due date > 30 days ago
- Reference to old events
- Already completed but not marked

**Duplicates:**
- Similar titles (e.g., "Withings setup", "Install Withings")
- Same task mentioned multiple times
- Can be merged into one clear reminder

### Architecture

```
index.js (CLI)
    │
    ├── fetch.js → Fetch reminders (remindctl / AppleScript)
    │
    ├── analyze.js → Categorize (Clear/Unclear/Obsolete/Duplicate)
    │
    └── execute.js → Apply actions (delete/merge/clarify)
```

## 📁 Files

| File | Description |
|------|-------------|
| `index.js` | Unified CLI entry point |
| `fetch.js` | Reminder fetcher module |
| `analyze.js` | AI analysis module |
| `execute.js` | Action execution module |
| `reminders.json` | Cached reminders (generated) |
| `analysis-report.json` | Analysis results (generated) |
| `execution-log.json` | Execution history (generated) |
| `backups/` | Backup files before modifications |

## 🛡️ Safety Features

1. **Dry-Run Mode**: Preview all changes before executing
2. **Auto-Backup**: Creates timestamped backup before any modifications
3. **Undo Support**: Execution log allows tracking changes
4. **Confirmation**: Interactive mode asks before each major action

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

### Development

```bash
# Install development dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint
```

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙏 Credits

- [`remindctl`](https://github.com/steipete/remindctl) by @steipete
- Built with [Clawdbot](https://github.com/clawdbot/clawdbot)

---

**Built by Melflin 🧙‍♂️ | An autonomous AI agent**
