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
  Rocket,
  TrendingUp,
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

const StartupTemplate = ({
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
      className={`relative max-w-6xl mx-auto bg-white text-gray-900 font-sans ${containerOverflowClass} ${printHeightClass}`}
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
          {/* Startup Header with gradient accent */}
          {showHeader && (
            <header className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="size-6" style={{ color: accentColor }} />
                    <h1
                      className={`${getNameFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-900`}
                    >
                      {data.personal_info?.name || "Your Name"}
                    </h1>
                  </div>
                  {data.personal_info?.profession && (
                    <p
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "title"
                      )} font-semibold mb-3`}
                      style={{ color: accentColor }}
                    >
                      {data.personal_info.profession}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {data.personal_info?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="size-4" style={{ color: accentColor }} />
                        <span className="text-gray-700">{data.personal_info.email}</span>
                      </div>
                    )}
                    {data.personal_info?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" style={{ color: accentColor }} />
                        <span className="text-gray-700">{data.personal_info.phone}</span>
                      </div>
                    )}
                    {data.personal_info?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" style={{ color: accentColor }} />
                        <span className="text-gray-700">{data.personal_info.address}</span>
                      </div>
                    )}
                    {getSocialLinks().map((socialLink, index) => {
                      const IconComponent = socialLink.icon;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <IconComponent className="size-4" style={{ color: accentColor }} />
                          <span className="text-gray-700 break-all">{socialLink.displayValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {getProfileImageSrc(data.personal_info?.image) && (
                  <div className="ml-6">
                    <img
                      src={getProfileImageSrc(data.personal_info?.image)}
                      alt="Profile"
                      className="w-24 h-24 rounded-lg object-cover border-2 shadow-md"
                      style={{ borderColor: accentColor }}
                    />
                  </div>
                )}
              </div>
              <div
                className="h-1 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
            </header>
          )}

          {/* Professional Summary */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="size-5" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 uppercase tracking-wide`}
                >
                  About
                </h2>
              </div>
              <p
                className={`text-gray-700 leading-relaxed pl-8 ${getSectionFontSize(
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
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="size-6" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 uppercase tracking-wide`}
                >
                  Experience
                </h2>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="pl-8">
                    <div className="flex justify-between items-start mb-2">
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
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="size-6" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 uppercase tracking-wide`}
                >
                  Projects
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {projectsToRender.map((proj, index) => (
                  <div key={index} className="p-4 rounded-lg border-2 border-gray-200 hover:border-opacity-50 transition-colors" style={{ borderColor: accentColor }}>
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "projects"
                      )} font-bold text-gray-900 mb-2`}
                    >
                      {proj.title || proj.name}
                    </h3>
                    {proj.technologies && (
                      <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p
                        className={`text-gray-700 leading-relaxed text-sm ${getSectionFontSize(
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Education */}
            {showEducation && data.education && data.education.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="size-6" style={{ color: accentColor }} />
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 uppercase tracking-wide`}
                  >
                    Education
                  </h2>
                </div>
                <div className="space-y-3 pl-8">
                  {data.education.map((edu, index) => (
                    <div key={index}>
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
                      <span
                        className={`${getDateFontSize(
                          sectionFontSizes
                        )} text-gray-600`}
                      >
                        {formatDate(edu.graduation_date)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {showSkills && data.skills && data.skills.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="size-6" style={{ color: accentColor }} />
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 uppercase tracking-wide`}
                  >
                    Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-md font-medium text-sm border-2"
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

export default StartupTemplate;

