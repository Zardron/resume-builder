import { aiAPI } from '../services/api.js';

// All AI service functions now call the backend API
export const enhanceProfessionalSummary = async (summary, profession = 'professional') => {
  try {
    return await aiAPI.enhanceSummary(summary, profession);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
};

export const enhanceJobDescription = async (description) => {
  try {
    return await aiAPI.enhanceJobDescription(description);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
};

export const enhanceProjectDescription = async (description) => {
  try {
    return await aiAPI.enhanceProjectDescription(description);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
};

export const checkGrammarAndSpelling = async (text) => {
  try {
    return await aiAPI.checkGrammar(text);
  } catch (error) {
    console.error('Grammar check error:', error);
    throw error;
  }
};

export const getActionVerbSuggestions = async (text) => {
  try {
    return await aiAPI.getActionVerbs(text);
  } catch (error) {
    console.error('Action verb suggestions error:', error);
    throw error;
  }
};

export const rewriteBulletPoints = async (text) => {
  try {
    return await aiAPI.rewriteBullets(text);
  } catch (error) {
    console.error('Bullet rewriting error:', error);
    throw error;
  }
};

export const getKeywordSuggestions = async (resumeText, jobDescription = '') => {
  try {
    return await aiAPI.getKeywords(resumeText, jobDescription);
  } catch (error) {
    console.error('Keyword suggestions error:', error);
    throw error;
  }
};

export const getReadabilityScore = async (text) => {
  try {
    return await aiAPI.getReadability(text);
  } catch (error) {
    console.error('Readability score error:', error);
    throw error;
  }
};

export const getATSOptimization = async (resumeData) => {
  try {
    return await aiAPI.getATSOptimization(resumeData);
  } catch (error) {
    console.error('ATS optimization error:', error);
    throw error;
  }
};

export const getResumeScore = async (resumeData) => {
  try {
    return await aiAPI.getResumeScore(resumeData);
  } catch (error) {
    console.error('Resume scoring error:', error);
    throw error;
  }
};

export const getIndustrySuggestions = async (resumeData, industry = 'Technology') => {
  try {
    return await aiAPI.getIndustrySuggestions(resumeData, industry);
  } catch (error) {
    console.error('Industry suggestions error:', error);
    throw error;
  }
};

export const matchJobDescription = async (resumeData, jobDescription) => {
  try {
    return await aiAPI.matchJobDescription(resumeData, jobDescription);
  } catch (error) {
    console.error('Job matching error:', error);
    throw error;
  }
};

export const analyzeSkillGaps = async (resumeData, targetRole = 'Software Engineer') => {
  try {
    return await aiAPI.analyzeSkillGaps(resumeData, targetRole);
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    throw error;
  }
};

export const getCareerPathSuggestions = async (resumeData) => {
  try {
    return await aiAPI.getCareerPath(resumeData);
  } catch (error) {
    console.error('Career path suggestions error:', error);
    throw error;
  }
};

export const generateCoverLetter = async (resumeData, jobDescription, companyName = 'Company') => {
  try {
    return await aiAPI.generateCoverLetter(resumeData, jobDescription, companyName);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw error;
  }
};

export const generateInterviewQuestions = async (resumeData) => {
  try {
    return await aiAPI.generateInterviewQuestions(resumeData);
  } catch (error) {
    console.error('Interview questions error:', error);
    throw error;
  }
};

export const estimateSalaryRange = async (resumeData, location = 'United States', role = '') => {
  try {
    return await aiAPI.estimateSalary(resumeData, location, role);
  } catch (error) {
    console.error('Salary estimation error:', error);
    throw error;
  }
};
