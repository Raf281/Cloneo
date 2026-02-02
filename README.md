# CLONEO

**Clone yourself as an AI creator** - Die Plattform für Creator, Influencer und Coaches, die mehr Zeit wollen.

## Was ist CLONEO?

CLONEO erstellt ein virtuelles Ich (KI-Avatar) von dir, das täglich Content für Instagram Reels, TikTok und X/Twitter erstellt. Du musst nur noch reviewen und freigeben.

## Die Maschinerie

```
1. CREATOR ONBOARDING
   └── Coach/Influencer/Unternehmer registriert sich

2. VIRTUELLES ICH ERSTELLEN
   └── KI-Avatar aus Videos/Bildern (Gesicht + Stimme)

3. PERSONA DATABASE
   └── Lernt aus bestehenden Beiträgen:
       - Wer bist du?
       - Was machst du?
       - Worüber sprichst du?
       - Wie ist dein Stil?

4. CONTENT PRODUKTION
   └── Tägliche Videos/Posts mit KI-Avatar
       (Review & Approve Workflow)
```

## Features

### MVP (Aktuell)
- ✅ Avatar-Erstellung aus Videos/Bildern
- ✅ Persona-Lernsystem
- ✅ Content Studio mit Review & Approve
- ✅ Instagram Reels & TikTok Videos
- ✅ X/Twitter Text-Posts
- ✅ Content-Kalender
- ⏳ Autopilot Mode (in Entwicklung)

### Roadmap
- 🔜 Full Autopilot Mode
- 🔜 YouTube Shorts
- 🔜 LinkedIn Posts

## Tech Stack

**Frontend:**
- React + Vite
- TailwindCSS + shadcn/ui
- TypeScript

**Backend:**
- Bun + Hono
- Prisma + SQLite
- Better Auth

**AI/Video (geplant):**
- HeyGen für Video-Avatare
- ElevenLabs für Voice Clone
- OpenAI/Claude für Script-Generierung

## Projektstruktur

```
/webapp           - React Frontend (Port 8000)
/backend          - Hono API Server (Port 3000)
  /prisma         - Database Schema
  /src/routes     - API Routes
  /src/types.ts   - Shared Zod Schemas
```

## API Routes

### Onboarding
- `POST /api/avatars` - Avatar erstellen
- `POST /api/avatars/:id/media` - Training-Material hochladen
- `POST /api/personas` - Persona erstellen/aktualisieren
- `GET /api/users/me/onboarding-status` - Onboarding-Status

### Content
- `GET /api/generated-content` - Alle Contents abrufen
- `POST /api/generate` - Neuen Content generieren
- `POST /api/generated-content/:id/approve` - Content freigeben
- `POST /api/generated-content/:id/reject` - Content ablehnen
- `GET /api/stats/content` - Content-Statistiken

## Preise

- **Starter:** $99/Monat - 15 Videos
- **Creator:** $199/Monat - 30 Videos + X Posts
- **Pro:** $299/Monat - Unlimited + Priority

---

© 2026 CLONEO
