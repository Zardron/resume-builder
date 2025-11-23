import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Maximize2, Sparkles, Lock, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import TemplatePreviewModal from '../../components/TemplatePreviewModal';
import PaperSizeDropdown from '../../components/builder/PaperSizeDropdown';
import FontDropdown from '../../components/builder/FontDropdown';
import { PAPER_SIZES } from './resumeBuilderConstants';
import ColorPicker from '../../util/ColorPicker';
import { useApp } from '../../contexts/AppContext';
import { AI_FEATURES } from '../../utils/aiFeatures';
import { AI_SUBSCRIPTION_PLANS } from '../../config/pricing';

const resumeFonts = ['Inter', 'Poppins', 'Source Sans Pro', 'Work Sans', 'Merriweather'];
const resumeMargins = ['0.25"', '0.5"', '0.75"', '1"'];

const builderTemplates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with bold headers and clean typography.',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, content-focused layout with generous white space.',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Structured sections that fit traditional corporate roles.',
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Visual-forward design with an elevated profile area.',
  },
];

const resumeSections = [
  {
    id: 'personalInfo',
    label: 'Personal info',
    description: 'Contact details, role headline, portfolio links, and profile photo.',
    defaultVisible: true,
  },
  {
    id: 'professionalSummary',
    label: 'Professional summary',
    description: 'High-level pitch that frames your story for recruiters.',
    defaultVisible: true,
  },
  {
    id: 'experience',
    label: 'Professional experience',
    description: 'Role highlights, measurable outcomes, and collaboration context.',
    defaultVisible: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Selected initiatives with links, outcomes, and responsibilities.',
    defaultVisible: true,
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Degrees, certifications, bootcamps, and coursework.',
    defaultVisible: true,
  },
  {
    id: 'skillsLanguages',
    label: 'Skills & languages',
    description: 'Technical and soft skills plus language proficiency.',
    defaultVisible: true,
  },
  {
    id: 'additionalSections',
    label: 'Additional sections',
    description: 'Certifications, achievements, and volunteer work collections.',
    defaultVisible: false,
  },
];

const editingEnhancements = [
  {
    id: 'aiAssist',
    label: 'AI enhancements',
    description: 'Surface rewrite and bullet-suggestion prompts as you type.',
    defaultEnabled: true,
  },
  {
    id: 'inlineGuidance',
    label: 'Inline guidance',
    description: 'Show contextual hints and formatting advice in the editor.',
    defaultEnabled: true,
  },
  {
    id: 'trackChanges',
    label: 'Track changes',
    description: 'Highlight edit suggestions for reviewer approval.',
    defaultEnabled: false,
  },
  {
    id: 'showWordCount',
    label: 'Word & character counts',
    description: 'Display quick metrics per section to stay concise.',
    defaultEnabled: true,
  },
];

const collaborationOptions = [
  {
    id: 'commentNotifications',
    label: 'Comment notifications',
    description: 'Receive updates when teammates leave feedback on sections.',
    defaultEnabled: true,
  },
  {
    id: 'shareWithTeam',
    label: 'Auto-share new resumes with team',
    description: 'Give editors and hiring partners immediate access.',
    defaultEnabled: true,
  },
  {
    id: 'autoAssignReviewers',
    label: 'Auto-assign reviewers',
    description: 'Route drafts to designated reviewers once ready.',
    defaultEnabled: false,
  },
];

const cardSurfaceClass =
  'rounded-md border border-gray-200 bg-white p-6 shadow-sm transition';

const Settings = () => {
  const { isSubscribed } = useApp();
  
  const profile = {
    fullName: 'Alex Rivera',
    email: 'alex@createcv.io',
    role: 'Product Designer',
    company: 'ResumeIQHub Labs',
    timezone: 'UTC−05:00 Eastern Time (US & Canada)',
    bio: 'Crafting design-first job materials that help candidates shine.',
  };

  const [preferences, setPreferences] = useState({
    autosave: true,
    onboardingTips: false,
    fullscreenPreview: true,
    showGuidelines: true,
  });

  const [notifications, setNotifications] = useState({
    productUpdates: true,
    weeklyDigest: true,
    interviewReminders: false,
    creditsLow: true,
    browserPush: false,
  });

  const [resumeDefaults, setResumeDefaults] = useState({
    accentColor: '#2563eb',
    font: 'Inter',
    paperSize: 'A4',
    margin: '0.75"',
  });

  const fontOptionDetails = useMemo(
    () => ({
      Inter: 'Versatile sans-serif',
      Poppins: 'Rounded sans-serif',
      'Source Sans Pro': 'Humanist sans-serif',
      'Work Sans': 'Friendly sans-serif',
      Merriweather: 'Classic serif',
    }),
    []
  );

  const describeFontFamily = (description) =>
    description?.toLowerCase().includes('serif') ? 'serif' : 'sans-serif';

  const fontOptions = useMemo(
    () =>
      resumeFonts.map((font) => ({
        id: font,
        label: font,
        description: fontOptionDetails[font] || '',
      })),
    [fontOptionDetails]
  );

  const marginOptions = useMemo(
    () =>
      resumeMargins.map((margin) => ({
        id: margin,
        label: margin,
        description: margin === '0.5"' ? 'Recommended default' : '',
      })),
    []
  );

  const selectedFontOption = fontOptions.find((option) => option.id === resumeDefaults.font) || null;
  const fontPreviewFallback = describeFontFamily(selectedFontOption?.description ?? '');
  const selectedMarginOption = marginOptions.find((option) => option.id === resumeDefaults.margin) || null;

  const handlePaperSizeSelect = (paperSizeId) => {
    setResumeDefaults((current) => ({
      ...current,
      paperSize: paperSizeId,
    }));
  };

  const handleFontSelect = (fontId) => {
    if (typeof fontId !== 'string' || fontId.length === 0) {
      return;
    }

    setResumeDefaults((current) => ({
      ...current,
      font: fontId,
    }));
  };

  const handleMarginSelect = (marginId) => {
    if (typeof marginId !== 'string' || marginId.length === 0) {
      return;
    }

    setResumeDefaults((current) => ({
      ...current,
      margin: marginId,
    }));
  };

  const handleAccentColorSelect = (color) => {
    if (typeof color !== 'string' || color.length === 0) {
      return;
    }

    setResumeDefaults((current) => ({
      ...current,
      accentColor: color,
    }));
  };

  const [builderSettings, setBuilderSettings] = useState({
    defaultTemplate: 'modern',
    sectionVisibility: resumeSections.reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: section.defaultVisible,
      }),
      {}
    ),
    editingEnhancements: editingEnhancements.reduce(
      (acc, enhancement) => ({
        ...acc,
        [enhancement.id]: enhancement.defaultEnabled,
      }),
      {}
    ),
    collaboration: collaborationOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.id]: option.defaultEnabled,
      }),
      {}
    ),
  });

  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sectionRefs = useRef({});
  const sectionMenuItems = [
    { id: 'resumeDefaults', label: 'Resume defaults' },
    { id: 'aiFeatures', label: 'AI Features' },
    { id: 'builderAutomation', label: 'Builder automation' },
    { id: 'workspacePreferences', label: 'Workspace preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'dangerZone', label: 'Danger zone' },
  ];

  useEffect(() => {
    document.title = 'Dashboard Settings • ResumeIQHub';

    return () => {
      document.title = 'ResumeIQHub';
    };
  }, []);

  const togglePreference = (groupSetter) => (key) => {
    groupSetter((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);

    window.setTimeout(() => {
      setIsSaving(false);
      // Placeholder for future toast/notification system
    }, 850);
  };

  const renderToggle = (checked, onChange, label, description) => (
    <label className="flex w-full items-start justify-between gap-4 rounded-md border border-transparent px-3 py-2 transition hover:border-[var(--primary-color)] hover:bg-[color-mix(in_srgb,_var(--primary-color)_12%,_white)] dark:hover:border-[var(--primary-color)] dark:hover:bg-[color-mix(in_srgb,_var(--primary-color)_18%,_rgba(15,23,42,1))]">
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
        {description ? <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span> : null}
      </span>
      <button
        type="button"
        onClick={onChange}
        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? 'bg-[var(--primary-color)]' : 'bg-gray-300 dark:bg-gray-700'}`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </label>
  );

  const toggleBuilderSetting = (group) => (key) => {
    setBuilderSettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: !current[group][key],
      },
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setBuilderSettings((current) => ({
      ...current,
      defaultTemplate: templateId,
    }));
    setPreviewTemplate(builderTemplates.find((template) => template.id === templateId) || null);
  };

  const handleSectionScroll = (sectionId) => {
    const target = sectionRefs.current[sectionId];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openTemplatePreview = (template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const closeTemplatePreview = () => {
    setIsPreviewOpen(false);
  };

  const sampleResumeData = {
    personal_info: {
      full_name: 'Alex Rivera',
      name: 'Alex Rivera',
      email: 'alex.rivera@email.com',
      phone: '+1 (312) 555-8912',
      location: 'Chicago, IL',
      linkedin: 'linkedin.com/in/alexrivera',
      website: 'alexrivera.design',
      profession: 'Product Designer',
      image: null,
      profile_image: null,
    },
    professional_summary:
      'Product designer crafting human-centered experiences across SaaS and consumer apps. I translate research into delightful, scalable systems that help teams ship faster.',
    experience: [
      {
        position: 'Lead Product Designer',
        company: 'ResumeIQHub Labs',
        start_date: '2023-02',
        end_date: '',
        is_current: true,
        description:
          'Driving design for a resume intelligence platform used by 120k+ job seekers. Led the design system refresh and introduced AI-guided editing workflows that increased session completion by 18%.',
      },
      {
        position: 'Product Designer',
        company: 'Constructive Apps',
        start_date: '2020-07',
        end_date: '2023-01',
        is_current: false,
        description:
          'Owned end-to-end design for collaboration features across mobile and web. Partnered with product and research to deliver roadmap-defining insights.',
      },
    ],
    education: [
      {
        degree: 'BFA, Interaction Design',
        field: 'Interaction Design',
        institution: 'University of Illinois',
        graduation_date: '2020-05',
        gpa: '3.7',
      },
    ],
    project: [
      {
        name: 'Guided ResumeIQHub',
        description:
          'Launched a modular ResumeIQHub with inline AI guidance, improving first-session publish rate by 24%.',
      },
      {
        name: 'Insight Dashboard',
        description:
          'Designed analytics dashboards surfacing conversion metrics and reviewer feedback for hiring teams.',
      },
    ],
    skills: ['Figma', 'UX Research', 'Journey Mapping', 'Design Systems', 'Prototyping', 'Storytelling'],
  };

  const visibleOrderedSections = resumeSections.filter((section) => builderSettings.sectionVisibility[section.id]);
  const selectedPaperSizeOption =
    PAPER_SIZES.find((option) => option.id === resumeDefaults.paperSize) || PAPER_SIZES[0];

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-4 py-8 md:px-16">
      <header className="relative overflow-hidden rounded-md border border-[color-mix(in_srgb,_var(--primary-color)_28%,_white)] bg-gradient-to-r from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-6 text-white shadow-sm dark:border-[color-mix(in_srgb,_var(--primary-color)_38%,_rgba(15,23,42,1))]">
        <div className="absolute -top-24 right-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            <span className="h-2 w-2 rounded-full bg-[var(--success-color)]" />
            Dashboard
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/80" />
            Settings
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tune how you build resumes</h1>
          <p className="max-w-2xl text-sm text-white/85">
            Fine-tune default resume styling, builder automation, and collaboration preferences so every draft starts
            strong.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:col-span-8 lg:col-span-9">
              <section
                ref={(node) => {
                  sectionRefs.current.resumeDefaults = node;
                }}
                className={`${cardSurfaceClass} scroll-mt-18`}
              >
                <header className="relative flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume defaults</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set the baseline that new resumes inherit. You can still adjust each project individually.
                  </p>
                </header>

                <div className="relative mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <ColorPicker
                      selectedColor={resumeDefaults.accentColor}
                      onColorSelect={handleAccentColorSelect}
                      title="Accent color"
                      description="Customize the default highlight color for new resumes."
                    />
                  </div>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Font</span>
                    <FontDropdown
                      fontOptions={fontOptions}
                      selectedFont={resumeDefaults.font}
                      onSelect={handleFontSelect}
                      buttonClassName="w-full justify-between px-4 py-3 text-sm"
                      dropdownClassName="w-full"
                      menuWidthClass="w-full"
                    />
                   
                    {selectedFontOption ? (
                      <div className="mt-3 rounded-md border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Sample preview
                        </span>
                        <p
                          className="mt-2 text-base text-gray-700 dark:text-gray-100"
                          style={{ fontFamily: `'${selectedFontOption.label}', ${fontPreviewFallback}` }}
                        >
                          The quick brown fox jumps over the lazy dog.
                        </p>
                        <p
                          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                          style={{ fontFamily: `'${selectedFontOption.label}', ${fontPreviewFallback}` }}
                        >
                          0123456789 • Resume-ready typography that stays crisp on screen and print.
                        </p>
                      </div>
                    ) : null}
                  </label>
                <div className='flex flex-col gap-8'>
                <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Paper size</span>
                    <PaperSizeDropdown
                      paperSizes={PAPER_SIZES}
                      selectedPaperSize={resumeDefaults.paperSize}
                      onSelect={handlePaperSizeSelect}
                      buttonLabel={
                        selectedPaperSizeOption
                          ? `${selectedPaperSizeOption.label} (${selectedPaperSizeOption.dimensions})`
                          : 'Select paper size'
                      }
                      buttonClassName="w-full justify-between px-4 py-3 text-sm"
                      dropdownClassName="w-full"
                      menuWidthClass="w-full"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Margin preset</span>
                    <PaperSizeDropdown
                      paperSizes={marginOptions}
                      selectedPaperSize={resumeDefaults.margin}
                      onSelect={handleMarginSelect}
                      buttonLabel={
                        selectedMarginOption
                          ? `${selectedMarginOption.label}`
                          : 'Select margin preset'
                      }
                      icon={<Maximize2 className="w-4 h-4" />}
                      buttonClassName="w-full justify-between px-4 py-3 text-sm"
                      dropdownClassName="w-full"
                      menuWidthClass="w-full"
                    />
                  </label>
                </div>
                </div>
              </section>

              <section
                ref={(node) => {
                  sectionRefs.current.aiFeatures = node;
                }}
                className={`${cardSurfaceClass} scroll-mt-18`}
              >
                <header className="relative flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Features</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Unlock powerful AI-powered features to enhance your resume building experience.
                  </p>
                </header>

                <div className="mt-6 rounded-md border-2 border-[var(--primary-color)]/20 bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-6 text-white shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">
                          Subscribe to Enable AI Features
                        </h3>
                        <Lock className="h-5 w-5 text-white/90" />
                      </div>
                      <p className="mb-4 text-sm font-medium text-white/95 leading-relaxed">
                        To enable AI-powered features like smart suggestions, content enhancements, and automated resume optimization, you need an active subscription. Subscribe now to unlock the full potential of our AI assistant.
                      </p>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        Limited Time: 50% Off First Month
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to="/dashboard/subscription"
                          className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-[var(--primary-color)] shadow-lg transition hover:scale-105 hover:shadow-xl"
                        >
                          <span>Subscribe Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white/90 line-through">
                            ₱{AI_SUBSCRIPTION_PLANS.enterprise.monthlyPrice}/month
                          </span>
                          <span className="text-sm font-bold text-white">
                            ₱{AI_SUBSCRIPTION_PLANS.enterprise.firstMonthPrice}/month (First Month)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available AI Features List */}
                <div className="mt-6 space-y-4">
                  <header className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Available AI Features
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Subscribe to Premium to unlock all these AI-powered features.
                    </p>
                  </header>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ...AI_FEATURES.basic,
                      ...AI_FEATURES.pro,
                      ...AI_FEATURES.enterprise,
                    ].map((feature) => {
                      const isUnlocked = isSubscribed;
                      
                      return (
                        <div
                          key={feature.id}
                          className={`flex items-start gap-3 rounded-md border p-3 ${
                            isUnlocked
                              ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10'
                              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                          }`}
                        >
                          {isUnlocked ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                          ) : (
                            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {feature.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section
                ref={(node) => {
                  sectionRefs.current.builderAutomation = node;
                }}
                className={`${cardSurfaceClass} scroll-mt-18`}
              >
                <header className="relative flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Builder automation</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shape how new resumes are generated, which sections appear, and how collaborators review drafts.
                  </p>
                </header>

                <div className="relative mt-6 space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Default template
                    </h3>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {builderTemplates.map((template) => {
                        const isSelected = builderSettings.defaultTemplate === template.id;
                        return (
                          <button
                            type="button"
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`group flex h-full w-full flex-col items-start gap-3 rounded-md border px-4 py-4 text-left transition ${
                              isSelected
                                ? 'border-[var(--primary-color)] bg-[color-mix(in_srgb,_var(--primary-color)_12%,_white)] shadow-sm dark:border-[var(--primary-color)] dark:bg-[color-mix(in_srgb,_var(--primary-color)_18%,_rgba(15,23,42,1))]'
                                : 'border-gray-200 bg-white hover:border-[var(--primary-color)] hover:bg-[color-mix(in_srgb,_var(--primary-color)_12%,_white)] dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-[var(--primary-color)] dark:hover:bg-[color-mix(in_srgb,_var(--primary-color)_18%,_rgba(15,23,42,1))]'
                            }`}
                            aria-pressed={isSelected}
                            aria-label={`Select ${template.name} template`}
                          >
                            <span
                              className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                                isSelected
                                  ? 'border-[var(--primary-color)] text-[var(--primary-color)] dark:border-[var(--primary-color)] dark:text-[var(--primary-color)]'
                                  : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Template'}
                            </span>
                            <span className="text-base font-semibold text-gray-900 dark:text-white">{template.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{template.description}</span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openTemplatePreview(template);
                              }}
                              className="inline-flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,_var(--primary-color)_60%,_transparent)] px-3 py-1 text-xs font-semibold text-[var(--primary-color)] transition hover:border-[var(--primary-color)] hover:bg-[color-mix(in_srgb,_var(--primary-color)_15%,_white)] dark:border-[color-mix(in_srgb,_var(--primary-color)_40%,_rgba(15,23,42,1))] dark:text-[var(--primary-color)] dark:hover:border-[var(--primary-color)] dark:hover:bg-[color-mix(in_srgb,_var(--primary-color)_22%,_rgba(15,23,42,1))]"
                            >
                              <Eye className="size-3.5" />
                              Preview template
                            </button>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <header className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Section visibility
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Toggle the sections shown when teammates start a new resume. Visibility can still be customized
                        per resume.
                      </p>
                    </header>
                    <ul className="space-y-2">
                      {resumeSections.map((section) =>
                        renderToggle(
                          builderSettings.sectionVisibility[section.id],
                          () => toggleBuilderSetting('sectionVisibility')(section.id),
                          section.label,
                          section.description
                        )
                      )}
                    </ul>
                    <div className="flex flex-wrap gap-2 rounded-md border border-dashed border-[color-mix(in_srgb,_var(--primary-color)_45%,_transparent)] bg-[color-mix(in_srgb,_var(--primary-color)_10%,_white)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--primary-color)] dark:border-[color-mix(in_srgb,_var(--primary-color)_40%,_rgba(15,23,42,1))] dark:bg-[color-mix(in_srgb,_var(--primary-color)_20%,_rgba(15,23,42,1))] dark:text-[var(--primary-color)]">
                      {visibleOrderedSections.length ? (
                        visibleOrderedSections.map((section, index) => (
                          <span
                            key={section.id}
                            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-[var(--primary-color)] shadow-sm dark:bg-[color-mix(in_srgb,_var(--primary-color)_14%,_rgba(15,23,42,1))] dark:text-[var(--primary-color)]"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-color)] text-[0.65rem] font-bold text-white dark:bg-[var(--primary-color)]">
                              {index + 1}
                            </span>
                            {section.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--primary-color)]">Select at least one section to display.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <header className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Editing experience
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Enhance writing workflows with inline AI feedback and guidelines.
                      </p>
                    </header>
                    <ul className="space-y-2">
                      {editingEnhancements.map((option) =>
                        renderToggle(
                          builderSettings.editingEnhancements[option.id],
                          () => toggleBuilderSetting('editingEnhancements')(option.id),
                          option.label,
                          option.description
                        )
                      )}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <header className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Collaboration & sharing
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Decide how teammates join the workflow and receive updates.
                      </p>
                    </header>
                    <ul className="space-y-2">
                      {collaborationOptions.map((option) =>
                        renderToggle(
                          builderSettings.collaboration[option.id],
                          () => toggleBuilderSetting('collaboration')(option.id),
                          option.label,
                          option.description
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              <section
                ref={(node) => {
                  sectionRefs.current.workspacePreferences = node;
                }}
                className={`${cardSurfaceClass} scroll-mt-18`}
              >
                <header className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workspace preferences</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose how the builder behaves while you work.</p>
                </header>

                <div className="mt-5 space-y-3">
                  {renderToggle(
                    preferences.autosave,
                    () => togglePreference(setPreferences)('autosave'),
                    'Autosave revisions',
                    'Save drafts every 5 minutes while editing.'
                  )}
                  {renderToggle(
                    preferences.fullscreenPreview,
                    () => togglePreference(setPreferences)('fullscreenPreview'),
                    'Enable fullscreen preview',
                    'Allow immersive preview mode when presenting resumes.'
                  )}
                  {renderToggle(
                    preferences.showGuidelines,
                    () => togglePreference(setPreferences)('showGuidelines'),
                    'Show content guidelines',
                    'Highlight prompt tips alongside each section.'
                  )}
                  {renderToggle(
                    preferences.onboardingTips,
                    () => togglePreference(setPreferences)('onboardingTips'),
                    'Show onboarding tips',
                    'Display quick-start prompts for new collaborators.'
                  )}
                </div>
              </section>

              <section
                ref={(node) => {
                  sectionRefs.current.notifications = node;
                }}
                className={`${cardSurfaceClass} scroll-mt-18`}
              >
                <header className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stay in the loop on collaboration, launches, and candidate progress.
                  </p>
                </header>

                <div className="mt-5 space-y-3">
                  {renderToggle(
                    notifications.productUpdates,
                    () => togglePreference(setNotifications)('productUpdates'),
                    'Product launches',
                    'Release drops, templates, and tool improvements.'
                  )}
                  {renderToggle(
                    notifications.weeklyDigest,
                    () => togglePreference(setNotifications)('weeklyDigest'),
                    'Weekly digest',
                    'Summary of resume performance analytics each Monday.'
                  )}
                  {renderToggle(
                    notifications.interviewReminders,
                    () => togglePreference(setNotifications)('interviewReminders'),
                    'Interview reminders',
                    'Alerts when interviews or follow-ups are scheduled.'
                  )}
                  {renderToggle(
                    notifications.creditsLow,
                    () => togglePreference(setNotifications)('creditsLow'),
                    'Credits running low',
                    'Notify when remaining export credits drop below 10.'
                  )}
                  {renderToggle(
                    notifications.browserPush,
                    () => togglePreference(setNotifications)('browserPush'),
                    'Browser push notifications',
                    'Enable push notifications on this device.'
                  )}
                </div>
              </section>

              <section
                ref={(node) => {
                  sectionRefs.current.dangerZone = node;
                }}
                className="scroll-mt-18 rounded-md border border-[color-mix(in_srgb,_var(--error-color)_45%,_transparent)] bg-[color-mix(in_srgb,_var(--error-color)_10%,_white)] p-6 shadow-sm transition hover:border-[var(--error-color)] hover:bg-[color-mix(in_srgb,_var(--error-color)_14%,_white)] dark:border-[color-mix(in_srgb,_var(--error-color)_45%,_rgba(15,23,42,1))] dark:bg-[color-mix(in_srgb,_var(--error-color)_18%,_rgba(15,23,42,1))] dark:hover:border-[var(--error-color)] dark:hover:bg-[color-mix(in_srgb,_var(--error-color)_22%,_rgba(15,23,42,1))]"
              >
                <header className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-[var(--error-color)] dark:text-[var(--error-color)]">Danger zone</h2>
                  <p className="text-sm text-[color-mix(in_srgb,_var(--error-color)_70%,_black)] dark:text-[color-mix(in_srgb,_var(--error-color)_70%,_white)]">
                    Manage irreversible actions like deleting your workspace and collaborators.
                  </p>
                </header>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold text-[var(--error-color)] dark:text-[var(--error-color)]">Delete workspace</span>
                    <span className="text-[color-mix(in_srgb,_var(--error-color)_70%,_black)] dark:text-[color-mix(in_srgb,_var(--error-color)_70%,_white)]">
                      This will remove templates, exports, and shared access for everyone.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex w-fit items-center justify-center rounded-md border border-[color-mix(in_srgb,_var(--error-color)_55%,_transparent)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--error-color)] transition hover:border-[var(--error-color)] hover:bg-[color-mix(in_srgb,_var(--error-color)_12%,_white)] dark:border-[color-mix(in_srgb,_var(--error-color)_55%,_rgba(15,23,42,1))] dark:bg-transparent dark:text-[var(--error-color)] dark:hover:border-[var(--error-color)] dark:hover:bg-[color-mix(in_srgb,_var(--error-color)_22%,_rgba(15,23,42,1))]"
                  >
                    Request deletion
                  </button>
                </div>
              </section>

              <footer className="flex flex-col gap-3 border-t border-dashed border-white/60 pt-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300/80 bg-white/80 px-4 py-2 font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-700 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
                >
                  Discard changes
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-[var(--primary-color)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,_var(--primary-color)_25%,_white)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,_var(--primary-color)_55%,_transparent)] dark:bg-[var(--primary-color)] dark:hover:bg-[var(--secondary-color)] dark:focus:ring-[color-mix(in_srgb,_var(--primary-color)_30%,_rgba(15,23,42,1))]"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving…' : 'Save settings'}
                </button>
              </footer>
        </form>

        <aside className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-18 space-y-6">
            <div className="rounded-md border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] text-white shadow-sm">
                  {profile.fullName
                    .split(' ')
                    .map((segment) => segment[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile.fullName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{profile.role}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="rounded-md border border-gray-200/70 bg-white/80 px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <dt className="font-medium text-gray-700 dark:text-gray-200">Plan</dt>
                  <dd className="mt-1 font-semibold text-gray-900 dark:text-white">Creator</dd>
                </div>
                <div className="rounded-md border border-gray-200/70 bg-white/80 px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <dt className="font-medium text-gray-700 dark:text-gray-200">Credits</dt>
                  <dd className="mt-1 font-semibold text-[var(--primary-color)] dark:text-[var(--primary-color)]">34</dd>
                </div>
                <div className="rounded-md border border-gray-200/70 bg-white/80 px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <dt className="font-medium text-gray-700 dark:text-gray-200">Team size</dt>
                  <dd className="mt-1 font-semibold text-gray-900 dark:text-white">5 seats</dd>
                </div>
                <div className="rounded-md border border-gray-200/70 bg-white/80 px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <dt className="font-medium text-gray-700 dark:text-gray-200">Next invoice</dt>
                  <dd className="mt-1 font-semibold text-gray-900 dark:text-white">Nov 28, 2025</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-md border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick navigation</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {sectionMenuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSectionScroll(item.id)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-left font-medium text-gray-600 transition hover:border-[var(--primary-color)] hover:bg-[color-mix(in_srgb,_var(--primary-color)_10%,_white)] hover:text-[var(--primary-color)] dark:border-gray-700 dark:text-gray-300 dark:hover:border-[var(--primary-color)] dark:hover:bg-[color-mix(in_srgb,_var(--primary-color)_16%,_rgba(15,23,42,1))] dark:hover:text-[var(--primary-color)]"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={closeTemplatePreview}
        templateId={previewTemplate?.id ?? builderSettings.defaultTemplate}
        templateName={previewTemplate?.name}
        templateDescription={previewTemplate?.description}
        accentColor={resumeDefaults.accentColor}
        sampleData={sampleResumeData}
        onTemplateSelect={(templateId) => {
          handleTemplateSelect(templateId);
          setIsPreviewOpen(false);
        }}
        initialPaperSize={resumeDefaults.paperSize}
        onPaperSizeChange={(value) =>
          setResumeDefaults((current) => ({
            ...current,
            paperSize: value,
          }))
        }
      />
    </section>
  );
};

export default Settings;

