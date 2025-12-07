import InfoPanel from './testimonial-form/InfoPanel'
import FeedbackFormCard from './testimonial-form/FeedbackFormCard'
import { useTestimonialForm } from './testimonial-form/useTestimonialForm'

const TestimonialForm = () => {
  const {
    formData,
    status,
    displayedRating,
    ratingError,
    handleFieldChange,
    handleMessageChange,
    handleRatingSelect,
    handleRatingHover,
    handleRatingLeave,
    handleSubmit,
  } = useTestimonialForm()

  return (
    <>
      <section className="relative isolate overflow-hidden py-10 text-slate-700 dark:text-slate-300">
        <div className="pointer-events-none absolute -top-28 right-4 md:right-16 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/20" />
        <div className="pointer-events-none absolute bottom-0 left-0 hidden h-72 w-96 bg-gradient-to-tr from-sky-100/70 via-transparent to-transparent blur-3xl dark:block dark:from-slate-700/40" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <InfoPanel />
            <FeedbackFormCard
              formData={formData}
              status={status}
              displayedRating={displayedRating}
              ratingError={ratingError}
              onSubmit={handleSubmit}
              onFieldChange={handleFieldChange}
              onMessageChange={handleMessageChange}
              onRatingSelect={handleRatingSelect}
              onRatingHover={handleRatingHover}
              onRatingLeave={handleRatingLeave}
            />
          </div>
        </div>
      </section>
      <div className="relative isolate overflow-x-hidden">
        <div className="mx-auto h-[1px] w-full max-w-6xl px-4 sm:px-6 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
      </div>
    </>
  )
}

export default TestimonialForm
