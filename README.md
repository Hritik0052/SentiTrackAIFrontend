# SentiTrack AI

**A private, AI-powered journal that turns your daily reflections into mood insights, weekly summaries, achievements, and self-awareness.**

This repository is the **frontend** for SentiTrack AI — a React + TypeScript web app. It talks to a companion FastAPI backend for authentication, storage, AI processing, Excel export, and gamification.

---

## What is it?

SentiTrack AI is a personal journaling app. You write freely — and each entry can be analyzed by AI for **sentiment, mood, and emotion**. Over time, those signals become:

- **Weekly summaries** — a short AI-written recap of your week, with gentle suggestions
- **A dashboard** — streaks, sentiment splits, ranked moods/emotions, and multi-line mood trends
- **Insights** — AI-noticed patterns across your journaling history
- **Search** — find past entries by keyword, date, mood, emotion, or sentiment
- **Excel export** — download journals, weekly summaries, or a monthly rollup
- **Achievements** — soft streaks with freeze tokens, XP/levels, medal badges, and weekly challenges

It's not a mood tracker you fill in manually — the *writing itself* is the input, and the AI reflects patterns back to you.

## Features

| Area | What you can do |
|---|---|
| **Account** | Register, log in, and manage your profile. Sessions use short-lived access tokens with automatic refresh. |
| **Journal** | Write, edit, and delete entries. Search and paginate your history. |
| **AI Analysis** | Run sentiment analysis on any entry — mood, emotion, sentiment, and confidence. |
| **Weekly Summaries** | Generate an AI recap of any week, with suggestions. Export summaries to Excel. |
| **Dashboard** | Totals, streaks, sentiment breakdown, top moods/emotions, monthly columns, yearly table, and **week/month multi-line mood trends** (Recharts). Export the current month. |
| **Search** | Filter by keyword, date range, mood, emotion, or sentiment. |
| **Insights** | Generate AI-noticed patterns across your journaling history. |
| **Profile** | Account settings plus **progress analytics**: level/XP, streak & freezes, challenge summary, and **unlocked badges only**. |
| **Achievements** | Full badge wall (glossy unlocked / greyscale locked), weekly challenges, tap a badge for a task modal. |
| **Plan usage** | Profile + Dashboard show plan quotas (journals, analyze, summaries, insights). Limit errors toast clearly. |
| **Admin** | `/admin` overview, plans CRUD, user plan assignment (`is_admin` only). |
| **Everywhere** | Light/dark mode, responsive layout, loading and empty states for AI calls. |

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Routing | React Router |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Charts | Recharts (mood trend lines / emotion areas) |
| Animation | Framer Motion |
| HTTP | Axios (`responseType: 'blob'` for Excel downloads) |
| Icons | lucide-react |
| Notifications | react-hot-toast |
| Badge art | Generated PNG medals in `src/assets/badges/generated/` |

## App routes (authenticated)

| Path | Page |
|---|---|
| `/app/journals` | Journal list |
| `/app/journals/new` | New entry |
| `/app/dashboard` | Analytics + mood trends + export |
| `/app/summaries` | Weekly summaries + Excel export |
| `/app/search` | Advanced search |
| `/app/insights` | AI insights |
| `/app/profile` | Profile + unlocked badges / progress |
| `/app/achievements` | Full achievements board |

## Getting started

You'll need a running SentiTrack AI backend (FastAPI) — local or deployed.

```bash
git clone https://github.com/Hritik0052/SentiTrackAIFrontend.git
cd SentiTrackAIFrontend
npm install

cp .env.example .env
# set VITE_API_ROOT_URL to your backend URL

npm run dev
```

The app runs at `http://localhost:5173` by default. See `.env.example` for every configurable value.

### Other scripts

```bash
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # preview the production build locally
```

## Backend API used for newer features

Base: `{VITE_API_ROOT_URL}/api/v1` (see your env).

| Feature | Endpoints |
|---|---|
| Mood trends | `GET /analytics/mood-trends`, `GET /analytics/mood-trends/compare` |
| Excel export | `GET /export/journals`, `/export/weekly-summaries`, `/export/monthly-summary` |
| Gamification | `GET /gamification/streaks`, `/xp`, `/badges`, `/challenges` |

Badge `image_key` values from the API map to files under `src/assets/badges/generated/`.

## Project status

Core product plus **mood trends**, **Excel export**, and **gamification UI** are implemented end-to-end against the companion backend. Ongoing work may include more challenges, notifications, and polish.

## Contributing

This is currently a solo project and not yet set up for external contributions, but issues and suggestions are welcome.
