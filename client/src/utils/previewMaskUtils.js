const LOCK_PLACEHOLDER = "[Locked Preview]";
const LOCK_SUMMARY_PLACEHOLDER =
  "Live preview hidden. Add credits to see your fully formatted resume.";

const maskString = (value, fallback = LOCK_PLACEHOLDER) =>
  value && String(value).trim().length > 0 ? fallback : "";

const maskList = (list, templateFactory) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  return list.map(() => templateFactory());
};

const maskExperience = (experience) =>
  maskList(experience, () => ({
    position: LOCK_PLACEHOLDER,
    company: "Locked Company",
    location: "Hidden Location",
    description: LOCK_PLACEHOLDER,
    start_date: "",
    end_date: "",
    is_current: false,
    achievements: [],
  }));

const maskEducation = (education) =>
  maskList(education, () => ({
    degree: LOCK_PLACEHOLDER,
    institution: "Hidden Institution",
    location: "Hidden Location",
    description: LOCK_PLACEHOLDER,
    start_date: "",
    end_date: "",
    is_current: false,
  }));

const maskProjects = (projects) =>
  maskList(projects, () => ({
    title: LOCK_PLACEHOLDER,
    description: LOCK_PLACEHOLDER,
    technologies: "Hidden Tech Stack",
    link: "",
  }));

const maskSimpleList = (list) =>
  Array.isArray(list) && list.length > 0
    ? Array(list.length).fill(LOCK_PLACEHOLDER)
    : [];

const maskLanguages = (languages) =>
  maskList(languages, () => ({
    language: LOCK_PLACEHOLDER,
    proficiency: "hidden",
  }));

const maskCertifications = (certifications) =>
  maskList(certifications, () => ({
    name: LOCK_PLACEHOLDER,
    issuer: "Hidden Issuer",
    credential_id: "",
    date: "",
  }));

const maskAchievements = (achievements) =>
  maskList(achievements, () => ({
    title: LOCK_PLACEHOLDER,
    description: LOCK_PLACEHOLDER,
    date: "",
  }));

const maskVolunteerWork = (volunteerWork) =>
  maskList(volunteerWork, () => ({
    position: LOCK_PLACEHOLDER,
    organization: "Hidden Organization",
    description: LOCK_PLACEHOLDER,
    start_date: "",
    end_date: "",
    is_current: false,
  }));

export const createLockedPreviewData = (resumeData = {}) => {
  const personalInfo = resumeData.personal_info || {};

  return {
    ...resumeData,
    title: maskString(resumeData.title),
    personal_info: {
      ...personalInfo,
      name: maskString(personalInfo.name, "Locked Name"),
      email: maskString(personalInfo.email, "hidden@email.com"),
      phone: maskString(personalInfo.phone, "000-000-0000"),
      address: maskString(personalInfo.address, "Hidden Address"),
      location: maskString(personalInfo.location, "Hidden Location"),
      profession: maskString(personalInfo.profession, "Locked Profession"),
      linkedin: maskString(personalInfo.linkedin, "linkedin.com/locked"),
      github: maskString(personalInfo.github, "github.com/locked"),
      website: maskString(personalInfo.website, "locked-site.com"),
      twitter: maskString(personalInfo.twitter, "@hidden"),
      instagram: maskString(personalInfo.instagram, "@hidden"),
      youtube: maskString(personalInfo.youtube, "youtube.com/hidden"),
      facebook: maskString(personalInfo.facebook, "facebook.com/hidden"),
      telegram: maskString(personalInfo.telegram, "@hidden"),
      summary: maskString(personalInfo.summary, LOCK_SUMMARY_PLACEHOLDER),
      image: null,
    },
    professional_summary: maskString(
      resumeData.professional_summary,
      LOCK_SUMMARY_PLACEHOLDER
    ),
    experience: maskExperience(resumeData.experience),
    education: maskEducation(resumeData.education),
    projects: maskProjects(resumeData.projects),
    skills: maskSimpleList(resumeData.skills),
    soft_skills: maskSimpleList(resumeData.soft_skills),
    languages: maskLanguages(resumeData.languages),
    certifications: maskCertifications(resumeData.certifications),
    achievements: maskAchievements(resumeData.achievements),
    volunteer_work: maskVolunteerWork(resumeData.volunteer_work),
  };
};

