import { Star } from 'lucide-react'

const RatingSelector = ({ displayedRating, onSelect, onHover, onLeave, hasError }) => {
  return (
    <div
      className={`h-12 flex items-center gap-2 rounded-md border-2 bg-white/80 px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-500/30 ${
        hasError
          ? 'border-red-500 focus-within:ring-red-200 dark:focus-within:border-red-400'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= displayedRating
          return (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
              onClick={() => onSelect(value)}
              onMouseEnter={() => onHover(value)}
              onMouseLeave={onLeave}
              className="rounded-md p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              <Star
                className={`cursor-pointer size-6 ${
                  isActive
                    ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          )
        })}
      </div>
      <span className="ml-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        {displayedRating ? `${displayedRating} / 5` : 'Tap to rate'}
      </span>
    </div>
  )
}

export default RatingSelector


