interface ProgressBarProps {
  progress: number // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full px-4 pb-4">
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(to right, #22c55e ${Math.min(progress, 50)}%, #ef4444 ${Math.max(progress, 50)}%)`,
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-white">
        <span>0%</span>
        <span>{progress}%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

