# Wahlomat

Ein interaktiver Wahlomat im Tinder-Stil, der es Nutzern ermöglicht, ihre politischen Positionen mit verschiedenen Parteien zu vergleichen.

## Features

- **Swipe-Mechanik**: Wische nach rechts für Zustimmung, nach links für Ablehnung
- **Touch-optimiert**: Optimiert für Smartphones, funktioniert auch auf Desktop
- **Tastatursteuerung**: Pfeiltasten und WASD für Desktop-Nutzer
- **Intro-Screens**: Optionale Einführungsbildschirme zur Erklärung der Bedienung
- **Parteienübersicht**: Übersicht aller Parteien/Kandidaten vor dem Start
- **Social-Media-Sharing**: Ergebnisse auf Twitter/X, Facebook, WhatsApp, Telegram teilen
- **Konfigurierbar**: Farben, Texte und Einstellungen über JSON-Datei anpassbar
- **JSON-Daten**: Parteien und Positionen werden aus JSON-Dateien geladen
- **Detaillierte Ergebnisse**: Übereinstimmung mit jeder Partei inkl. Aufschlüsselung

## Tastatursteuerung

| Taste | Aktion |
|-------|--------|
| `→` / `D` | Zustimmung |
| `←` / `A` | Ablehnung |
| `↓` / `S` / `Leertaste` | Neutral |
| `Enter` | Start / Ergebnisse anzeigen |
| `Esc` / `R` | Neustart (auf Ergebnisseite) |
| `P` | Parteienübersicht anzeigen (auf Startseite) |

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
| `showIntro` | Intro-Screens beim Start anzeigen |
| `showPartiesBeforeStart` | Button für Parteienübersicht auf Startseite |

#### Intro-Screens

Optionale Einführungsbildschirme können in der `intro`-Sektion konfiguriert werden:

```json
{
  "intro": {
    "enabled": true,
    "screens": [
      {
        "icon": "welcome",
        "title": "Willkommen",
        "text": "Erklärungstext..."
      }
    ]
  }
}
```

Verfügbare Icons: `welcome`, `how`, `swipe`, `info`

#### Social-Media-Sharing

```json
{
  "shareUrl": "https://example.com/wahlomat",
  "shareHashtags": "Wahlomat,Politik,Wahl2025"
}
```

| Schlüssel | Beschreibung |
|-----------|--------------|
| `shareUrl` | URL die beim Teilen verwendet wird |
| `shareHashtags` | Komma-getrennte Hashtags (ohne #) |

## Daten

a;Soziale Fortschrittspartei;SFP;#e11d48;sfp.svg;Die SFP setzt sich für...
b;Bürgerliche Mitte;BM;#0ea5e9;bm.svg;Die BM steht für...
### Parteien (public/data/parteien.json)

Format (JSON-Array):

```json
[
  {
    "id": "a",
    "name": "Soziale Fortschrittspartei",
    "kurzname": "SFP",
    "farbe": "#e11d48",
    "logo": "sfp.svg",
    "beschreibung": "Die SFP setzt sich für..."
  }
]
```

| Spalte | Beschreibung |
|--------|--------------|
| `id` | Eindeutige ID (a-z) |
| `name` | Vollständiger Name |
| `kurzname` | Abkürzung (max. 4 Zeichen) |
| `farbe` | Hex-Farbcode |
| `logo` | Dateiname des Logos (optional) |
| `beschreibung` | Kurzbeschreibung der Partei (optional, für Übersicht) |

### Positionen (public/data/positionen.json)

Format (JSON-Array):

```json
[
  {
    "id": "1",
    "these": "Die These hier...",
    "erklaerung": "Erklärung zur These",
    "positionen": {
      "a": 1,
      "b": -1,
      "c": 0
    },
    "erklaerungen": {
      "a": "Begründung A",
      "b": "Begründung B",
      "c": "Begründung C"
    }
  }
]
```

| Spalte | Beschreibung |
|--------|--------------|
| `id` | Eindeutige ID |
| `these` | Die These/Frage |
| `erklaerung` | Hintergrundinformation zur These |
| `positionen` | Objekt mit Partei-IDs als Schlüssel und Position (`1`, `0`, `-1`) als Wert |
| `erklaerungen` | Objekt mit Partei-IDs als Schlüssel und Begründung als Wert |

**Wichtig**: Die Schlüssel in `positionen` und `erklaerungen` müssen für jede Partei-ID existieren.

## Projektstruktur

```
wahlomat/
├── public/
│   ├── config.json          # Konfigurationsdatei
│   ├── favicon.svg          # Favicon
│   └── data/
│       ├── parteien.json    # Parteiendaten
│       └── positionen.json  # Thesen und Positionen
├── src/
│   ├── App.vue              # Hauptkomponente
│   ├── main.js              # Einstiegspunkt
│   ├── style.css            # Globale Styles
│   ├── components/
│   │   ├── IntroScreen.vue  # Einführungsbildschirme
│   │   ├── StartScreen.vue  # Startbildschirm
│   │   ├── PartiesOverview.vue # Parteienübersicht
│   │   ├── SwipeCard.vue    # Swipe-Karte
│   │   ├── ActionButtons.vue # Aktionsbuttons
│   │   ├── ProgressBar.vue  # Fortschrittsanzeige
│   │   ├── ResultsView.vue  # Ergebnisansicht
│   │   └── ShareButtons.vue # Social-Media-Teilen
│   └── composables/
│       ├── useConfig.js     # Konfiguration laden
│       └── useWahlomat.js   # Hauptlogik
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Eigene Inhalte erstellen

1. **Parteien definieren**: Bearbeite `public/data/parteien.json`
2. **Thesen erstellen**: Bearbeite `public/data/positionen.json`
3. **Design anpassen**: Bearbeite `public/config.json`
4. **Build erstellen**: `npm run build`
5. **Deployen**: `dist/`-Ordner auf Webserver hochladen

## Technologie

- **Vue 3** - Frontend-Framework
- **Vite** - Build-Tool
- **Vanilla CSS** - Styling (keine UI-Bibliothek)

## Lizenz

MIT
