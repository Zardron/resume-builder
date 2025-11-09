import React from 'react'
import Marquee from 'react-fast-marquee'
import { MessageCircle, Star } from 'lucide-react'
import SectionBadge from './SectionBadge'
import { useTestimonials } from './testimonials/TestimonialsContext'

const Testimonials = () => {
  const { testimonials } = useTestimonials()
  const ratingEntries = testimonials.filter((card) => Number.isFinite(card.rating))
  const totalReviews = testimonials.length
  const averageRating =
    ratingEntries.length > 0
      ? ratingEntries.reduce((total, card) => total + card.rating, 0) /
        ratingEntries.length
      : 0
  const formattedAverageRating = averageRating.toFixed(1)
  const uniqueRoles = Array.from(new Set(testimonials.map((card) => card.role)))
  const roleHighlights = uniqueRoles.slice(0, 4)
  const remainingRoles = Math.max(0, uniqueRoles.length - roleHighlights.length)

  const StarRating = ({ rating }) => {
    const clampedRating = Math.max(0, Math.min(5, rating))
    const roundedDisplay = Math.round(clampedRating)

    return (
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const isActive = index + 1 <= roundedDisplay
          return (
            <Star
              key={index}
              className={`h-3.5 w-3.5 transition-colors duration-150 ${
                isActive
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                  : 'text-slate-200 dark:text-slate-600'
              }`}
              strokeWidth={2}
            />
          )
        })}
        <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {roundedDisplay} / 5
        </span>
      </div>
    )
  }

  const CreateCard = ({ card }) => {
    const subtitle = card.role
    const date = card.date

    return (
      <div className="p-5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 w-72 min-h-[200px] flex h-full flex-col bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary-color)] to-[var(--accent-color)] opacity-60 blur-sm animate-pulse"></span>
            <img
              className="relative size-12 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-lg"
              src={card.image}
              alt={`${card.name} avatar`}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{card.name}</p>
            {subtitle && (
              <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
            )}
            {Number.isFinite(card.rating) && <StarRating rating={card.rating} />}
          </div>
        </div>
        <p className="text-xs mt-4 text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">
          {card.testimonial}
        </p>
        {date && (
          <span className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {date}
          </span>
        )}
      </div>
    )
  }

  return (
    <section
      id="testimonials"
      className="mt-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="text-center">
        <SectionBadge icon={MessageCircle} label="Testimonials" className="mx-auto" />
        <h1 id="testimonials-heading" className="text-3xl font-semibold text-center mx-auto text-gray-900 dark:text-gray-100 mt-4">
          What Our Users Say
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-md mx-auto">
          Join thousands of professionals who've transformed their careers with our AI-powered resume builder.
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" aria-hidden="true" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formattedAverageRating} / 5</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Based on {totalReviews} testimonials
          </span>
        </div>
        {roleHighlights.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {roleHighlights.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full border border-slate-200/70 bg-white/80 dark:border-slate-700/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 shadow-sm"
              >
                {role}
              </span>
            ))}
            {remainingRoles > 0 && (
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                +{remainingRoles} more roles
              </span>
            )}
          </div>
        )}
      </div>
      <div className="testimonial-slider w-full overflow-hidden relative px-4">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-slate-900 to-transparent"></div>
        <Marquee
          className="pt-10 pb-5"
          pauseOnHover={false}
          speed={28}
          gradient={false}
        >
          {[...testimonials, ...testimonials].map((card, index) => (
            <div key={index} className="pr-8 flex items-stretch justify-center">
              <CreateCard card={card} />
            </div>
          ))}
        </Marquee>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-slate-900 to-transparent"></div>
      </div>
    
    </section>
  );
}

export default Testimonials
