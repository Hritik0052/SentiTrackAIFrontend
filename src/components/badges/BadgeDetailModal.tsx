import { Lock, X } from "lucide-react"
import type { UserBadge } from "../../types/gamification"
import { badgeImageSrc } from "./ImageBadge"

export function BadgeDetailModal({
  badge,
  onClose,
}: {
  badge: UserBadge
  onClose: () => void
}) {
  const src = badgeImageSrc(badge.image_key)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-modal-title"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-md bg-white p-6 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {badge.rarity}
              {badge.unlocked ? " · Unlocked" : " · Locked"}
            </p>
            <h3 id="badge-modal-title" className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {badge.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="relative h-36 w-36">
            {src && (
              <img
                src={src}
                alt=""
                className={`h-full w-full rounded-3xl object-cover ${
                  badge.unlocked
                    ? "shadow-xl shadow-amber-500/30 ring-2 ring-amber-300/80"
                    : "grayscale opacity-60"
                }`}
              />
            )}
            {!badge.unlocked && (
              <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-950/40">
                <Lock className="h-8 w-8 text-white" />
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {badge.unlocked ? "How you earned it" : "How to unlock"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{badge.description}</p>
          {badge.unlocked && badge.unlocked_at && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Unlocked {new Date(badge.unlocked_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
