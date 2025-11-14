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
  Sparkles,
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

const CreativeTemplate = ({
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

  const hexToRgba = (hex, alpha = 0.08) => {
    if (!hex) return `rgba(59, 130, 246, ${alpha})`;
    const cleanHex = hex.replace("#", "").trim();
    if (cleanHex.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(59, 130, 246, ${alpha})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
        className="relative z-10 flex flex-col"
        style={{ minHeight: "100%", ...contentPaddingStyle }}
      >
        <div className="flex-1">
          {/* Colorful Header */}
          {showHeader && (
            <header
              className="mb-6 p-6 rounded-2xl text-white relative overflow-hidden"
              style={{ backgroundColor: accentColor }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 bg-white transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20 bg-white transform -translate-x-12 translate-y-12"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
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
                      )} text-white/90 font-medium mb-4`}
                    >
                      {data.personal_info.profession}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {data.personal_info?.email && (
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <Mail className="size-3" />
                        <span className="text-sm">{data.personal_info.email}</span>
                      </div>
                    )}
                    {data.personal_info?.phone && (
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <Phone className="size-3" />
                        <span className="text-sm">{data.personal_info.phone}</span>
                      </div>
                    )}
                    {data.personal_info?.address && (
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <MapPin className="size-3" />
                        <span className="text-sm">{data.personal_info.address}</span>
                      </div>
                    )}
                    {getSocialLinks().map((socialLink, index) => {
                      const IconComponent = socialLink.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1"
                        >
                          <IconComponent className="size-3" />
                          <span className="text-sm">{socialLink.displayValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="ml-6">
                  {getProfileImageSrc(data.personal_info?.image) ? (
                    <img
                      src={getProfileImageSrc(data.personal_info?.image)}
                      alt="Profile"
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl border-4 border-white bg-white/20 flex items-center justify-center shadow-lg">
                      <User className="size-14 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* Professional Summary */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="size-5" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900`}
                >
                  Professional Summary
                </h2>
                <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }}></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4" style={{ borderLeftColor: accentColor }}>
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

          {/* Experience */}
          {showExperience && data.experience && data.experience.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="size-5" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900`}
                >
                  Professional Experience
                </h2>
                <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }}></div>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: accentColor }}
                  >
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
                        )} text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded`}
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
                <Code2 className="size-5" style={{ color: accentColor }} />
                <h2
                  className={`${getSectionHeaderFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900`}
                >
                  Key Projects
                </h2>
                <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }}></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {projectsToRender.map((proj, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-4 border-2 shadow-sm hover:shadow-md transition-shadow"
                    style={{ 
                      borderColor: accentColor,
                      background: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.08)} 0%, white 100%)`
                    }}
                  >
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "projects"
                      )} font-bold text-gray-900 mb-2`}
                    >
                      {proj.title}
                    </h3>
                    {proj.technologies && (
                      <p
                        className="text-xs font-semibold mb-2 px-2 py-1 rounded inline-block"
                        style={{ backgroundColor: accentColor, color: textColorClass }}
                      >
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p
                        className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                          sectionFontSizes,
                          "job_descriptions"
                        )} mt-2`}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.link && (
                      <p
                        className="text-xs break-all mt-2 font-semibold"
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Education */}
            {showEducation && data.education && data.education.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="size-5" style={{ color: accentColor }} />
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold`}
                    style={{ color: accentColor }}
                  >
                    Education
                  </h2>
                  <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }}></div>
                </div>
                <div className="space-y-3">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 border-l-4"
                      style={{ borderLeftColor: accentColor }}
                    >
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
                        {formatDate(edu.start_date)} -{" "}
                        {edu.is_current
                          ? "Present"
                          : formatDate(edu.end_date)}
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
                  <Award className="size-5" style={{ color: accentColor }} />
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold`}
                    style={{ color: accentColor }}
                  >
                    Skills
                  </h2>
                  <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }}></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full font-medium text-sm"
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

export default CreativeTemplate;

