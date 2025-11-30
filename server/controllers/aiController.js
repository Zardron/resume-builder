import { GoogleGenerativeAI } from '@google/generative-ai';
import { logInfo, logError } from '../utils/logger.js';

// Initialize Gemini AI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Helper function to call Gemini API
const callGemini = async (prompt, systemInstruction = null) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are a professional resume writing assistant. Provide helpful, accurate, and professional suggestions.'
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logError('Gemini API Error', error);
    if (error.message.includes('GEMINI_API_KEY')) {
      throw new Error('AI service is not configured. Please contact support.');
    }
    throw new Error(`AI service error: ${error.message}`);
  }
};

// Helper to parse JSON response from AI
const parseAIResponse = (text) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { result: text };
  } catch (error) {
    return { result: text };
  }
};

// 1. Professional Summary Enhancement
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { summary, profession = 'professional' } = req.body;

    if (!summary) {
      return res.status(400).json({ success: false, message: 'Summary is required' });
    }

    const prompt = `Enhance the following professional summary for a ${profession}. Make it more impactful, professional, and results-oriented. Keep it concise (2-3 sentences, 50-75 words). Return only the enhanced summary without any additional text.

Original summary:
${summary}`;

    const enhanced = await callGemini(prompt);
    
    res.json({ success: true, data: { enhancedSummary: enhanced.trim() } });
  } catch (error) {
    logError('Enhance Professional Summary Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Job Description Enhancement
export const enhanceJobDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: 'Job description is required' });
    }

    const prompt = `Enhance the following job description with strong action verbs and quantifiable results. Make it more impactful and professional. Return only the enhanced description.

Original description:
${description}`;

    const enhanced = await callGemini(prompt);
    
    res.json({ success: true, data: { enhancedDescription: enhanced.trim() } });
  } catch (error) {
    logError('Enhance Job Description Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Project Description Enhancement
export const enhanceProjectDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: 'Project description is required' });
    }

    const prompt = `Enhance the following project description with impactful language and achievements. Make it more professional and results-oriented. Return only the enhanced description.

Original description:
${description}`;

    const enhanced = await callGemini(prompt);
    
    res.json({ success: true, data: { enhancedDescription: enhanced.trim() } });
  } catch (error) {
    logError('Enhance Project Description Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Grammar & Spell Check
export const checkGrammarAndSpelling = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const prompt = `Check the following text for grammar and spelling errors. Return a JSON object with:
- "corrected": the corrected text
- "errors": array of error objects with "original", "corrected", and "suggestion" fields
- "errorCount": number of errors found

Text to check:
${text}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    // Fallback if AI doesn't return proper JSON
    if (!result.corrected) {
      result.corrected = text;
      result.errors = [];
      result.errorCount = 0;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    logError('Grammar Check Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Action Verb Suggestions
export const getActionVerbSuggestions = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const prompt = `Analyze the following text and suggest powerful action verbs to replace weak verbs. Return a JSON array of suggestions, each with:
- "original": the weak verb or phrase
- "suggestion": the strong action verb
- "context": brief explanation

Text:
${text}

Return only valid JSON array.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    const suggestions = Array.isArray(result) ? result : (result.suggestions || []);
    
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    logError('Action Verb Suggestions Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Smart Bullet Point Rewriting
export const rewriteBulletPoints = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const prompt = `Rewrite the following bullet points to be more impactful and results-oriented. Use strong action verbs and add quantifiable results where appropriate. Return only the rewritten bullet points, one per line with bullet points.

Original bullet points:
${text}`;

    const rewritten = await callGemini(prompt);
    
    res.json({ success: true, data: { rewritten: rewritten.trim() } });
  } catch (error) {
    logError('Rewrite Bullet Points Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Keyword Suggestions
export const getKeywordSuggestions = async (req, res) => {
  try {
    const { resumeText, jobDescription = '' } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }

    const prompt = `Analyze the resume text and job description. Suggest relevant keywords that should be included in the resume. Return a JSON object with:
- "suggested": array of suggested keywords
- "missing": array of keywords from job description that are missing in resume

Resume text:
${resumeText}

Job description:
${jobDescription || 'Not provided'}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({ 
      success: true, 
      data: {
        suggested: result.suggested || [],
        missing: result.missing || []
      }
    });
  } catch (error) {
    logError('Keyword Suggestions Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Readability Score
export const getReadabilityScore = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    // Calculate basic readability metrics
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWords = words.length / sentences.length || 0;
    
    // Simple syllable estimation
    const avgSyllables = words.reduce((sum, word) => {
      return sum + (word.match(/[aeiouy]+/gi) || []).length;
    }, 0) / words.length || 0;
    
    const score = 206.835 - (1.015 * avgWords) - (84.6 * avgSyllables);
    
    const prompt = `Analyze the readability of the following text and provide suggestions for improvement. Return a JSON object with:
- "level": readability level (Easy, Standard, Fairly Difficult, Difficult)
- "suggestions": array of improvement suggestions

Text:
${text}

Return only valid JSON.`;

    const aiResponse = await callGemini(prompt);
    const aiResult = parseAIResponse(aiResponse);
    
    let level = 'Good';
    if (score < 30) level = 'Difficult';
    else if (score < 50) level = 'Fairly Difficult';
    else if (score < 70) level = 'Standard';
    else level = 'Easy';
    
    res.json({
      success: true,
      data: {
        score: Math.round(score),
        level: aiResult.level || level,
        suggestions: aiResult.suggestions || [],
        avgWordsPerSentence: Math.round(avgWords * 10) / 10,
        avgSyllablesPerWord: Math.round(avgSyllables * 10) / 10
      }
    });
  } catch (error) {
    logError('Readability Score Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. ATS Optimization
export const getATSOptimization = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Analyze the following resume data for ATS (Applicant Tracking System) optimization. Return a JSON object with:
- "score": ATS compatibility score (0-100)
- "suggestions": array of suggestion objects with "type" (error/warning/info) and "message"
- "tips": array of general ATS optimization tips

Resume data:
${resumeText}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    // Basic validation
    const suggestions = result.suggestions || [];
    const score = result.score || 75;
    
    res.json({
      success: true,
      data: {
        score: Math.max(0, Math.min(100, score)),
        suggestions,
        tips: result.tips || [
          'Use standard section headings',
          'Include relevant keywords',
          'Use simple formatting',
          'Save as PDF for best compatibility'
        ]
      }
    });
  } catch (error) {
    logError('ATS Optimization Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. AI Resume Scoring
export const getResumeScore = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Analyze the following resume and provide a comprehensive score. Return a JSON object with:
- "score": overall resume strength score (0-100)
- "strength": strength level (Needs Improvement, Fair, Good, Excellent)
- "improvements": array of improvement suggestions
- "strengths": array of resume strengths

Resume data:
${resumeText}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        score: result.score || 70,
        strength: result.strength || 'Good',
        improvements: result.improvements || [],
        strengths: result.strengths || []
      }
    });
  } catch (error) {
    logError('Resume Scoring Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. Industry-Specific Suggestions
export const getIndustrySuggestions = async (req, res) => {
  try {
    const { resumeData, industry = 'Technology' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Analyze the resume for industry-specific optimization in the ${industry} industry. Return a JSON object with:
- "industry": the industry name
- "suggestedKeywords": array of industry-relevant keywords
- "missingKeywords": array of missing keywords that should be added
- "suggestions": array of industry-specific improvement suggestions

Resume data:
${resumeText}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        industry: result.industry || industry,
        suggestedKeywords: result.suggestedKeywords || [],
        missingKeywords: result.missingKeywords || [],
        suggestions: result.suggestions || []
    }
    });
  } catch (error) {
    logError('Industry Suggestions Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 12. Job Description Matching
export const matchJobDescription = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Resume data and job description are required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Compare the resume against the job description and calculate a match percentage. Return a JSON object with:
- "matchPercentage": match score (0-100)
- "matchedKeywords": array of keywords that match
- "missingKeywords": array of important keywords from job description that are missing
- "suggestions": array of suggestions to improve the match

Resume data:
${resumeText}

Job description:
${jobDescription}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        matchPercentage: result.matchPercentage || 70,
        matchedKeywords: result.matchedKeywords || [],
        missingKeywords: result.missingKeywords || [],
        suggestions: result.suggestions || []
      }
    });
  } catch (error) {
    logError('Job Matching Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 13. Skill Gap Analysis
export const analyzeSkillGaps = async (req, res) => {
  try {
    const { resumeData, targetRole = 'Software Engineer' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Analyze the resume for skill gaps for the target role: ${targetRole}. Return a JSON object with:
- "targetRole": the target role
- "requiredSkills": array of skills required for this role
- "currentSkills": array of skills found in the resume
- "missingSkills": array of missing skills
- "suggestions": array of suggestions to bridge the gap

Resume data:
${resumeText}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        targetRole: result.targetRole || targetRole,
        requiredSkills: result.requiredSkills || [],
        currentSkills: result.currentSkills || [],
        missingSkills: result.missingSkills || [],
        suggestions: result.suggestions || []
      }
    });
  } catch (error) {
    logError('Skill Gap Analysis Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 14. Career Path Suggestions
export const getCareerPathSuggestions = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Analyze the resume and suggest career progression paths. Return a JSON object with:
- "currentLevel": current career level (Entry, Mid, Senior)
- "suggestions": array of career path suggestions, each with "role", "timeline", and "steps" (array)

Resume data:
${resumeText}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        currentLevel: result.currentLevel || 'Mid',
        suggestions: result.suggestions || []
      }
    });
  } catch (error) {
    logError('Career Path Suggestions Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 15. AI Cover Letter Generation
export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName = 'Company' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Generate a professional cover letter based on the resume and job description. The cover letter should be:
- Personalized to the company: ${companyName}
- Tailored to the job description
- Professional and compelling
- 3-4 paragraphs

Resume data:
${resumeText}

Job description:
${jobDescription || 'Not provided'}

Return only the cover letter text, no additional formatting or explanations.`;

    const coverLetter = await callGemini(prompt);
    
    res.json({
      success: true,
      data: { coverLetter: coverLetter.trim() }
    });
  } catch (error) {
    logError('Cover Letter Generation Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 16. AI Interview Preparation
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Generate 5 common interview questions and suggested answers based on the resume. Return a JSON array of objects, each with:
- "question": the interview question
- "answer": a suggested answer based on the resume

Resume data:
${resumeText}

Return only valid JSON array.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    const questions = Array.isArray(result) ? result : (result.questions || []);
    
    res.json({
      success: true,
      data: { questions }
    });
  } catch (error) {
    logError('Interview Questions Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 17. Salary Range Estimation
export const estimateSalaryRange = async (req, res) => {
  try {
    const { resumeData, location = 'United States', role = '' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const resumeText = JSON.stringify(resumeData);
    
    const prompt = `Estimate a salary range based on the resume. Return a JSON object with:
- "role": the job role
- "location": the location
- "yearsOfExperience": estimated years of experience
- "range": object with "min", "max", and "average" salary
- "factors": array of factors considered

Resume data:
${resumeText}

Location: ${location}
Role: ${role || 'Based on resume'}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: {
        role: result.role || role,
        location: result.location || location,
        yearsOfExperience: result.yearsOfExperience || 0,
        range: result.range || { min: 60000, max: 120000, average: 90000 },
        factors: result.factors || []
      }
    });
  } catch (error) {
    logError('Salary Estimation Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 18. AI Resume Parsing (for file upload)
export const parseResume = async (req, res) => {
  try {
    const { fileContent, fileType } = req.body;

    if (!fileContent) {
      return res.status(400).json({ success: false, message: 'File content is required' });
    }

    // For now, we'll use text extraction. In production, you'd use a PDF/DOCX parser first
    const prompt = `Parse the following resume content and extract structured data. Return a JSON object with:
- "personal_info": object with name, email, phone, address, profession
- "professional_summary": string
- "experience": array of experience objects with position, company, start_date, end_date, is_current, description
- "education": array of education objects with degree, field, institution, start_date, end_date, is_current
- "skills": array of skills
- "certifications": array of certifications (if any)
- "projects": array of projects (if any)

Resume content:
${fileContent}

Return only valid JSON.`;

    const response = await callGemini(prompt);
    const result = parseAIResponse(response);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logError('Resume Parsing Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 19. AI Background Removal (placeholder - would need image processing service)
export const removeBackground = async (req, res) => {
  try {
    // This would typically use a service like Remove.bg API or similar
    // For now, return a placeholder response
    res.status(501).json({ 
      success: false, 
      message: 'Background removal requires image processing service integration' 
    });
  } catch (error) {
    logError('Background Removal Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 20. AI Content Enhancement (general)
export const enhanceContent = async (req, res) => {
  try {
    const { content, contentType = 'general' } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const prompt = `Enhance the following ${contentType} content to make it more professional, impactful, and engaging. Return only the enhanced content.

Original content:
${content}`;

    const enhanced = await callGemini(prompt);
    
    res.json({ success: true, data: { enhancedContent: enhanced.trim() } });
  } catch (error) {
    logError('Content Enhancement Error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

