import bronzeStreakPng from "../../assets/badges/generated/bronze-streak.png"
import goldJournalPng from "../../assets/badges/generated/gold-journal.png"
import platinumInsightPng from "../../assets/badges/generated/platinum-insight.png"
import bronzeStarPng from "../../assets/badges/generated/bronze-star.png"
import bronzeJournalV2Png from "../../assets/badges/generated/bronze-journal-v2.png"
import silverCalendarPng from "../../assets/badges/generated/silver-calendar.png"
import silverSearchPng from "../../assets/badges/generated/silver-search.png"
import goldStarburstPng from "../../assets/badges/generated/gold-starburst.png"
import goldFlamePng from "../../assets/badges/generated/gold-flame.png"
import platinumStarsCrownPng from "../../assets/badges/generated/platinum-stars-crown.png"
import platinumLaurelPng from "../../assets/badges/generated/platinum-laurel.png"
import { Lock } from "lucide-react"
import type { UserBadge } from "../../types/gamification"

const BADGE_IMAGES: Record<string, string> = {
  "bronze-streak": bronzeStreakPng,
  "bronze-star": bronzeStarPng,
  "bronze-journal-v2": bronzeJournalV2Png,
  "silver-calendar": silverCalendarPng,
  "silver-search": silverSearchPng,
  "gold-journal": goldJournalPng,
  "gold-starburst": goldStarburstPng,
  "gold-flame": goldFlamePng,
  "platinum-insight": platinumInsightPng,
  "platinum-stars-crown": platinumStarsCrownPng,
  "platinum-laurel": platinumLaurelPng,
}

export function badgeImageSrc(imageKey: string): string | undefined {
  return BADGE_IMAGES[imageKey]
}

export function ImageBadge({
  badge,
  size = 104,
  onClick,
  showDescription = false,
}: {
  badge: Pick<UserBadge, "title" | "rarity" | "image_key" | "unlocked" | "description">
  size?: number
  onClick?: () => void
  showDescription?: boolean
}) {
  const src = badgeImageSrc(badge.image_key)
  const interactive = Boolean(onClick)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={`group flex flex-col items-center gap-2.5 text-center ${
        interactive ? "focus-ring cursor-pointer rounded-2xl p-2 transition hover:-translate-y-0.5" : "cursor-default"
      }`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {src ? (
          <img
            src={src}
            alt={badge.title}
            width={size}
            height={size}
            className={`h-full w-full rounded-2xl object-cover transition ${
              badge.unlocked
                ? "shadow-lg shadow-amber-500/25 ring-2 ring-amber-300/70 brightness-105 contrast-105 dark:ring-amber-400/40"
                : "grayscale contrast-75 brightness-75 opacity-55 ring-1 ring-slate-300/80 dark:ring-white/10"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 dark:bg-white/5">
            ?
          </div>
        )}
        {badge.unlocked ? (
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/25 via-transparent to-amber-200/20" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/35">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-md">
              <Lock className="h-4 w-4" />
            </span>
          </span>
        )}
      </div>
      <div>
        <p
          className={`text-xs font-semibold ${
            badge.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {badge.title}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {badge.rarity}
        </p>
        {showDescription && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {badge.description}
          </p>
        )}
      </div>
    </button>
  )
}
