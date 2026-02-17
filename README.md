# CLONEO

**Clone yourself as an AI creator** - Die Plattform fur Creator, Influencer und Coaches, die mehr Zeit wollen.

## Was ist CLONEO?

CLONEO erstellt ein virtuelles Ich (KI-Avatar) von dir, das taglich Content fur Instagram Reels, TikTok und X/Twitter erstellt. Du musst nur noch reviewen und freigeben.

## Die Maschinerie

```
1. CREATOR ONBOARDING
   - Coach/Influencer/Unternehmer registriert sich
   - Avatar erstellen (Videos/Bilder hochladen)
   - Persona definieren (Bio, Stil, Themen, Catchphrases)

2. AI CONTENT ENGINE
   - OpenAI GPT-4o generiert Scripts basierend auf Persona
   - ElevenLabs klont die Stimme des Creators
   - Kling 3.0 generiert 4K Videos mit Avatar

3. CONTENT PIPELINE
   - Scripts werden automatisch generiert
   - Creator reviewed & approved im Content Studio
   - Content wird auf Plattformen veroffentlicht

4. SOCIAL PUBLISHING
   - Instagram Reels, TikTok, X/Twitter
   - Scheduling & Autopilot (in Entwicklung)
```

## Features

### Implementiert
- Auth (Email OTP Login/Signup)
- Avatar-Erstellung mit DB-Persistenz
- Persona-System (Bio, Themen, Stil, Catchphrases, Zielgruppe)
- AI Persona-Analyse aus bestehenden Inhalten (GPT-4o)
- AI Script-Generation (GPT-4o) - personalisiert nach Persona
- **Voice Cloning Pipeline (NEU):**
  - Video hochladen -> FFmpeg extrahiert Audio -> ElevenLabs klont Stimme (automatisch)
  - Browser-Stimmaufnahme als Alternative (MediaRecorder API)
  - Onboarding integriert: Ein Schritt fur Avatar + Stimme
- **Automatische Content-Pipeline mit Stimme (NEU):**
  - Script-Generierung -> TTS Voiceover mit geklonter Stimme -> Video-Generierung -> Auto Lip-Sync
  - Audio wird als MP3 gespeichert und uber /api/uploads/audio/ bereitgestellt
- Kling 3.0 Video-Generation Service (Text2Video, Image2Video, LipSync)
- Content Studio mit echten Backend-Daten
- Content Workflow: Generate -> Review -> Approve/Reject
- Dashboard mit Live-Statistiken
- Publishing-Infrastruktur (bereit fur echte API-Integration)

### In Entwicklung
- Social Media OAuth (Instagram, TikTok, X)
- Autopilot Mode
- YouTube Shorts & LinkedIn Posts

## Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS + shadcn/ui
- TypeScript
- React Query

**Backend:**
- Bun + Hono
- Prisma + SQLite
- Better Auth
- Zod Validation

**AI Services:**
- OpenAI GPT-4o (Script-Generation + Persona-Analyse)
- ElevenLabs (Voice Clone + Text-to-Speech)
- Kling 3.0 (Video-Generation, Image2Video, LipSync)

## Projektstruktur

```
/webapp                    - React Frontend (Port 8000)
  /src/pages/              - Seiten (Dashboard, Onboarding, Studio)
  /src/components/         - UI Components
  /src/components/voice/   - VoiceRecorder (Browser-Aufnahme)
  /src/hooks/              - React Query Hooks (use-content, use-video, use-persona, use-avatar, use-voice)
  /src/lib/                - API Client, Types, Utils

/backend                   - Hono API Server (Port 3000)
  /prisma/                 - Database Schema
  /src/services/           - AI Services (OpenAI, ElevenLabs, Kling, AudioExtractor)
  /src/routes/             - API Routes
  /src/types.ts            - Shared Zod Schemas
  /uploads/audio/          - Generated TTS audio files
```

## API Routes

### Onboarding
- `POST /api/avatars` - Avatar erstellen
- `POST /api/avatars/:id/media` - Training-Material hochladen
- `POST /api/personas` - Persona erstellen/aktualisieren
- `GET /api/users/me/onboarding-status` - Onboarding-Status
- `POST /api/analyze/persona` - AI Persona-Analyse aus Inhalten

### Content Generation
- `POST /api/generate` - AI Content generieren (OpenAI GPT-4o)
  - Mit `generateVideo: true` wird automatisch Kling Video-Generierung gestartet
- `GET /api/generated-content` - Alle Contents abrufen (mit Filtern)
- `POST /api/generated-content/:id/approve` - Content freigeben
- `POST /api/generated-content/:id/reject` - Content ablehnen
- `DELETE /api/generated-content/:id` - Content loschen
- `GET /api/stats/content` - Content-Statistiken

### Video Generation (Kling 3.0)
- `POST /api/video/text2video` - Video aus Text generieren
- `POST /api/video/image2video` - Video aus Bild generieren
- `GET /api/video/status/:taskId` - Video-Status prufen
- `POST /api/video/check-content/:contentId` - Video-Status fur GeneratedContent prufen & DB updaten
- `POST /api/video/lip-sync` - LipSync auf Video anwenden

### Voice (ElevenLabs)
- `POST /api/voice/clone-from-media` - Stimme aus Video/Audio klonen (automatische Audio-Extraktion)
- `GET /api/voice/status` - Voice-Clone-Status des Users abrufen
- `POST /api/voice` - Stimme klonen (legacy, direkt Audio)
- `GET /api/voice` - Verfugbare Stimmen
- `POST /api/voice/tts` - Text-to-Speech

### Uploads
- `GET /api/uploads/audio/:filename` - Audio-Dateien abrufen (TTS Voiceover)

### Publishing
- `POST /api/publish/:id` - Content veroffentlichen

## Preise

- **Starter:** $99/Monat - 15 Videos
- **Creator:** $199/Monat - 30 Videos + X Posts
- **Pro:** $299/Monat - Unlimited + Priority

---

(c) 2026 CLONEO
