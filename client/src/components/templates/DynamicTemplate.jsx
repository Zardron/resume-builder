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
  Zap,
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

const DynamicTemplate = ({
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
          {/* Dynamic Header with diagonal accent */}
          {showHeader && (
            <header className="mb-6 relative">
              <div
                className="absolute top-0 left-0 right-0 h-16 rounded-t-lg opacity-10"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div className="relative z-10 pt-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1
                      className={`${getNameFontSize(
                        sectionFontSizes
                      )} font-extrabold mb-2 text-gray-900`}
                      style={{ textShadow: `2px 2px 4px rgba(0,0,0,0.1)` }}
                    >
                      {data.personal_info?.name || "Your Name"}
                    </h1>
                    {data.personal_info?.profession && (
                      <div className="inline-block">
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "title"
                          )} font-bold px-4 py-1 rounded-full inline-block`}
                          style={{ 
                            backgroundColor: accentColor,
                            color: textColorClass
                          }}
                        >
                          {data.personal_info.profession}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-6">
                    {getProfileImageSrc(data.personal_info?.image) ? (
                      <img
                        src={getProfileImageSrc(data.personal_info?.image)}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 shadow-lg"
                        style={{ borderColor: accentColor }}
                      />
                    ) : (
                      <div
                        className="w-28 h-28 rounded-full border-4 bg-gray-100 flex items-center justify-center shadow-lg"
                        style={{ borderColor: accentColor }}
                      >
                        <User className="size-14 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {data.personal_info?.email && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                      <Mail className="size-4" style={{ color: accentColor }} />
                      <span className="text-gray-700">{data.personal_info.email}</span>
                    </div>
                  )}
                  {data.personal_info?.phone && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                      <Phone className="size-4" style={{ color: accentColor }} />
                      <span className="text-gray-700">{data.personal_info.phone}</span>
                    </div>
                  )}
                  {data.personal_info?.address && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                      <MapPin className="size-4" style={{ color: accentColor }} />
                      <span className="text-gray-700">{data.personal_info.address}</span>
                    </div>
                  )}
                  {getSocialLinks().map((socialLink, index) => {
                    const IconComponent = socialLink.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                        <IconComponent className="size-4" style={{ color: accentColor }} />
                        <span className="text-gray-700 break-all">{socialLink.displayValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </header>
          )}

          {/* Professional Summary with icon */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <Zap className="size-5" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 uppercase tracking-wide`}
                >
                  Professional Summary
                </h2>
              </div>
              <div className="pl-9">
                <p
                  className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                    sectionFontSizes,
                    "summary"
                  )}`}
                >
                  {data.professional_summary}
                </p>
              </div>
            </section>
          )}

          {/* Experience with dynamic styling */}
          {showExperience && data.experience && data.experience.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="size-6" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 uppercase tracking-wide`}
                >
                  Professional Experience
                </h2>
                <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-4" style={{ borderColor: accentColor }}>
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
                        )} text-gray-600 font-medium px-3 py-1 rounded-full bg-gray-50`}
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
                  Key Projects
                </h2>
                <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-4">
                {projectsToRender.map((proj, index) => (
                  <div key={index} className="p-4 rounded-lg border-2" style={{ borderColor: accentColor }}>
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
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50">
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
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full font-medium text-sm shadow-sm"
                      style={{ backgroundColor: accentColor, color: textColorClass }}
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

export default DynamicTemplate;

