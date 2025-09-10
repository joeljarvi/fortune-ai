 <!-- README.md -->
<!-- 10:29
# :crystal_ball: Spådamen
Låt stjärnorna och kristallkulan guida dig! Ett interaktivt AI-chatprojekt där du kan ställa frågor och få svar från en AI “Spådamen” medan en stjärnhimmel animeras i bakgrunden.
## :rocket: Funktioner
- Vacker stjärnhimmel med blinkande stjärnor.
- AI-driven chatt med Google Gemini 2.5.
- Enkel startknapp för att öppna chatten.
- TypeScript-typer för säkerhet och robusthet.
## :computer: Installation
1. Klona projektet:
```bash -->

# git clone <repo-url>

# cd <repo>

# installera beroenden

# npm install

# Skapa en .env-fil med din Google API-nyckel

# GOOGLE_API_KEY=din_google_api_key

# Starta utvecklingsservern

# npm run dev

# Testa typer

# npx tsc --noEmit

# npm run test

# testa AI-funktionen

# node demo.js

# Klicka på Starta.

# Skriv din fråga i chatten.

# Få AI-svaret direkt i gränssnittet.

# Teknologier

# Next.js 13+ (App Router)

# React + TypeScript

# Tailwind CSS

# Google Gemini AI

## 🃏 Tarot

Ett litet tarotspel med animationer och kortblandning.

### Funktioner

- Startskärm med titel och instruktion.
- Knapp för att “blanda korten” (simulerad loading).
- Spelskärm som renderar `<CardBrowser />`.
- Hantering av loading-state.

### Användning

1. Klicka på **Sätt igång** för att blanda korten.
2. Efter ~1.8 sekunder visas korten via `<CardBrowser />`.

### Testa typer

TypeScript säkerställer att state (`startGame` och `loading`) alltid är booleans.

### Demo

Kör demo-scriptet i terminalen för att se logikflödet utan UI:

```bash
node demo-tarot.js



## 🔮 Kristallkula

Visualiserar spel-/AI-state med animationer och glow-effekter.

### Props
| Prop  | Typ | Beskrivning |
|-------|-----|-------------|
| state | "idle" | Vänteläge, subtil glow |
|       | "loading" | Pulserande glow under laddning |
|       | "answered" | Visar resultat med stark glow |

### Animationer
- Skalar upp/ned vid `loading`.
- Box-shadow ändras med state.
- Subtil roterande gradient i `idle`.
- Sparkles-ikon med färgändring.

## 🃏 Kortlek – CardBrowser

- Renderar 22 kort som kan flipas.
- Smooth scroll med Lenis.
- AI-genererade tarot-meddelanden visas när kort dras.
- Progress-bar längst ner visar scroll-position.
- State:
  - `messages: string[]`
  - `loading: boolean`

### Användning
1. Skrolla genom kortleken.
2. Klicka på ett kort för att dra ett tarotkort.
3. AI-svar visas högst upp. Klicka igen för att dölja kortet.
```
