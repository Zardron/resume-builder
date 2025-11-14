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

const FormalTemplate = ({
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

  return (
    <div
      id={isDownloadMode ? "resume-print-content" : undefined}
      data-paper-size={paperSize}
      className={`relative max-w-4xl mx-auto bg-white text-gray-900 font-serif ${containerOverflowClass} ${printHeightClass}`}
      style={pageStyle}
    >
      {isDownloadMode && showWatermark && (
        <WatermarkOverlay paperSize={paperSize} />
      )}
      <div
        className="relative z-10 flex flex-col"
        style={{ minHeight: "100%", ...contentPaddingStyle }}
      >
        <div className="flex-1">
          {/* Formal Header */}
          {showHeader && (
            <header className="mb-8 text-center border-b-4 pb-6" style={{ borderBottomColor: accentColor }}>
              <h1
                className={`${getNameFontSize(
                  sectionFontSizes
                )} font-bold mb-3 text-gray-900 tracking-wider uppercase`}
              >
                {data.personal_info?.name || "Your Name"}
              </h1>
              {data.personal_info?.profession && (
                <p
                  className={`${getSectionFontSize(
                    sectionFontSizes,
                    "title"
                  )} font-medium mb-6 text-gray-700`}
                >
                  {data.personal_info.profession}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {data.personal_info?.email && (
                  <span className="text-gray-700">{data.personal_info.email}</span>
                )}
                {data.personal_info?.phone && (
                  <span className="text-gray-700">{data.personal_info.phone}</span>
                )}
                {data.personal_info?.address && (
                  <span className="text-gray-700">{data.personal_info.address}</span>
                )}
                {getSocialLinks().map((socialLink, index) => (
                  <span key={index} className="text-gray-700 break-all">
                    {socialLink.displayValue}
                  </span>
                ))}
              </div>
            </header>
          )}

          {/* Professional Summary */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-8">
              <div className="text-center mb-4">
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 mb-2 uppercase tracking-widest`}
                >
                  Professional Summary
                </h2>
                <div className="w-32 h-1 mx-auto" style={{ backgroundColor: accentColor }}></div>
              </div>
              <p
                className={`text-gray-700 leading-relaxed text-center ${getSectionFontSize(
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
            <section className="mb-8">
              <div className="text-center mb-6">
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 mb-2 uppercase tracking-widest`}
                >
                  Professional Experience
                </h2>
                <div className="w-32 h-1 mx-auto" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="text-center border-b pb-4" style={{ borderBottomColor: accentColor }}>
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "experience"
                      )} font-bold text-gray-900 mb-1`}
                    >
                      {exp.position}
                    </h3>
                    <p
                      className={`${getCompanyFontSize(
                        sectionFontSizes
                      )} font-semibold mb-2`}
                      style={{ color: accentColor }}
                    >
                      {exp.company}
                    </p>
                    <p
                      className={`${getDateFontSize(
                        sectionFontSizes
                      )} text-gray-600 mb-3`}
                    >
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
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
            <section className="mb-8">
              <div className="text-center mb-6">
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 mb-2 uppercase tracking-widest`}
                >
                  Key Projects
                </h2>
                <div className="w-32 h-1 mx-auto" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-4">
                {projectsToRender.map((proj, index) => (
                  <div key={index} className="text-center border-b pb-3" style={{ borderBottomColor: accentColor }}>
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "projects"
                      )} font-bold text-gray-900 mb-1`}
                    >
                      {proj.title}
                    </h3>
                    {proj.technologies && (
                      <p className="text-sm mb-2" style={{ color: accentColor }}>
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
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            {showEducation && data.education && data.education.length > 0 && (
              <section className="mb-8">
                <div className="text-center mb-6">
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 mb-2 uppercase tracking-widest`}
                  >
                    Education
                  </h2>
                  <div className="w-24 h-1 mx-auto" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="text-center">
                      <h3
                        className={`${getSectionFontSize(
                          sectionFontSizes,
                          "education"
                        )} font-bold text-gray-900 mb-1`}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        className={`${getCompanyFontSize(
                          sectionFontSizes
                        )} font-semibold mb-1`}
                        style={{ color: accentColor }}
                      >
                        {edu.institution}
                      </p>
                      <span
                        className={`${getDateFontSize(
                          sectionFontSizes
                        )} text-gray-600`}
                      >
                        {formatDate(edu.start_date)} -{" "}
                        {edu.is_current ? "Present" : formatDate(edu.end_date)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {showSkills && data.skills && data.skills.length > 0 && (
              <section className="mb-8">
                <div className="text-center mb-6">
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 mb-2 uppercase tracking-widest`}
                  >
                    Skills
                  </h2>
                  <div className="w-24 h-1 mx-auto" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 border-2 rounded text-sm font-medium"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalTemplate;

