import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Star,
  User,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  Languages,
  Heart,
} from "lucide-react";
import {
  getSectionFontSize,
  getNameFontSize,
  getSectionHeaderFontSize,
  getDateFontSize,
  getCompanyFontSize,
  getLocationFontSize,
  getTextColorForBackground,
} from "../../utils/fontSizeUtils";
import {
  getDefaultMarginsForPaper,
  getPagePaddingStyle,
} from "../../utils/marginUtils";
import { filterPopulatedProjects, formatUrlForDisplay } from "../../utils/sectionUtils";
import WatermarkOverlay from "./WatermarkOverlay";

const ExecutiveTemplate = ({
  data,
  accentColor,
  availableCredits = 0,
  sectionFontSizes = {},
  showHeader = true,
  showProfessionalSummary = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showSkills = true,
  paperSize = "A4",
  pageMargins,
  isDownloadMode = false,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getProfileImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image?.dataUrl) return image.dataUrl;
    if (image instanceof File) {
      if (!image.previewUrl) {
        image.previewUrl = URL.createObjectURL(image);
      }
      return image.previewUrl;
    }
    return null;
  };

  const getSocialIcon = (platform) => {
    const iconMap = {
      linkedin: Linkedin,
      website: Globe,
      github: Github,
      twitter: Twitter,
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      telegram: MessageCircle,
    };
    return iconMap[platform] || Globe;
  };

  const formatSocialValue = (value) => {
    if (!value) return "";
    const trimmed = value.trim();
    try {
      const prefixed = trimmed.match(/^https?:\/\//i)
        ? trimmed
        : `https://${trimmed}`;
      const url = new URL(prefixed);
      const host = url.hostname.replace(/^www\./i, "");
      const pathname = url.pathname.replace(/^\/+/, "");
      const search = url.search.replace(/^\?/, "");
      const hash = url.hash.replace(/^#/, "");
      const path = [pathname, search].filter(Boolean).join(search ? "?" : "");
      const fullPath = [path, hash].filter(Boolean).join("#");
      return [host, fullPath].filter(Boolean).join("/");
    } catch {
      return trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    }
  };

  const getSocialLinks = () => {
    const socialPlatforms = [
      "linkedin",
      "website",
      "github",
      "twitter",
      "instagram",
      "youtube",
      "facebook",
      "telegram",
    ];
    return socialPlatforms
      .filter(
        (platform) =>
          data.personal_info?.[platform] &&
          data.personal_info[platform].trim() !== ""
      )
      .map((platform) => ({
        platform,
        value: data.personal_info[platform],
        displayValue: formatSocialValue(data.personal_info[platform]),
        icon: getSocialIcon(platform),
      }));
  };

  const paddingStyle = getPagePaddingStyle(
    pageMargins,
    getDefaultMarginsForPaper(paperSize)
  );

  const printHeightClass =
    {
      short: "print:min-h-[1056px]",
      A4: "print:min-h-[1123px]",
      legal: "print:min-h-[1344px]",
    }[paperSize] || "print:min-h-[1123px]";

  const heightMap = {
    short: "1056px",
    A4: "1123px",
    legal: "1344px",
  };

  const containerStyle = {
    ...paddingStyle,
  };

  const showWatermark = availableCredits <= 0;
  const containerOverflowClass =
    isDownloadMode && showWatermark ? "overflow-visible" : "overflow-hidden";
  const projectsToRender = filterPopulatedProjects(data.projects);

  if (isDownloadMode) {
    containerStyle.minHeight = heightMap[paperSize] || heightMap.A4;
  }

  const pageStyle = { ...containerStyle };
  const contentPaddingStyle = {};
  ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].forEach((key) => {
    if (pageStyle[key] !== undefined) {
      contentPaddingStyle[key] = pageStyle[key];
      delete pageStyle[key];
    }
  });

  const textColor = getTextColorForBackground(accentColor);
  const textColorClass = textColor === "black" ? "text-gray-900" : "text-white";

  return (
    <div
      id={isDownloadMode ? "resume-print-content" : undefined}
      data-paper-size={paperSize}
      className={`relative max-w-4xl mx-auto bg-white text-gray-900 font-sans ${containerOverflowClass} ${printHeightClass}`}
      style={pageStyle}
    >
      {isDownloadMode && showWatermark && (
        <WatermarkOverlay paperSize={paperSize} />
      )}
      <div
        className="relative z-10 flex"
        style={{ minHeight: "100%", ...contentPaddingStyle }}
      >
        {/* Sidebar */}
        <div
          className="w-1/3 flex-shrink-0 text-white p-4"
          style={{ backgroundColor: accentColor }}
        >
          {/* Profile Image */}
          {showHeader && (
            <div className="mb-4 flex justify-center">
              {getProfileImageSrc(data.personal_info?.image) ? (
                <img
                  src={getProfileImageSrc(data.personal_info?.image)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                  <User className="size-12 text-white" />
                </div>
              )}
            </div>
          )}

          {/* Name and Title */}
          {showHeader && (
            <div className="mb-6 text-center">
              <h1
                className={`${getNameFontSize(
                  sectionFontSizes
                )} font-bold mb-2 text-white`}
              >
                {data.personal_info?.name || "Your Name"}
              </h1>
              {data.personal_info?.profession && (
                <p
                  className={`${getSectionFontSize(
                    sectionFontSizes,
                    "title"
                  )} text-white/90 font-medium`}
                >
                  {data.personal_info.profession}
                </p>
              )}
            </div>
          )}

          {/* Contact Info */}
          {showHeader && (
            <div className="mb-6 space-y-3">
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 flex-shrink-0" />
                  <span className="text-sm text-white/90 break-all">
                    {data.personal_info.email}
                  </span>
                </div>
              )}
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 flex-shrink-0" />
                  <span className="text-sm text-white/90">
                    {data.personal_info.phone}
                  </span>
                </div>
              )}
              {data.personal_info?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90">
                    {data.personal_info.address}
                  </span>
                </div>
              )}
              {getSocialLinks().map((socialLink, index) => {
                const IconComponent = socialLink.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="size-4 flex-shrink-0" />
                    <span className="text-sm text-white/90 break-all">
                      {socialLink.displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Skills */}
          {showSkills && data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-white mb-3 uppercase tracking-wide`}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm text-white/90 bg-white/10 rounded px-2 py-1"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-white mb-3 uppercase tracking-wide`}
              >
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-white/90">{lang.language}</span>
                    <span className="text-white/70 capitalize">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Professional Summary */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-4">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-gray-900 mb-2 uppercase tracking-wide border-b-2 pb-1`}
                style={{ borderBottomColor: accentColor }}
              >
                Professional Summary
              </h2>
              <p
                className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                  sectionFontSizes,
                  "summary"
                )}`}
              >
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {showExperience && data.experience && data.experience.length > 0 && (
            <section className="mb-4">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 pb-1 flex items-center gap-2`}
                style={{ borderBottomColor: accentColor }}
              >
                <Briefcase className="size-4" style={{ color: accentColor }} />
                Professional Experience
              </h2>
              <div className="space-y-3">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 pl-3" style={{ borderLeftColor: accentColor }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "experience"
                          )} font-bold text-gray-900`}
                        >
                          {exp.position}
                        </h3>
                        <p
                          className={`${getCompanyFontSize(
                            sectionFontSizes
                          )} font-semibold`}
                          style={{ color: accentColor }}
                        >
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p
                            className={`${getLocationFontSize(
                              sectionFontSizes
                            )} text-gray-600`}
                          >
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <span
                        className={`${getDateFontSize(
                          sectionFontSizes
                        )} text-gray-600 font-medium`}
                      >
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.description && (
                      <p
                        className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                          sectionFontSizes,
                          "job_descriptions"
                        )} whitespace-pre-line`}
                      >
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {showProjects && projectsToRender.length > 0 && (
            <section className="mb-4">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 pb-1 flex items-center gap-2`}
                style={{ borderBottomColor: accentColor }}
              >
                <Code2 className="size-4" style={{ color: accentColor }} />
                Key Projects
              </h2>
              <div className="space-y-2">
                {projectsToRender.map((proj, index) => (
                  <div key={index} className="border-l-2 pl-3" style={{ borderLeftColor: accentColor }}>
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "projects"
                      )} font-bold text-gray-900`}
                    >
                      {proj.title}
                    </h3>
                    {proj.technologies && (
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: accentColor }}
                      >
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p
                        className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                          sectionFontSizes,
                          "job_descriptions"
                        )}`}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.link && (
                      <p
                        className="text-xs break-all"
                        style={{ color: accentColor }}
                      >
                        {formatUrlForDisplay(proj.link)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {showEducation && data.education && data.education.length > 0 && (
            <section className="mb-4">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 pb-1 flex items-center gap-2`}
                style={{ borderBottomColor: accentColor }}
              >
                <GraduationCap className="size-4" style={{ color: accentColor }} />
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-2 pl-3" style={{ borderLeftColor: accentColor }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "education"
                          )} font-bold text-gray-900`}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className={`${getCompanyFontSize(
                            sectionFontSizes
                          )} font-semibold`}
                          style={{ color: accentColor }}
                        >
                          {edu.institution}
                        </p>
                        {edu.location && (
                          <p
                            className={`${getLocationFontSize(
                              sectionFontSizes
                            )} text-gray-600`}
                          >
                            {edu.location}
                          </p>
                        )}
                      </div>
                      <span
                        className={`${getDateFontSize(
                          sectionFontSizes
                        )} text-gray-600 font-medium`}
                      >
                        {formatDate(edu.start_date)} -{" "}
                        {edu.is_current
                          ? "Present"
                          : formatDate(edu.end_date)}
                      </span>
                    </div>
                    {edu.description && (
                      <p
                        className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                          sectionFontSizes,
                          "job_descriptions"
                        )} mt-1 whitespace-pre-line`}
                      >
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Sections */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-4">
              <h2
                className={`${getSectionHeaderFontSize(
                  sectionFontSizes
                )} font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 pb-1 flex items-center gap-2`}
                style={{ borderBottomColor: accentColor }}
              >
                <Award className="size-4" style={{ color: accentColor }} />
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "certifications",
                        "small"
                      )} font-bold text-gray-900`}
                    >
                      {cert.name}
                    </h3>
                    <p
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "certifications",
                        "small"
                      )} font-semibold`}
                      style={{ color: accentColor }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;

