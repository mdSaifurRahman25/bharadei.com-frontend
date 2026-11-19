export default function Loading() {
  return (
    <div className="bd-container py-20">
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--surface-tint)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--purple)] animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-[var(--ink-strong)]">
            Loading BharaDei.com...
          </p>
          <p className="text-xs text-[var(--muted)] font-mono">
            Preparing equipment &amp; live availability
          </p>
        </div>
      </div>
    </div>
  );
}
