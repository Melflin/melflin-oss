# Demo Scripts - Melflin OSS Skills

This folder contains scripts to demonstrate each skill in action.

## Quick Demo (All Skills)

```bash
# Run all demos in sequence
./demo-all.sh
```

## Individual Skill Demos

### Smart Reminders Analyzer
```bash
cd skills/smart-reminders
./demo.sh
```
Shows: Fetch → Analyze → Suggest actions

### Meeting Prep Assistant
```bash
cd skills/meeting-prep-assistant
./demo.sh
```
Shows: Calendar fetch → Context aggregation → Briefing

### Knowledge Sync
```bash
cd skills/knowledge-sync
./demo.sh
```
Shows: List books → Review highlights → Export to Obsidian

### Podcast → Notes
```bash
cd skills/podcast-notes
./demo.sh
```
Shows: URL → Transcribe → Summarize → Obsidian Note

## Recording Demo GIFs

Use `asciinema` to record terminal sessions:

```bash
# Install asciinema
brew install asciinema

# Record a session
asciinema rec demo.cast

# ... do your demo ...

# Exit (Ctrl+D)

# Convert to GIF using agg
agg demo.cast demo.gif
```

## Demo Output Examples

See `examples/` folder for expected output from each skill.
