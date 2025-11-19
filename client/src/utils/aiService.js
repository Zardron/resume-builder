// AI Service - Simulates AI-powered features
// In production, these would call actual AI APIs

/**
 * Enhance professional summary with AI
 */
export const enhanceProfessionalSummary = async (summary, profession = 'professional') => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
  
  if (wordCount > 75) {
    // Summarize if too long
    const sentences = summary.split('.').filter(s => s.trim());
    return `Experienced ${profession} with proven expertise in delivering exceptional results. ${sentences.slice(0, 2).join('.')}. Committed to driving innovation and achieving organizational excellence through strategic leadership and continuous improvement.`;
  } else if (wordCount < 30) {
    // Enhance if too short
    return `Experienced ${profession} with a proven track record of delivering exceptional results. ${summary} Skilled in strategic planning, team leadership, and driving organizational growth through innovative solutions. Committed to excellence and continuous improvement in all professional endeavors.`;
  } else {
    // Optimize existing content
    return `Results-driven ${profession} with a proven track record of delivering exceptional outcomes. ${summary} Expertise in strategic planning, team leadership, and driving organizational growth through innovative solutions. Committed to excellence and continuous improvement.`;
  }
};

/**
 * Enhance job description with action verbs and quantifiable results
 */
export const enhanceJobDescription = async (description) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const actionVerbs = ['Led', 'Developed', 'Implemented', 'Managed', 'Optimized', 'Designed', 'Delivered', 'Improved', 'Increased', 'Reduced'];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  // Add action verbs and quantifiable results
  const sentences = description.split('.').filter(s => s.trim());
  const enhanced = sentences.map((sentence, index) => {
    if (index === 0 && !sentence.match(/^(Led|Developed|Implemented|Managed|Optimized|Designed|Delivered|Improved|Increased|Reduced)/i)) {
      return `${randomVerb} ${sentence.trim().toLowerCase()}`;
    }
    return sentence.trim();
  }).join('. ');
  
  // Add quantifiable results if not present
  if (!description.match(/\d+%|\d+\+|\$\d+/)) {
    return `${enhanced}. Achieved measurable results including improved efficiency and performance metrics.`;
  }
  
  return enhanced;
};

/**
 * Enhance project description
 */
export const enhanceProjectDescription = async (description) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const impactPhrases = [
    'delivered significant value',
    'achieved measurable results',
    'improved user experience',
    'increased efficiency',
    'reduced operational costs'
  ];
  
  const randomImpact = impactPhrases[Math.floor(Math.random() * impactPhrases.length)];
  
  if (description.length < 50) {
    return `${description} Successfully ${randomImpact} through innovative solutions and best practices.`;
  }
  
  // Enhance with impactful language
  return description
    .replace(/I\s+/gi, '')
    .replace(/my\s+/gi, '')
    .replace(/worked on/gi, 'developed')
    .replace(/made/gi, 'created')
    .replace(/did/gi, 'implemented') + `. ${randomImpact.charAt(0).toUpperCase() + randomImpact.slice(1)}.`;
};

/**
 * Check grammar and spelling
 */
export const checkGrammarAndSpelling = async (text) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Common grammar fixes
  const fixes = {
    'teh': 'the',
    'adn': 'and',
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
  };
  
  let corrected = text;
  Object.entries(fixes).forEach(([wrong, correct]) => {
    corrected = corrected.replace(new RegExp(wrong, 'gi'), correct);
  });
  
  return {
    corrected,
    errors: text !== corrected ? 1 : 0,
    suggestions: text !== corrected ? [`Replace "${text.match(new RegExp(Object.keys(fixes).join('|'), 'i'))?.[0]}" with correct spelling`] : []
  };
};

/**
 * Get action verb suggestions
 */
export const getActionVerbSuggestions = async (text) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const actionVerbs = [
    'Led', 'Developed', 'Implemented', 'Managed', 'Optimized', 'Designed',
    'Delivered', 'Improved', 'Increased', 'Reduced', 'Created', 'Built',
    'Established', 'Launched', 'Executed', 'Achieved', 'Transformed', 'Streamlined'
  ];
  
  // Find weak verbs and suggest replacements
  const weakVerbs = ['did', 'made', 'worked', 'helped', 'assisted', 'was', 'were'];
  const suggestions = [];
  
  weakVerbs.forEach(weak => {
    if (text.toLowerCase().includes(weak)) {
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      suggestions.push({
        original: weak,
        suggestion: randomVerb,
        context: `Replace "${weak}" with "${randomVerb}" for stronger impact`
      });
    }
  });
  
  return suggestions.length > 0 ? suggestions : [
    {
      original: 'current verb',
      suggestion: actionVerbs[Math.floor(Math.random() * actionVerbs.length)],
      context: 'Consider using stronger action verbs'
    }
  ];
};

/**
 * Rewrite bullet points to be more impactful
 */
export const rewriteBulletPoints = async (text) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const actionVerbs = ['Led', 'Developed', 'Implemented', 'Managed', 'Optimized', 'Delivered'];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  // Extract bullet points
  const bullets = text.split(/\n|•|-/).filter(b => b.trim());
  
  const rewritten = bullets.map(bullet => {
    let enhanced = bullet.trim();
    
    // Add action verb if missing
    if (!enhanced.match(/^(Led|Developed|Implemented|Managed|Optimized|Delivered|Created|Built)/i)) {
      enhanced = `${randomVerb} ${enhanced.toLowerCase()}`;
    }
    
    // Add quantifiable results if missing
    if (!enhanced.match(/\d+%|\d+\+|\$\d+/)) {
      enhanced += ', resulting in improved performance and efficiency';
    }
    
    return enhanced;
  }).join('\n• ');
  
  return `• ${rewritten}`;
};

/**
 * Get keyword suggestions based on job description
 */
export const getKeywordSuggestions = async (resumeText, jobDescription = '') => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const commonKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker',
    'Agile', 'Scrum', 'Leadership', 'Project Management', 'Team Collaboration',
    'Problem Solving', 'Communication', 'Analytical', 'Strategic Planning'
  ];
  
  // Extract keywords from job description if provided
  const jobKeywords = jobDescription
    .toLowerCase()
    .match(/\b(javascript|react|node|python|sql|aws|docker|agile|scrum|leadership|management|collaboration|communication|analytical|strategic)\w*\b/gi) || [];
  
  const suggestions = [...new Set([...commonKeywords, ...jobKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1))])];
  
  return {
    suggested: suggestions.slice(0, 10),
    missing: suggestions.filter(k => !resumeText.toLowerCase().includes(k.toLowerCase())).slice(0, 5)
  };
};

/**
 * Get readability score
 */
export const getReadabilityScore = async (text) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = words.reduce((sum, word) => {
    return sum + (word.match(/[aeiouy]+/gi) || []).length;
  }, 0) / words.length;
  
  // Simplified Flesch Reading Ease
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  let level = 'Good';
  let suggestions = [];
  
  if (score < 30) {
    level = 'Difficult';
    suggestions.push('Use shorter sentences', 'Simplify complex words', 'Break up long paragraphs');
  } else if (score < 50) {
    level = 'Fairly Difficult';
    suggestions.push('Consider shorter sentences', 'Use simpler language where possible');
  } else if (score < 70) {
    level = 'Standard';
    suggestions.push('Good readability, minor improvements possible');
  } else {
    level = 'Easy';
    suggestions.push('Excellent readability');
  }
  
  return {
    score: Math.round(score),
    level,
    suggestions,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10
  };
};

/**
 * Get ATS optimization suggestions
 */
export const getATSOptimization = async (resumeData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const suggestions = [];
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  // Check for common ATS issues
  if (!resumeData.personal_info?.email) {
    suggestions.push({ type: 'error', message: 'Missing email address' });
  }
  
  if (!resumeData.personal_info?.phone) {
    suggestions.push({ type: 'warning', message: 'Missing phone number' });
  }
  
  if (!resumeData.professional_summary) {
    suggestions.push({ type: 'warning', message: 'Missing professional summary' });
  }
  
  if (!resumeData.experience || resumeData.experience.length === 0) {
    suggestions.push({ type: 'error', message: 'Missing work experience' });
  }
  
  // Check for keywords
  const commonKeywords = ['skills', 'experience', 'education', 'achievements'];
  const missingSections = commonKeywords.filter(k => !resumeText.includes(k));
  
  if (missingSections.length > 0) {
    suggestions.push({
      type: 'info',
      message: `Consider adding: ${missingSections.join(', ')}`
    });
  }
  
  // Format suggestions
  const score = 100 - (suggestions.filter(s => s.type === 'error').length * 20) - (suggestions.filter(s => s.type === 'warning').length * 10);
  
  return {
    score: Math.max(0, score),
    suggestions,
    tips: [
      'Use standard section headings',
      'Include relevant keywords',
      'Use simple formatting',
      'Save as PDF for best compatibility'
    ]
  };
};

/**
 * Get resume score
 */
export const getResumeScore = async (resumeData) => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  let score = 0;
  const improvements = [];
  
  // Check completeness
  if (resumeData.personal_info?.name) score += 10;
  else improvements.push('Add your full name');
  
  if (resumeData.personal_info?.email) score += 10;
  else improvements.push('Add your email address');
  
  if (resumeData.professional_summary) score += 15;
  else improvements.push('Add a professional summary');
  
  if (resumeData.experience && resumeData.experience.length > 0) score += 25;
  else improvements.push('Add work experience');
  
  if (resumeData.education && resumeData.education.length > 0) score += 15;
  else improvements.push('Add education details');
  
  if (resumeData.skills && resumeData.skills.length > 0) score += 15;
  else improvements.push('Add skills section');
  
  if (resumeData.project && resumeData.project.length > 0) score += 10;
  else improvements.push('Consider adding projects');
  
  let strength = 'Needs Improvement';
  if (score >= 80) strength = 'Excellent';
  else if (score >= 60) strength = 'Good';
  else if (score >= 40) strength = 'Fair';
  
  return {
    score,
    strength,
    improvements,
    strengths: [
      score >= 80 ? 'Well-structured resume' : null,
      resumeData.professional_summary ? 'Strong professional summary' : null,
      resumeData.experience?.length > 2 ? 'Comprehensive experience' : null
    ].filter(Boolean)
  };
};

/**
 * Get industry-specific suggestions
 */
export const getIndustrySuggestions = async (resumeData, industry = 'Technology') => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const industryKeywords = {
    'Technology': ['Agile', 'DevOps', 'Cloud Computing', 'API Development', 'CI/CD'],
    'Finance': ['Financial Analysis', 'Risk Management', 'Compliance', 'Portfolio Management'],
    'Healthcare': ['Patient Care', 'HIPAA', 'Medical Records', 'Clinical Experience'],
    'Marketing': ['SEO', 'Content Marketing', 'Analytics', 'Campaign Management', 'Social Media'],
    'Education': ['Curriculum Development', 'Student Assessment', 'Educational Technology']
  };
  
  const keywords = industryKeywords[industry] || industryKeywords['Technology'];
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  const missing = keywords.filter(k => !resumeText.includes(k.toLowerCase()));
  
  return {
    industry,
    suggestedKeywords: keywords,
    missingKeywords: missing,
    suggestions: missing.length > 0 
      ? [`Consider adding industry-specific keywords: ${missing.slice(0, 3).join(', ')}`]
      : ['Good use of industry-relevant keywords']
  };
};

/**
 * Match resume against job description
 */
export const matchJobDescription = async (resumeData, jobDescription) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const jobText = jobDescription.toLowerCase();
  
  // Extract keywords from job description
  const jobKeywords = jobText.match(/\b\w{4,}\b/g) || [];
  const uniqueJobKeywords = [...new Set(jobKeywords)].slice(0, 20);
  
  // Find matches
  const matches = uniqueJobKeywords.filter(k => resumeText.includes(k));
  const matchPercentage = Math.round((matches.length / uniqueJobKeywords.length) * 100);
  
  const missing = uniqueJobKeywords.filter(k => !resumeText.includes(k)).slice(0, 5);
  
  return {
    matchPercentage,
    matchedKeywords: matches,
    missingKeywords: missing,
    suggestions: missing.length > 0 
      ? [`Add these keywords to improve match: ${missing.join(', ')}`]
      : ['Great keyword alignment!']
  };
};

/**
 * Analyze skill gaps
 */
export const analyzeSkillGaps = async (resumeData, targetRole = 'Software Engineer') => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const roleSkills = {
    'Software Engineer': ['JavaScript', 'React', 'Node.js', 'Git', 'SQL', 'AWS'],
    'Product Manager': ['Product Strategy', 'Agile', 'Stakeholder Management', 'Analytics'],
    'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization'],
    'Designer': ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'UI/UX']
  };
  
  const requiredSkills = roleSkills[targetRole] || roleSkills['Software Engineer'];
  const resumeSkills = resumeData.skills || [];
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  const missing = requiredSkills.filter(skill => 
    !resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase())) &&
    !resumeText.includes(skill.toLowerCase())
  );
  
  return {
    targetRole,
    requiredSkills,
    currentSkills: resumeSkills,
    missingSkills: missing,
    suggestions: missing.length > 0
      ? [`Consider learning or adding: ${missing.slice(0, 3).join(', ')}`]
      : ['You have the required skills for this role']
  };
};

/**
 * Get career path suggestions
 */
export const getCareerPathSuggestions = async (resumeData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const currentRole = resumeData.personal_info?.profession || 'Professional';
  const experience = resumeData.experience || [];
  const yearsOfExperience = experience.length;
  
  const suggestions = [];
  
  if (yearsOfExperience < 2) {
    suggestions.push({
      role: `${currentRole} → Senior ${currentRole}`,
      timeline: '2-3 years',
      steps: ['Gain more hands-on experience', 'Take on leadership opportunities', 'Complete relevant certifications']
    });
  } else if (yearsOfExperience < 5) {
    suggestions.push({
      role: `${currentRole} → Lead ${currentRole}`,
      timeline: '3-5 years',
      steps: ['Develop leadership skills', 'Mentor junior team members', 'Lead cross-functional projects']
    });
  } else {
    suggestions.push({
      role: `${currentRole} → Principal/Manager`,
      timeline: '5+ years',
      steps: ['Focus on strategic initiatives', 'Build strong network', 'Consider advanced education']
    });
  }
  
  return {
    currentLevel: yearsOfExperience < 2 ? 'Entry' : yearsOfExperience < 5 ? 'Mid' : 'Senior',
    suggestions
  };
};

/**
 * Generate cover letter
 */
export const generateCoverLetter = async (resumeData, jobDescription, companyName = 'Company') => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const name = resumeData.personal_info?.name || 'Your Name';
  const profession = resumeData.personal_info?.profession || 'professional';
  const experience = resumeData.experience?.[0] || {};
  
  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName}. As an experienced ${profession} with a proven track record of delivering exceptional results, I am excited about the opportunity to contribute to your team.

${resumeData.professional_summary || 'With extensive experience in my field, I bring a unique combination of skills and expertise.'}

In my previous role as ${experience.position || 'Professional'} at ${experience.company || 'my previous company'}, I ${experience.description?.toLowerCase() || 'gained valuable experience and achieved significant results'}. This experience has prepared me well for the challenges and opportunities at ${companyName}.

I am particularly drawn to ${companyName} because of [your company's mission/values/specific reason]. I am confident that my skills and experience align well with your requirements, and I would welcome the opportunity to discuss how I can contribute to your team's success.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}`;
  
  return coverLetter;
};

/**
 * Generate interview questions
 */
export const generateInterviewQuestions = async (resumeData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const profession = resumeData.personal_info?.profession || 'professional';
  const experience = resumeData.experience || [];
  
  const questions = [
    {
      question: `Tell me about yourself and your experience as a ${profession}.`,
      answer: `I am an experienced ${profession} with ${experience.length} years of experience. ${resumeData.professional_summary || 'I have a strong background in my field with a proven track record of success.'}`
    },
    {
      question: `What is your greatest professional achievement?`,
      answer: experience[0]?.description || 'One of my greatest achievements was [describe a significant accomplishment from your experience].'
    },
    {
      question: `Why are you interested in this position?`,
      answer: `I am interested in this position because it aligns with my career goals and allows me to leverage my skills in [mention relevant skills from your resume].`
    },
    {
      question: `What are your strengths?`,
      answer: `My key strengths include ${(resumeData.skills || []).slice(0, 3).join(', ') || 'problem-solving, communication, and teamwork'}.`
    },
    {
      question: `Where do you see yourself in 5 years?`,
      answer: `In 5 years, I see myself in a leadership role, continuing to grow professionally while contributing to organizational success.`
    }
  ];
  
  return questions;
};

/**
 * Estimate salary range
 */
export const estimateSalaryRange = async (resumeData, location = 'United States', role = '') => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const experience = resumeData.experience || [];
  const yearsOfExperience = experience.length;
  const profession = resumeData.personal_info?.profession || role || 'Professional';
  
  // Base salary ranges (simplified)
  const baseRanges = {
    'Software Engineer': { min: 80000, max: 150000 },
    'Product Manager': { min: 90000, max: 160000 },
    'Data Scientist': { min: 95000, max: 170000 },
    'Designer': { min: 70000, max: 130000 },
    'Marketing Manager': { min: 75000, max: 140000 }
  };
  
  const baseRange = baseRanges[profession] || { min: 60000, max: 120000 };
  
  // Adjust based on experience
  const experienceMultiplier = 1 + (yearsOfExperience * 0.1);
  const min = Math.round(baseRange.min * experienceMultiplier);
  const max = Math.round(baseRange.max * experienceMultiplier);
  
  return {
    role: profession,
    location,
    yearsOfExperience,
    range: {
      min,
      max,
      average: Math.round((min + max) / 2)
    },
    factors: [
      `Based on ${yearsOfExperience} years of experience`,
      `Location: ${location}`,
      `Role: ${profession}`
    ]
  };
};

