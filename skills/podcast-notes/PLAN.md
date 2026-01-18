# Podcast → Notes - Plan 🎧

**Priority:** #4  
**Timeline:** Week 6-7 (Feb 23 - Mar 8)  
**Status:** 🔮 Future

---

## 🎯 Problem

Stefan listens to lots of podcasts/audiobooks:
- Great insights while listening
- But: Can't search or reference later
- No transcript = insights lost
- No way to find "that one thing they said"

Result: Valuable knowledge evaporates after listening.

---

## 💡 Solution

**Auto-transcribe & Summarize:**
1. Give URL (YouTube, Spotify, Apple Podcasts)
2. Auto-download audio
3. Transcribe with Whisper (local or API)
4. AI summary (key points, quotes, themes)
5. Save to notes (searchable, taggable)

**Bonus:** Auto-tag by topic (AI categorization)

---

## 🏗️ Architecture

**Pipeline:**
```
URL → Audio Download → Whisper → Transcript → AI Summary → Notes
       (yt-dlp)        (OpenAI)              (Claude)       (Obsidian)
```

**Components:**

1. **URL Parser** - Detect source (YouTube/Spotify/Apple)
2. **Audio Downloader** - Extract audio file (`yt-dlp` or similar)
3. **Transcriber** - Whisper API or local model
4. **Summarizer** - AI-powered key insights extraction
5. **Note Creator** - Save to Obsidian/Notion with metadata

---

## 📋 Example Output

**Input:** `https://youtube.com/watch?v=abc123`  
**Output:** `memory/podcast-notes/2026-01-18-lex-friedman-elon-musk.md`

```markdown
# Lex Fridman #252: Elon Musk

**Published:** 2023-04-15  
**Duration:** 2h 30m  
**Source:** YouTube  
**Tags:** #ai #spacex #tesla #innovation

---

## 🎯 Key Insights

1. **AI Safety:** Elon discusses X.ai and alignment challenges
2. **Mars Timeline:** First crewed mission planned for 2029
3. **Manufacturing:** Importance of production over design

---

## 📝 Notable Quotes

> "The hardest part of any product is not designing it, it's manufacturing it at scale."

> "AI is both the biggest risk and biggest opportunity for humanity."

---

## 🧠 Summary

Discussion covered SpaceX progress, Tesla's AI strategy, and X.ai's approach to AGI alignment. Elon emphasized the importance of redundancy in space missions and the need for proactive AI regulation.

**Main Topics:**
- SpaceX Starship development
- Tesla Full Self-Driving v12
- X.ai's training approach
- Free speech on X (Twitter)

---

## 📎 Full Transcript

[Attached or linked if too long]

---

**Processed:** 2026-01-18 by Melflin 🧙‍♂️
```

---

## 🛠️ Implementation Plan

### **Week 6: Transcription Pipeline**

**Day 1-2: Audio Extraction**
- [ ] Test `yt-dlp` (YouTube downloads)
- [ ] Find solution for Spotify/Apple Podcasts (RSS feeds?)
- [ ] Build audio downloader module

**Day 3-4: Whisper Integration**
- [ ] Decide: Local Whisper vs OpenAI API?
  - Local: Free, but slow (needs GPU)
  - API: Fast, but costs $0.006/min ($7.20 for 2h podcast)
- [ ] Build transcription module
- [ ] Test with 3-5 different podcasts

**Day 5: Testing**
- [ ] End-to-end test (URL → transcript)
- [ ] Measure: Speed, accuracy, cost
- [ ] Optimize if needed

---

### **Week 7: AI Summary & Storage**

**Day 1-2: Summarization**
- [ ] Design summary prompts (key insights, quotes, topics)
- [ ] Build AI summarizer (Claude/GPT)
- [ ] Test with transcripts from Week 6

**Day 3-4: Note Storage**
- [ ] Create note template (markdown format above)
- [ ] Auto-save to Obsidian/memory folder
- [ ] Add metadata (date, source, tags)

**Day 5: Auto-Tagging**
- [ ] AI-based topic extraction
- [ ] Auto-tag by theme (AI, Business, Science, etc.)
- [ ] Link related notes

**Day 6-7: Polish & Publish**
- [ ] Error handling (unsupported URLs, API failures)
- [ ] README with examples
- [ ] GitHub publish

---

## ✅ Success Criteria

**Must Have:**
- Works with YouTube URLs (most common)
- Transcription accuracy >90%
- Summary captures key points (manually verified)
- Stefan uses it for real podcast consumption

**Nice to Have:**
- Spotify/Apple Podcasts support
- Speaker detection (who said what)
- Timestamp links (jump to specific moments)
- Auto-sharing to social (tweet key quotes?)

---

## 🚧 Challenges

**Challenge 1: Transcription cost**  
- 2h podcast = $7.20 via OpenAI API
- Stefan listens to ~5 podcasts/week = $36/week = $144/month
- *Mitigation:* Local Whisper (free but slower), or selective transcription (only requested podcasts)

**Challenge 2: Spotify/Apple Podcasts access**  
- No official APIs for downloading
- *Mitigation:* Use RSS feeds (if available), or start with YouTube-only

**Challenge 3: Transcript accuracy**  
- Music, background noise, accents can hurt accuracy
- *Mitigation:* Use best Whisper model, post-process with AI cleanup

---

## 💰 Cost Estimate (API-based)

**Per Podcast (2h):**
- Audio download: $0 (yt-dlp is free)
- Whisper API: $7.20 (2h × $0.006/min)
- AI Summary: ~$0.10 (Claude API)
- **Total:** ~$7.30 per podcast

**Monthly (5 podcasts/week):**
- ~20 podcasts/month
- **Total:** ~$146/month

**Mitigation:**
- Use local Whisper (free, but slower)
- Or: Offer as paid service ($10/podcast → profit!)

---

## 📚 Dependencies

**Tools:**
- `yt-dlp` (YouTube audio download)
- Whisper (OpenAI API or local)
- AI model (Claude/GPT for summary)
- Obsidian (or memory files)

**Skills:**
- Audio processing (ffmpeg?)
- Transcript parsing (JSON → text)
- AI prompting (summarization)

---

## 🔄 Future Ideas (v2)

- **Live Processing:** Upload audio file (not just URLs)
- **Speaker Diarization:** "Who said what" detection
- **Auto-Clips:** Extract best 30-second moments for social sharing
- **Podcast Search:** Search across all transcribed podcasts
- **Learning Integration:** Connect insights to existing notes (knowledge graph)

---

**Next:** Start implementation Week 6 (Feb 23)  
**First Decision:** Local Whisper or API? (cost vs speed tradeoff)
