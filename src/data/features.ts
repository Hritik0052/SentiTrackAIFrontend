import {
  BarChart3,
  BrainCircuit,
  CalendarRange,
  Lightbulb,
  NotebookPen,
  Search,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const FEATURES: Feature[] = [
  {
    icon: NotebookPen,
    title: "Effortless Journaling",
    description:
      "Capture your thoughts in a clean, distraction-free editor. Every entry is private and scoped to your account.",
  },
  {
    icon: BrainCircuit,
    title: "AI Mood Analysis",
    description:
      "One click analyzes an entry for sentiment, mood, and emotion — with a confidence score you can trust.",
  },
  {
    icon: CalendarRange,
    title: "Weekly Summaries",
    description:
      "Get an AI-written recap of your week plus gentle, actionable suggestions to keep your momentum going.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description:
      "Track streaks, sentiment distribution, and monthly trends through a warm, easy-to-read dashboard.",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Filter your history by keyword, date range, mood, emotion, or sentiment to rediscover past moments.",
  },
  {
    icon: Lightbulb,
    title: "Personal Insights",
    description:
      "Generate natural-language insights that surface patterns in your habits, moods, and reflections.",
  },
]
