import { Quote, Sparkles } from 'lucide-react'
import { generateAvatarUrl } from '../../../utils/generateAvatarUrl'

const spotlightAvatars = [
  { name: 'Avery Chen', role: 'Product Designer' },
  { name: 'Jordan Wells', role: 'Growth Marketer' },
  { name: 'Priya Nair', role: 'Customer Success Lead' },
]

const InfoPanel = () => {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/60 bg-white/80 p-10 shadow-2xl shadow-sky-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <div className="relative z-10 flex h-full flex-col justify-between gap-10">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-300">
            Community spotlight
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Share Your Experience
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            We love hearing how the builder helped you land your next role. Leave a quick note and we
            may feature it soon to help other professionals take the leap.
          </p>

          <div className="relative overflow-hidden rounded-md border border-sky-500/20 bg-sky-50/60 p-5 shadow-sm dark:border-sky-400/20 dark:bg-slate-800/60">
            <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex p-2 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
                <Quote className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
                  <Sparkles className="h-4 w-4" />
                  Spotlight Story
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  “The ResumeIQ helped me rewrite my story in minutes. Two weeks later, I had
                  three interviews lined up. Sharing your wins gives others the same boost.”
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {spotlightAvatars.map((person, index) => (
                      <img
                        key={person.name}
                        src={generateAvatarUrl(person.name)}
                        alt={person.name}
                        className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-900"
                        style={{ zIndex: spotlightAvatars.length - index }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {spotlightAvatars[0].name} & peers
                    <span className="block text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Community Contributors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
            <p>Your testimonial helps shape what we improve next for job seekers.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
            <p>Every submission is reviewed by our team before appearing publicly.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
            <p>Feature-ready stories are highlighted in newsletters and live demos.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoPanel


