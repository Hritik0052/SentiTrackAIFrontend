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
  size = 96,
}: {
  badge: Pick<UserBadge, "title" | "rarity" | "image_key" | "unlocked" | "description">
  size?: number
}) {
  const src = badgeImageSrc(badge.image_key)

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {src ? (
        <img
          src={src}
          alt={badge.title}
          width={size}
          height={size}
          className={`rounded-2xl object-cover shadow-sm ring-1 ring-slate-200/80 dark:ring-white/10 ${
            badge.unlocked ? "" : "opacity-45 grayscale"
          }`}
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 dark:bg-white/5"
          style={{ width: size, height: size }}
        >
          ?
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{badge.title}</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {badge.rarity}
          {!badge.unlocked ? " · Locked" : ""}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">{badge.description}</p>
      </div>
    </div>
  )
}
