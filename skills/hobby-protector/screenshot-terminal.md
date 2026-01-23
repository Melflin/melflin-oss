# Hobby Time Protector - Terminal Screenshot

```
$ node index.js status
📊 Hobby Time Protector Status

========================================

🎯 Lesen (Kultur)
   ⏱️  30 Min pro Session
   📈 Heute: 25 Seiten
   🏆 Gesamt: 25 Seiten

🎯 Laufen (Sport)
   ⏱️  45 Min pro Session
   📈 Heute: 5.2 km
   🏆 Gesamt: 5.2 km

🎯 Bonsai pflegen (Pflanzen)
   ⏱️  20 Min pro Session
   📈 Heute: 0 Aufgaben
   🏆 Gesamt: 0 Aufgaben

🎯 Gitarre (Musik)
   ⏱️  60 Min pro Session
   📈 Heute: 0 Minuten
   🏆 Gesamt: 0 Minuten

========================================
```

## Progress Tracking

```
$ node index.js progress "Laufen" --value 5.2
✅ Fortschritt für "Laufen": +5.2 (Heute: 5.2)

$ node index.js progress "Lesen" --value 25
✅ Fortschritt für "Lesen": +25 (Heute: 25 Seiten)
```

## Kalender Block

```
$ node index.js today
📅 Blockiere alle Hobbys für 2026-01-23:

✅ Kalender-Block erstellt: Lesen am 2026-01-23 (30 Min)
✅ Kalender-Block erstellt: Laufen am 2026-01-23 (45 Min)
✅ Kalender-Block erstellt: Bonsai pflegen am 2026-01-23 (20 Min)
✅ Kalender-Block erstellt: Gitarre am 2026-01-23 (60 Min)
```

---
*Screenshot erstellt: 2026-01-23 22:16*
