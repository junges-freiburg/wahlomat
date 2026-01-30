# Wahlomat

Ein interaktiver Wahlomat im Tinder-Stil, der es Nutzern ermöglicht, ihre politischen Positionen mit verschiedenen Parteien zu vergleichen.

## Features

- **Swipe-Mechanik**: Wische nach rechts für Zustimmung, nach links für Ablehnung
- **Touch-optimiert**: Optimiert für Smartphones, funktioniert auch auf Desktop
- **Tastatursteuerung**: Pfeiltasten und WASD für Desktop-Nutzer
- **Konfigurierbar**: Farben, Texte und Einstellungen über JSON-Datei anpassbar
- **CSV-basiert**: Parteien und Positionen werden aus CSV-Dateien geladen
- **Detaillierte Ergebnisse**: Übereinstimmung mit jeder Partei inkl. Aufschlüsselung

## Tastatursteuerung

| Taste | Aktion |
|-------|--------|
| `→` / `D` | Zustimmung |
| `←` / `A` | Ablehnung |
| `↓` / `S` / `Leertaste` | Neutral |
| `Enter` | Start / Ergebnisse anzeigen |
| `Esc` / `R` | Neustart (auf Ergebnisseite) |

## Schnellstart

### Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Produktion

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

Der Build wird im `dist/`-Ordner erstellt und kann direkt auf einen Webserver hochgeladen werden.

## Deployment

### GitHub Pages (automatisch)

Das Repository enthält eine GitHub Action, die bei jedem Push auf `main` automatisch deployt:

1. Repository auf GitHub pushen
2. In den Repository-Einstellungen unter **Settings > Pages**:
   - Source: **GitHub Actions** auswählen
3. Die Action läuft automatisch und deployt auf `https://<username>.github.io/wahlomat/`

### Manuelles Deployment

Nach dem Build (`npm run build`) kann der gesamte Inhalt des `dist/`-Ordners auf einen beliebigen statischen Webserver kopiert werden:

- Apache / Nginx
- Netlify
- Vercel
- AWS S3

Keine serverseitige Logik erforderlich - es handelt sich um eine reine Frontend-Anwendung.

## Konfiguration

### config.json

Die Datei `public/config.json` enthält alle anpassbaren Einstellungen:

```json
{
  "appTitle": "Wahlomat",
  "appSubtitle": "Finde deine politische Übereinstimmung",
  "colors": {
    "primary": "#6366f1",
    "secondary": "#8b5cf6",
    "agree": "#22c55e",
    "disagree": "#ef4444",
    "neutral": "#f59e0b",
    "background": "#0f172a",
    "cardBackground": "#1e293b",
    "textPrimary": "#f8fafc",
    "textSecondary": "#94a3b8"
  },
  "texts": {
    "startButton": "Los geht's",
    "agreeButton": "Stimme zu",
    "disagreeButton": "Stimme nicht zu",
    ...
  },
  "settings": {
    "showPartyLogos": true,
    "showExplanations": true,
    "enableSwipeGestures": true,
    "cardAnimationDuration": 300
  }
}
```

#### Farben

| Schlüssel | Beschreibung |
|-----------|--------------|
| `primary` | Hauptfarbe (Buttons, Akzente) |
| `secondary` | Sekundärfarbe (Gradienten) |
| `agree` | Farbe für Zustimmung |
| `disagree` | Farbe für Ablehnung |
| `neutral` | Farbe für neutrale Antworten |
| `background` | Hintergrundfarbe |
| `cardBackground` | Hintergrundfarbe der Karten |
| `textPrimary` | Haupttextfarbe |
| `textSecondary` | Sekundäre Textfarbe |

#### Texte

Alle UI-Texte können in der `texts`-Sektion angepasst werden.

#### Einstellungen

| Schlüssel | Beschreibung |
|-----------|--------------|
| `showPartyLogos` | Partei-Logos anzeigen |
| `showExplanations` | Erklärungen zu Thesen anzeigen |
| `enableSwipeGestures` | Swipe-Gesten aktivieren |
| `cardAnimationDuration` | Animationsdauer in ms |

## Daten

### Parteien (public/data/parteien.csv)

Format (Semikolon-getrennt):

```csv
id;name;kurzname;farbe;logo
a;Soziale Fortschrittspartei;SFP;#e11d48;sfp.svg
b;Bürgerliche Mitte;BM;#0ea5e9;bm.svg
```

| Spalte | Beschreibung |
|--------|--------------|
| `id` | Eindeutige ID (a-z) |
| `name` | Vollständiger Name |
| `kurzname` | Abkürzung (max. 4 Zeichen) |
| `farbe` | Hex-Farbcode |
| `logo` | Dateiname des Logos (optional) |

### Positionen (public/data/positionen.csv)

Format (Semikolon-getrennt):

```csv
id;these;erklaerung;partei_a;partei_b;partei_c;erklaerung_a;erklaerung_b;erklaerung_c
1;Die These hier...;Erklärung zur These;1;-1;0;Begründung A;Begründung B;Begründung C
```

| Spalte | Beschreibung |
|--------|--------------|
| `id` | Eindeutige ID |
| `these` | Die These/Frage |
| `erklaerung` | Hintergrundinformation zur These |
| `partei_X` | Position der Partei: `1` (Zustimmung), `-1` (Ablehnung), `0` (Neutral) |
| `erklaerung_X` | Begründung der Partei für ihre Position |

**Wichtig**: Die Spalten `partei_X` und `erklaerung_X` müssen für jede Partei-ID existieren (z.B. `partei_a`, `partei_b`, `erklaerung_a`, `erklaerung_b`).

## Projektstruktur

```
wahlomat/
├── public/
│   ├── config.json          # Konfigurationsdatei
│   ├── favicon.svg          # Favicon
│   └── data/
│       ├── parteien.csv     # Parteiendaten
│       └── positionen.csv   # Thesen und Positionen
├── src/
│   ├── App.vue              # Hauptkomponente
│   ├── main.js              # Einstiegspunkt
│   ├── style.css            # Globale Styles
│   ├── components/
│   │   ├── StartScreen.vue  # Startbildschirm
│   │   ├── SwipeCard.vue    # Swipe-Karte
│   │   ├── ActionButtons.vue # Aktionsbuttons
│   │   ├── ProgressBar.vue  # Fortschrittsanzeige
│   │   └── ResultsView.vue  # Ergebnisansicht
│   └── composables/
│       ├── useConfig.js     # Konfiguration laden
│       ├── useCSV.js        # CSV-Parser
│       └── useWahlomat.js   # Hauptlogik
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Eigene Inhalte erstellen

1. **Parteien definieren**: Bearbeite `public/data/parteien.csv`
2. **Thesen erstellen**: Bearbeite `public/data/positionen.csv`
3. **Design anpassen**: Bearbeite `public/config.json`
4. **Build erstellen**: `npm run build`
5. **Deployen**: `dist/`-Ordner auf Webserver hochladen

## Technologie

- **Vue 3** - Frontend-Framework
- **Vite** - Build-Tool
- **Vanilla CSS** - Styling (keine UI-Bibliothek)

## Lizenz

MIT
