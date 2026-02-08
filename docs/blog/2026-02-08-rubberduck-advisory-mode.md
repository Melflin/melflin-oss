---
layout: default
title: "🦆 Rubberduck+ Advisory Mode"
description: "6 AI-Personas debattieren deine Fragen aus verschiedenen Perspektiven"
---

# 🦆 Rubberduck+ Advisory Mode

*8. Februar 2026*

---

## Das Problem

Kennst du das? Du hast eine wichtige Entscheidung zu treffen, aber dein Gehirn dreht sich im Kreis. Du brauchst jemanden zum Reden — aber nicht nur einen Ja-Sager.

**Rubber Duck Debugging** ist eine bekannte Technik: Erkläre dein Problem einer Gummiente, und oft findest du die Lösung selbst.

Aber was, wenn die Ente **zurückspricht**? Und zwar aus **6 verschiedenen Perspektiven**?

---

## Die Lösung: Advisory Mode

Wenn du eine Frage mit `Advisory:` beginnst, passiert Magie:

```
Advisory: Soll ich meinen Job kündigen und ein Startup gründen?
```

Statt einer Antwort bekommst du eine **strukturierte Debatte** von 6 Personas:

<div class="personas-showcase">

### 🔴 KRITIKOS — Der Devil's Advocate
*"Was könnte schiefgehen?"*

Kritikos sucht aktiv nach Schwachstellen. Er ist nicht negativ — er ist **gründlich**. Jede gute Idee muss seinen Test bestehen.

---

### 🟡 AURORA — Die Optimistin
*"Was wäre das beste Szenario?"*

Aurora sieht Potenzial wo andere Probleme sehen. Sie fragt: "Was wenn es funktioniert?" und malt das Zielbild.

---

### 🟢 PRAGMA — Der Pragmatiker
*"Was ist der nächste konkrete Schritt?"*

Pragma interessiert sich nicht für Theorie. Er will wissen: Was kannst du **morgen** tun? Mit welchen **Ressourcen**?

---

### 🔵 SENTINEL — Der Risiko-Analyst
*"Welche Risiken müssen wir managen?"*

Sentinel quantifiziert Risiken. Nicht um abzuschrecken, sondern um **vorbereitet** zu sein. Plan B, C und D.

---

### 🟣 FELIX — Die Wild Card
*"Was wäre die verrückteste Option?"*

Felix denkt lateral. Er bringt Perspektiven ein, die niemand erwartet hat. Manchmal Quatsch, manchmal Gold.

---

### ⚫ ADVOCATUS — Der Synthesizer
*"Was empfehle ich nach allem?"*

Advocatus hört allen zu, gewichtet die Argumente, und gibt eine **finale Empfehlung** mit Confidence-Level.

</div>

---

## Beispiel-Output

**Frage:** `Advisory: Soll ich meinen Job kündigen?`

> **🔴 KRITIKOS:** "Finanzielle Runway? Gesundheitsversicherung? Was wenn das Startup scheitert?"
>
> **🟡 AURORA:** "Stell dir vor, in 2 Jahren bist du dein eigener Chef mit einem Team..."
>
> **🟢 PRAGMA:** "Erst 6 Monate Runway aufbauen. Nebenher MVP testen. Dann entscheiden."
>
> **🔵 SENTINEL:** "Risiko-Matrix: Finanziell hoch, aber zeitlich begrenzt. Reputation: neutral..."
>
> **🟣 FELIX:** "Was wenn du beides machst? 80% Job, 20% Startup für 6 Monate?"
>
> **⚫ ADVOCATUS:** "Empfehlung: Noch nicht kündigen. Erst MVP validieren. Confidence: 78%"

---

## Warum funktioniert das?

### 1. Forced Perspektivenwechsel
Dein Gehirn denkt normalerweise in **einer** Richtung. Advisory Mode zwingt dich, alle Winkel zu betrachten.

### 2. Externalisierung
Gedanken im Kopf drehen sich. Gedanken auf Papier (oder Bildschirm) können analysiert werden.

### 3. Strukturierte Debatte
Statt chaotischem Hin-und-Her bekommst du **sequenzielle**, **geordnete** Argumente.

### 4. Finale Synthese
Am Ende steht nicht "es kommt drauf an", sondern eine **konkrete Empfehlung**.

---

## Wann nutzen?

✅ **Karriere-Entscheidungen** — Job wechseln? Beförderung annehmen?  
✅ **Grosse Käufe** — Haus? Auto? Investment?  
✅ **Beziehungsfragen** — Schwierige Gespräche vorbereiten  
✅ **Projekt-Starts** — Soll ich X bauen? Lohnt sich Y?  
✅ **Strategische Planung** — Wohin entwickeln wir uns?

---

## Limitationen

Ehrlich gesagt:

- **Keine echten Menschen.** Die Personas sind Konstrukte, nicht echte Berater.
- **Bias möglich.** Das zugrundeliegende Model hat Limitationen.
- **Keine Garantie.** Die "Empfehlung" ist ein Denkanstoß, keine Lebensberatung.

Aber als **Denk-Tool**? Absolut wertvoll.

---

## Try it

Wenn du [OpenClaw](https://openclaw.ai) nutzt, kannst du den Advisory Mode selbst einrichten. Der Skill basiert auf strukturierten Prompts für jede Persona.

Oder schreib mir — ich teile gerne die Details.

---

<div style="text-align: center; margin: 3rem 0;">
  <a href="../index.html" class="cta-button">← Zurück zur Startseite</a>
</div>

<style>
.personas-showcase {
  margin: 2rem 0;
}

.personas-showcase h3 {
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 10px 10px 0 0;
  border-left: 4px solid;
}

.personas-showcase h3:nth-of-type(1) { border-color: #ef4444; }
.personas-showcase h3:nth-of-type(2) { border-color: #eab308; }
.personas-showcase h3:nth-of-type(3) { border-color: #22c55e; }
.personas-showcase h3:nth-of-type(4) { border-color: #3b82f6; }
.personas-showcase h3:nth-of-type(5) { border-color: #a855f7; }
.personas-showcase h3:nth-of-type(6) { border-color: #1f2937; }

.personas-showcase h3 + p {
  font-style: italic;
  color: #4a5568;
  margin-top: 0;
}

blockquote {
  background: #f7fafc;
  border-left: 4px solid #667eea;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 10px 10px 0;
}

blockquote strong {
  display: block;
  margin-bottom: 0.5rem;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  color: white;
}
</style>
