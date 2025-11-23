import { useEffect } from 'react';
import { Calendar, CreditCard, ShieldCheck } from 'lucide-react';

const mockUser = {
  name: 'Zardron Angelo Pesquera',
  email: 'zardron@example.com',
  title: 'Product Designer',
  joined: 'January 2024',
  credits: 8,
  lastResume: 'Modern Resume – Updated 2 days ago',
};

const summaryStats = [
  {
    label: 'Resumes created',
    value: '6',
    hint: 'Across all templates in your workspace',
  },
  {
    label: 'Templates favorited',
    value: '3',
    hint: 'Minimal, Spotlight, and Classic',
  },
  {
    label: 'Downloads this month',
    value: '4',
    hint: '2 PDFs · 2 DOCX exports',
  },
];

const Profile = () => {
  useEffect(() => {
    document.title = 'My Profile • ResumeIQHub';

    return () => {
      document.title = 'ResumeIQHub';
    };
  }, []);

  return (
    <section className="mx-auto flex flex-col gap-6 px-4 py-8 md:px-16">
      <header className="relative overflow-hidden rounded-md border border-blue-100/70 bg-gradient-to-r from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-6 text-white shadow-md dark:border-blue-900/40">
        <div className="absolute -top-24 right-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Account dashboard
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-white/80">
              Personalize your experience, refine job-search targeting, and keep all resume-related
              activity in one organized place.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 rounded-md border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="grid gap-6 md:grid-cols-3">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="grid gap-6">
            <section className="rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:shadow-none">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 text-2xl font-semibold text-white shadow-lg shadow-blue-500/20">
                Z
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{mockUser.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mockUser.title || 'Add a professional headline to complete your profile.'}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{mockUser.email}</p>

              <div className="mt-6 space-y-3 rounded-md bg-gray-50 p-4 text-left text-sm dark:bg-gray-800/60">
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  Verified account
                </p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Joined {mockUser.joined}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick links</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 dark:border-gray-800">
                  <span>Export history</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    4
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 dark:border-gray-800">
                  <span>Saved templates</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    3
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-md border border-blue-100 px-3 py-2 text-blue-600 dark:border-blue-400/40 dark:text-blue-300">
                  <span>Collaboration invites</span>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold dark:bg-blue-500/10">
                    Pending
                  </span>
                </li>
              </ul>
            </section>

          
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-6">
          <div className="grid gap-6">
            <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px] lg:items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal details</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Keep your contact information current so employers can reach you easily.
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-md border border-gray-100 p-4 dark:border-gray-800">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Full name
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{mockUser.name}</p>
                    </div>
                    <div className="rounded-md border border-gray-100 p-4 dark:border-gray-800">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Email address
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{mockUser.email}</p>
                    </div>
                    <div className="rounded-md border border-gray-100 p-4 dark:border-gray-800">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Headline
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{mockUser.title}</p>
                    </div>
                    <div className="rounded-md border border-gray-100 p-4 dark:border-gray-800">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Recent activity
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {mockUser.lastResume}
                      </p>
                    </div>
                  </div>
                </div>

                <aside className="flex flex-col gap-3">
                
                  <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                    Edit profile
                  </button>
                </aside>
              </div>
            </section>

            <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent activity</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Track your latest resume edits and exports.
                  </p>
                </div>
                <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                  View logs
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: 'Modern Resume exported',
                    meta: '2 credits used • 2 days ago',
                    badge: 'Download',
                    badgeColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
                  },
                  {
                    title: 'Invited Alex Rivera to collaborate',
                    meta: 'Pending acceptance • 5 days ago',
                    badge: 'Collab',
                    badgeColor: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300',
                  },
                  {
                    title: 'Updated Minimal template for marketing role',
                    meta: 'Autosaved • 1 week ago',
                    badge: 'Edit',
                    badgeColor: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300',
                  },
                  {
                    title: 'Feedback requested from Dana Miles',
                    meta: 'Email reminder sent • 2 weeks ago',
                    badge: 'Feedback',
                    badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-md border border-gray-100 p-4 dark:border-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {item.meta}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <div className="space-y-6">
            <section className="rounded-md border border-blue-100 bg-gradient-to-br from-blue-500 to-purple-500 p-6 text-white shadow-lg dark:border-blue-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-100/80">Credits balance</p>
                  <p className="mt-2 text-3xl font-semibold">{mockUser.credits}</p>
                  <p className="text-sm text-blue-100/80">credits remaining</p>
                </div>
                <CreditCard className="h-10 w-10 rounded-md bg-white/15 p-2 text-white" />
              </div>
              <p className="mt-4 text-xs text-blue-50">
                Every download consumes a credit. Purchase more anytime you need to export fresh resumes.
              </p>
              <button className="mt-6 w-full rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25">
                Buy more credits
              </button>
            </section>

            <section className="overflow-hidden rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="relative">
                <div className="absolute -top-10 right-8 h-28 w-28 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-500/10" />
                <div className="relative">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Shared resume insights</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Keep tabs on who&apos;s viewing your resume link and how engaged they are.
                  </p>

                  <div className="mt-6 grid gap-4 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-800/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Total views
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">128</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                        +12% vs last week
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 rounded-md border border-gray-200 p-3 text-center dark:border-gray-700">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Unique viewers</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">54</p>
                      </div>
                      <div className="flex-1 rounded-md border border-gray-200 p-3 text-center dark:border-gray-700">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Downloads</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">9</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>Views this week</span>
                        <span>32</span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <span className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-md border border-gray-200 bg-white/60 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/50">
                    <p className="font-semibold text-gray-900 dark:text-white">Shareable link</p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Resume link is live and ready to send to recruiters or collaborators.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <code className="flex-1 rounded-md bg-gray-900/90 px-3 py-2 text-xs text-white dark:bg-gray-100 dark:text-gray-900">
                        resumebuilder.app/zardron
                      </code>
                      <button className="rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
                        Copy link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

