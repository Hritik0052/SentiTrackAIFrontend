export function GradientBlobs({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute -left-24 top-0 h-72 w-72 animate-blob rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-500/20" />
      <div className="absolute -right-24 top-40 h-80 w-80 animate-blob rounded-full bg-accent-400/30 blur-3xl [animation-delay:4s] dark:bg-accent-500/20" />
      <div className="absolute left-1/3 top-72 h-64 w-64 animate-blob rounded-full bg-brand-300/20 blur-3xl [animation-delay:8s] dark:bg-brand-400/10" />
    </div>
  )
}
