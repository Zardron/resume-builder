// AI Features Configuration
// Defines all AI features and which subscription tier unlocks them

export const AI_FEATURES = {
  // Basic Tier Features
  basic: [
    {
      id: 'content-enhancement',
      name: 'AI Content Enhancement',
      description: 'Enhance professional summaries, job descriptions, and project descriptions with AI-powered suggestions.',
      icon: 'Sparkles',
      category: 'Content',
    },
    {
      id: 'summary-enhancement',
      name: 'Professional Summary Enhancement',
      description: 'Get AI-powered suggestions to improve your professional summary content and phrasing.',
      icon: 'FileText',
      category: 'Content',
    },
    {
      id: 'job-description-enhancement',
      name: 'Job Description Enhancement',
      description: 'Automatically enhance your job descriptions with action verbs and quantifiable results.',
      icon: 'Briefcase',
      category: 'Content',
    },
    {
      id: 'project-enhancement',
      name: 'Project Description Enhancement',
      description: 'Improve project descriptions with impactful language and achievements.',
      icon: 'FolderKanban',
      category: 'Content',
    },
    {
      id: 'grammar-check',
      name: 'AI Grammar & Spell Check',
      description: 'Real-time grammar and spelling corrections powered by AI.',
      icon: 'CheckCircle',
      category: 'Writing',
    },
    {
      id: 'action-verbs',
      name: 'Action Verb Suggestions',
      description: 'Get powerful action verb suggestions to strengthen your bullet points.',
      icon: 'Zap',
      category: 'Writing',
    },
  ],

  // Pro Tier Features (includes all Basic features)
  pro: [
    {
      id: 'resume-parsing',
      name: 'AI Resume Parsing',
      description: 'Upload existing resumes and automatically extract and populate all fields using AI.',
      icon: 'Upload',
      category: 'Parsing',
    },
    {
      id: 'background-removal',
      name: 'AI Background Removal',
      description: 'Automatically remove background from profile photos using AI for a professional look.',
      icon: 'Image',
      category: 'Media',
    },
    {
      id: 'ats-optimization',
      name: 'ATS Optimization',
      description: 'Optimize your resume for Applicant Tracking Systems with keyword suggestions and formatting tips.',
      icon: 'Search',
      category: 'Optimization',
    },
    {
      id: 'keyword-suggestions',
      name: 'Keyword Suggestions',
      description: 'Get AI-powered keyword suggestions based on job descriptions to improve ATS compatibility.',
      icon: 'Tag',
      category: 'Optimization',
    },
    {
      id: 'bullet-rewriting',
      name: 'Smart Bullet Point Rewriting',
      description: 'AI-powered rewriting of bullet points to make them more impactful and results-oriented.',
      icon: 'List',
      category: 'Content',
    },
    {
      id: 'readability-score',
      name: 'Readability Score',
      description: 'Get AI-powered readability analysis and suggestions to improve clarity.',
      icon: 'BarChart',
      category: 'Analytics',
    },
  ],

  // Enterprise Tier Features (includes all Pro features)
  enterprise: [
    {
      id: 'resume-scoring',
      name: 'AI Resume Scoring',
      description: 'Get comprehensive AI-powered resume strength score with detailed improvement suggestions.',
      icon: 'TrendingUp',
      category: 'Analytics',
    },
    {
      id: 'industry-suggestions',
      name: 'Industry-Specific Suggestions',
      description: 'Get tailored content suggestions based on your industry and role.',
      icon: 'Building',
      category: 'Content',
    },
    {
      id: 'job-matching',
      name: 'Job Description Matching',
      description: 'Compare your resume against job descriptions and get match percentage with improvement tips.',
      icon: 'Target',
      category: 'Optimization',
    },
    {
      id: 'skill-gap-analysis',
      name: 'Skill Gap Analysis',
      description: 'Identify missing skills for target roles and get suggestions to bridge the gap.',
      icon: 'Puzzle',
      category: 'Analytics',
    },
    {
      id: 'career-path-suggestions',
      name: 'Career Path Suggestions',
      description: 'Get AI-powered career progression suggestions based on your experience and goals.',
      icon: 'Route',
      category: 'Guidance',
    },
    {
      id: 'cover-letter-generation',
      name: 'AI Cover Letter Generation',
      description: 'Generate personalized cover letters tailored to specific job applications.',
      icon: 'Mail',
      category: 'Content',
    },
    {
      id: 'interview-prep',
      name: 'AI Interview Preparation',
      description: 'Get AI-generated interview questions and answers based on your resume content.',
      icon: 'MessageSquare',
      category: 'Guidance',
    },
    {
      id: 'salary-estimation',
      name: 'Salary Range Estimation',
      description: 'Get AI-powered salary range estimates based on your experience and skills.',
      icon: 'DollarSign',
      category: 'Analytics',
    },
  ],
};

// Get all features for a specific tier
export const getFeaturesForTier = (tier) => {
  const features = [];
  
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    features.push(...AI_FEATURES.basic);
  }
  
  if (tier === 'pro' || tier === 'enterprise') {
    features.push(...AI_FEATURES.pro);
  }
  
  if (tier === 'enterprise') {
    features.push(...AI_FEATURES.enterprise);
  }
  
  return features;
};

// Get tier required for a specific feature
export const getTierForFeature = (featureId) => {
  if (AI_FEATURES.basic.some(f => f.id === featureId)) return 'basic';
  if (AI_FEATURES.pro.some(f => f.id === featureId)) return 'pro';
  if (AI_FEATURES.enterprise.some(f => f.id === featureId)) return 'enterprise';
  return null;
};

// Get all features grouped by category
export const getFeaturesByCategory = (tier) => {
  const features = getFeaturesForTier(tier);
  const grouped = {};
  
  features.forEach(feature => {
    if (!grouped[feature.category]) {
      grouped[feature.category] = [];
    }
    grouped[feature.category].push(feature);
  });
  
  return grouped;
};

// Check if a user's subscription tier has access to a specific feature
export const hasFeatureAccess = (userTier, featureId) => {
  if (!userTier || userTier === 'free') return false;
  
  const requiredTier = getTierForFeature(featureId);
  if (!requiredTier) return false;
  
  const tierLevels = {
    'basic': 1,
    'pro': 2,
    'enterprise': 3,
  };
  
  const userLevel = tierLevels[userTier] || 0;
  const requiredLevel = tierLevels[requiredTier] || 999;
  
  return userLevel >= requiredLevel;
};

// Map frontend feature IDs to backend API route IDs
export const FEATURE_TO_API_MAP = {
  'content-enhancement': 'enhance-content',
  'summary-enhancement': 'enhance-summary',
  'job-description-enhancement': 'enhance-job-description',
  'project-enhancement': 'enhance-project-description',
  'grammar-check': 'grammar-check',
  'action-verbs': 'action-verbs',
  'resume-parsing': 'parse-resume',
  'background-removal': 'remove-background',
  'ats-optimization': 'ats-optimization',
  'keyword-suggestions': 'keyword-suggestions',
  'bullet-rewriting': 'rewrite-bullets',
  'readability-score': 'readability-score',
  'resume-scoring': 'resume-score',
  'industry-suggestions': 'industry-suggestions',
  'job-matching': 'job-matching',
  'skill-gap-analysis': 'skill-gap-analysis',
  'career-path-suggestions': 'career-path',
  'cover-letter-generation': 'cover-letter',
  'interview-prep': 'interview-prep',
  'salary-estimation': 'salary-estimation',
};

