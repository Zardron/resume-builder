import InputField from "../../../components/forms/InputField";
import RatingSelector from "./RatingSelector";
import StatusMessage from "./StatusMessage";

const FeedbackFormCard = ({
  formData,
  status,
  displayedRating,
  ratingError,
  onSubmit,
  onFieldChange,
  onMessageChange,
  onRatingSelect,
  onRatingHover,
  onRatingLeave,
}) => {
  return (
    <div className="relative rounded-md border border-white/70 bg-white/90 p-8 shadow-2xl shadow-sky-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <form onSubmit={onSubmit} className="flex h-full flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Full name
            </label>
            <InputField
              id="name"
              name="name"
              type="text"
              icon="user"
              placeholder="John Doe"
              value={formData.name}
              onChange={onFieldChange("name")}
              hasError={status === "error" && !formData.name.trim()}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Email address
            </label>
            <InputField
              id="email"
              name="email"
              type="email"
              icon="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={onFieldChange("email")}
              hasError={status === "error" && !formData.email.trim()}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label
              htmlFor="role"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Role or industry
            </label>
            <InputField
              id="role"
              name="role"
              type="text"
              icon="briefcase"
              placeholder="Product Designer"
              value={formData.role}
              onChange={onFieldChange("role")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Rate your experience
          </span>
          <RatingSelector
            displayedRating={displayedRating}
            hasError={ratingError}
            onSelect={onRatingSelect}
            onHover={onRatingHover}
            onLeave={onRatingLeave}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Feedback
          </label>
          <textarea
            id="message"
            name="message"
            rows="3"
            value={formData.message}
            onChange={onMessageChange}
            placeholder="Tell us about your experience..."
            className={`h-24 w-full resize-none rounded-md border-2 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/30 ${
              status === "error" && !formData.message.trim()
                ? "border-red-500 focus:ring-red-200 dark:focus:border-red-400"
                : "border-slate-200"
            }`}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusMessage status={status} />
        </div>
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-3 rounded-md bg-gradient-to-r from-sky-600 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(14,165,233,0.6)] transition hover:from-sky-500 hover:to-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-900"
        >
          Submit feedback
          <span className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 text-base font-medium text-white transition group-hover:translate-x-0.5 group-hover:bg-white/20">
            →
          </span>
        </button>
      </form>
    </div>
  );
};

export default FeedbackFormCard;
