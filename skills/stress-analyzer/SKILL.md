---
name: stress-analyzer
description: "Analysiert Kalender, Arbeitszeiten und Benachrichtigungen um Stress-Level zu berechnen und als ASCII-Chart anzuzeigen. Nutze für Fragen wie 'wie stressig war meine Woche', 'zeig mir meinen Stress-Trend' oder 'was ist mein aktueller Stress-Score'."
metadata:
  version: 1.0.0
  tags: ["health", "stress", "calendar", "productivity", "wellness"]
  clawdbot:
    mode:
      name: "Stress Coach"
      role: "Analysiert Stress-Level und gibt Empfehlungen"
      emoji: "📊"
      personality: |
        Ich bin dein digitaler Stress-Coach. Ich analysiere objektiv deine Kalenderdaten,
        Arbeitszeiten und Benachrichtigungsmuster, um dir einen klaren Überblick über
        dein Stress-Level zu geben. Ich zeige dir Trends, erkenne Muster und gebe
        praktische Tipps zur Stressreduktion - alles datenbasiert und ohne Moralismus.
    requires:
      bins: ["node", "accli"]
      npm: ["chalk"]
    install:
      - id: "stress-analyzer-install"
        kind: "skill"
        source: "clawdhub"
        slug: "melflin/stress-analyzer"
        label: "Install Stress Analyzer"
---

# Stress Pattern Analyzer Skill

Analysiert dein Stress-Level basierend auf Kalender, Arbeitszeiten und Benachrichtigungen.

## Usage

### CLI Commands

```bash
# Basis-Analyse
melflin-stress-analyzer analyze

# Wochenübersicht
melflin-stress-analyzer week

# Konfiguration
melflin-stress-analyzer config --set-work-hours 8
```

## Integration mit Clawdbot

Dieser Skill registriert sich als Clawdbot-Modus "Stress Coach". Wenn der Modus aktiviert ist:

1. **Datensammlung:** Ich greife auf deinen Apple Calendar zu (via accli)
2. **Analyse:** Berechne einen Stress-Score (0-100) aus 4 Faktoren
3. **Visualisierung:** Zeige ASCII-Charts direkt im Chat
4. **Empfehlungen:** Gebe praktische Tipps basierend auf deinen Daten

## Stress-Score Algorithmus

Der Score setzt sich zusammen aus:
- **Termindichte** (40%): Wie viele Events hast du pro Tag?
- **Arbeitszeit** (30%): Überschreitest du 8 Stunden?
- **Benachrichtigungen** (20%): Wie viele Ablenkungen pro Tag?
- **Kontinuität** (10): Gibt es Pausen zwischen Meetings?

## Konfiguration

Erstelle eine `.stress-analyzerrc` Datei:

```json
{
  "workHours": 8,
  "notificationsPerDay": 30,
  "calendar": "Work",
  "alertThreshold": 50
}
```

## Datenschutz

Alle Berechnungen finden lokal auf deinem Mac statt. Keine Daten werden extern gesendet.

---

*Version 1.0.0 | Teil von Melflin OSS*
