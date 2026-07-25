# SentiTrack AI

**A private, AI-powered journal that turns your daily reflections into mood insights, weekly summaries, and self-awareness.**

This repository is the **frontend** for SentiTrack AI — a React + TypeScript web app. It talks to a companion FastAPI backend for authentication, storage, and AI processing.

---

## What is it?

SentiTrack AI is a personal journaling app. You write freely, the same way you would in any journal — and each entry can be analyzed by AI for its **sentiment, mood, and emotion**. Over time, those signals become:

- **Weekly summaries** — a short AI-written recap of your week, with gentle suggestions
- **A dashboard** — streaks, sentiment trends, and your most common moods and emotions
- **Insights** — AI-noticed patterns across your journaling history (e.g. "your mood trends more positive after exercise")
- **Search** — find past entries by keyword, date, mood, emotion, or sentiment

It's not a mood tracker you fill in manually, and it's not a generic notes app — it's built specifically around the idea that the *writing itself* is the input, and the AI's job is to reflect patterns back to you, not to judge or rewrite what you wrote.

## Why does this exist?

Writing down how you feel is one of the simplest, most effective tools for mental clarity — but it's easy to lose the bigger picture. The slow shift from a good month to a hard one, the patterns behind your best weeks, the moods that show up right before you burn out — those are hard to notice one entry at a time. SentiTrack AI closes that gap by turning scattered daily entries into a picture you can actually see.

## Who is it for?

- Anyone who already journals, or wants to start, and is curious what their entries say about their patterns over time
- People who want lightweight, AI-assisted self-reflection without a heavyweight habit-tracking app
- Developers interested in a real, end-to-end example of an AI-integrated product — FastAPI backend, React frontend, JWT auth, and LLM-based sentiment analysis wired together

**Privacy note:** every journal entry, analysis, and insight is scoped to your account behind authentication. Nothing is shared between users, and the raw AI response is never stored or shown — only the structured result (sentiment, mood, emotion, confidence).

## Features

| Area | What you can do |
|---|---|
| **Account** | Register, log in, and manage your profile. Sessions use short-lived access tokens with automatic refresh. |
| **Journal** | Write, edit, and delete entries. Search and paginate your history. |
| **AI Analysis** | Run sentiment analysis on any entry — see its mood, emotion, sentiment, and confidence score. |
| **Weekly Summaries** | Generate an AI recap of any week, with entry count and suggestions. |
| **Dashboard** | Totals, streaks, sentiment breakdown, top moods/emotions, and monthly/yearly trend charts. |
| **Search** | Filter your journal by keyword, date range, mood, emotion, or sentiment. |
| **Insights** | Generate AI-noticed patterns across your whole journaling history. |
| **Everywhere** | Light/dark mode, responsive layout, loading and empty states for every AI call (they can take a few seconds). |

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Routing | React Router |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Animation | Framer Motion |
| HTTP | Axios, with a normalized `{ error: { type, detail } }` handler and silent token refresh |
| Icons | lucide-react |
| Notifications | react-hot-toast |

## Getting started

You'll need a running instance of the companion SentiTrack AI backend (FastAPI) — either locally or deployed — since this app has no functionality without it.

```bash
git clone https://github.com/Hritik0052/SentiTrackAIFrontend.git
cd SentiTrackAIFrontend
npm install

cp .env.example .env
# then edit .env — set VITE_API_ROOT_URL to your backend's URL

npm run dev
```

The app runs at `http://localhost:5173` by default. See `.env.example` for every configurable value (API URL, request timeout, health-check polling, contact email).

### Other scripts

```bash
npm run build     # type-check + production build
npm run lint       # ESLint
npm run preview    # preview the production build locally
```

## Project status

All core areas are implemented end-to-end: public marketing pages, authentication, the journal experience with AI sentiment analysis, the analytics dashboard, weekly summaries, search, and insights. Ongoing work includes deployment, automated tests, and general polish.

## Contributing

This is currently a solo project and not yet set up for external contributions, but issues and suggestions are welcome.
