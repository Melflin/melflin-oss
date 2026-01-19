# Podcast → Notes 🎧

Transform podcasts and YouTube videos into structured Obsidian notes with AI-powered transcription and insight extraction.

[![GitHub Stars](https://img.shields.io/github/stars/melflin/melflin-oss?style=flat-square&logo=github)](https://github.com/melflin/melflin-oss/stargazers)

## 🎬 Demo

![Podcast → Notes Demo](https://github.com/melflin/melflin-oss/raw/master/skills/podcast-notes/demo-preview.png)
*See [Complete Demo GIF](../../demo/complete-demo.gif) or [Demo Scenarios](../../marketing/demo-scenarios.md) for examples*

## Features

- 🎙️ **Audio Extraction** - Download from YouTube, Spotify, or any podcast URL
- 🤖 **AI Transcription** - Local (Whisper) or Cloud options
- 💡 **Key Insights** - AI-powered summary of main points
- 📝 **Obsidian Integration** - Automatically saves to your vault
- 🏷️ **Auto-Tagging** - Topics and themes auto-tagged

## Installation

```bash
cd skills/podcast-notes
chmod +x *.js
```

### Dependencies

**Required:**
- `yt-dlp` - For audio extraction
  ```bash
  brew install yt-dlp  # macOS
  pip install yt-dlp   # Python
  ```

- `ffmpeg` - For audio processing
  ```bash
  brew install ffmpeg  # macOS
  ```

**Optional (transcription):**
- `whisper-cli` - Local transcription (free, no API key)
  ```bash
  pip install openai-whisper
  ```

## Usage

### Quick Start

```bash
# Process a YouTube video
node index.js "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Dry run (preview only)
node index.js "https://youtube.com/..." --dry-run

# Mock mode (test without downloading)
node index.js "https://youtube.com/..." --mock
```

### Manual Steps

```bash
# Step 1: Fetch audio
node fetch.js "https://youtube.com/watch?v=..." --output=/tmp/audio.mp3

# Step 2: Transcribe & analyze
node analyze.js /tmp/audio.mp3 --json > /tmp/analysis.json

# Step 3: Save to Obsidian
node execute.js /tmp/analysis.json --destination="~/Obsidian/Melf2025"
```

### Configuration

Set your Obsidian vault path:
```bash
export OBSIDIAN_VAULT="~/Obsidian/YourVault"
```

Or pass directly:
```bash
node execute.js analysis.json --destination="~/Obsidian/YourVault"
```

## Output Format

Notes are saved to `Podcast Notes/` in your vault with this structure:

```markdown
---
tags: podcast, podcast-notes
created: 2026-01-19
source: https://youtube.com/...
duration: ~60 min
---

# 🎧 Podcast Notes

## Source
- URL, duration, date

## Summary
AI-generated summary

## 🎯 Key Insights
1. First insight
2. Second insight
...

## 📝 Full Transcript
[00:00] Introduction
...

## 🏷️ Topics
- #topic1
- #topic2
```

## Architecture

```
index.js (CLI)
    │
    ├── fetch.js (URL → Audio)
    │       └── yt-dlp + ffmpeg
    │
    ├── analyze.js (Audio → Transcript + Insights)
    │       └── Whisper API / whisper-cli
    │
    └── execute.js (Analysis → Obsidian Note)
            └── Template-based note creation
```

## API Options

### Transcription

| Option | Pros | Cons |
|--------|------|------|
| whisper-cli | Free, local, private | Slower, needs GPU |
| OpenAI Whisper API | Fast, accurate | Costs money |
| Deepgram | Very fast | Paid |
| AssemblyAI | Good quality | Paid |

### AI Insights

| Option | Pros | Cons |
|--------|------|------|
| MiniMax API | Fast, cheap | Current default |
| OpenAI GPT | High quality | More expensive |
| Local LLM | Free, private | Needs hardware |

## Troubleshooting

### "yt-dlp not found"
```bash
brew install yt-dlp
# or
pip install yt-dlp
```

### "ffmpeg not found"
```bash
brew install ffmpeg
```

### "Obsidian vault not found"
Check your path:
```bash
ls ~/Obsidian/Melf2025
```

### Permission denied
```bash
chmod +x *.js
```

## Roadmap

- [ ] YouTube Chapter support
- [ ] Speaker detection
- [ ] Multi-language support
- [ ] Notion integration
- [ ] Scheduled downloads (cron)

## License

MIT - Part of Melflin OSS Skills
