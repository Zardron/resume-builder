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

const ElegantTemplate = ({
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
          {/* Sophisticated Elegant Header */}
          {showHeader && (
            <header className="mb-5 text-center relative">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
              
              <div className="pt-5 pb-4 border-b border-gray-200">
                <div className="mb-3 relative">
                  {getProfileImageSrc(data.personal_info?.image) ? (
                    <div className="relative inline-block">
                      <img
                        src={getProfileImageSrc(data.personal_info?.image)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto border-2"
                        style={{ borderColor: accentColor }}
                      />
                      <div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <div
                        className="w-24 h-24 rounded-full mx-auto border-2 bg-gray-100 flex items-center justify-center"
                        style={{ borderColor: accentColor }}
                      >
                        <User className="size-12 text-gray-400" />
                      </div>
                      <div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                    </div>
                  )}
                </div>
                <h1
                  className={`${getNameFontSize(
                    sectionFontSizes
                  )} font-bold mb-1.5 text-gray-900 tracking-wide`}
                  style={{ letterSpacing: '0.05em' }}
                >
                  {data.personal_info?.name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                  <div className="relative mb-3">
                  <p
                    className={`${getSectionFontSize(
                      sectionFontSizes,
                      "title"
                    )} font-light mb-1 italic`}
                    style={{ color: accentColor }}
                  >
                    {data.personal_info.profession}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '50' }}></div>
                    <Star className="size-2.5" style={{ color: accentColor }} />
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '50' }}></div>
                  </div>
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
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
            </header>
          )}

          {/* Professional Summary */}
          {showProfessionalSummary && data.professional_summary && (
            <section className="mb-5">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 tracking-widest uppercase`}
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Professional Summary
                  </h2>
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                </div>
                <div className="w-12 h-0.5 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="max-w-3xl mx-auto">
                <p
                  className={`text-gray-700 leading-relaxed text-center ${getSectionFontSize(
                    sectionFontSizes,
                    "summary"
                  )}`}
                  style={{ lineHeight: '1.6' }}
                >
                  {data.professional_summary}
                </p>
              </div>
            </section>
          )}

          {/* Experience */}
          {showExperience && data.experience && data.experience.length > 0 && (
            <section className="mb-5">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 tracking-widest uppercase`}
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Professional Experience
                  </h2>
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                </div>
                <div className="w-12 h-0.5 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-3 max-w-4xl mx-auto">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Elegant timeline dot */}
                    <div className="absolute left-0 top-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full border"
                        style={{ 
                          borderColor: accentColor, 
                          backgroundColor: "white",
                        }}
                      ></div>
                    </div>
                    <div className="border-l-2 pl-4" style={{ borderLeftColor: accentColor + '50' }}>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div className="flex-1">
                            <h3
                              className={`${getSectionFontSize(
                                sectionFontSizes,
                                "experience"
                              )} font-bold text-gray-900 mb-1`}
                            >
                              {exp.position}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p
                                className={`${getCompanyFontSize(
                                  sectionFontSizes
                                )} font-semibold italic`}
                                style={{ color: accentColor }}
                              >
                                {exp.company}
                              </p>
                              {exp.location && (
                                <>
                                  <span className="text-gray-400 text-xs">•</span>
                                  <p
                                    className={`${getLocationFontSize(
                                      sectionFontSizes
                                    )} text-gray-600 italic`}
                                  >
                                    {exp.location}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <span
                            className={`${getDateFontSize(
                              sectionFontSizes
                            )} text-gray-600 font-medium italic whitespace-nowrap text-xs`}
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
                            style={{ lineHeight: '1.6' }}
                          >
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {showProjects && projectsToRender.length > 0 && (
            <section className="mb-5">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 tracking-widest uppercase`}
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Key Projects
                  </h2>
                  <div className="w-8 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                </div>
                <div className="w-12 h-0.5 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 max-w-5xl mx-auto">
                {projectsToRender.map((proj, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50"
                    style={{ borderColor: accentColor + '30' }}
                  >
                    <h3
                      className={`${getSectionFontSize(
                        sectionFontSizes,
                        "projects"
                      )} font-bold text-gray-900 mb-1.5`}
                    >
                      {proj.title}
                    </h3>
                    {proj.technologies && (
                      <div className="mb-2">
                        <p
                          className="text-xs font-medium italic px-2 py-0.5 rounded-full inline-block"
                          style={{ 
                            color: accentColor, 
                            backgroundColor: accentColor + '10',
                            border: `1px solid ${accentColor}25`
                          }}
                        >
                          {proj.technologies}
                        </p>
                      </div>
                    )}
                    {proj.description && (
                      <p
                        className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                          sectionFontSizes,
                          "job_descriptions"
                        )} mb-1.5`}
                        style={{ lineHeight: '1.6' }}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.link && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Globe className="size-3" style={{ color: accentColor }} />
                        <p
                          className="text-xs break-all italic font-medium"
                          style={{ color: accentColor }}
                        >
                          {formatUrlForDisplay(proj.link)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {/* Education */}
            {showEducation && data.education && data.education.length > 0 && (
              <section className="mb-5">
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-900 tracking-widest uppercase`}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      Education
                    </h2>
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                  </div>
                  <div className="w-10 h-0.5 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="space-y-2.5">
                  {data.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="text-center bg-gray-50 rounded p-3 border border-gray-200"
                    >
                      <h3
                        className={`${getSectionFontSize(
                          sectionFontSizes,
                          "education"
                        )} font-bold text-gray-900 mb-1`}
                      >
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p
                        className={`${getCompanyFontSize(
                          sectionFontSizes
                        )} font-semibold italic mb-1`}
                        style={{ color: accentColor }}
                      >
                        {edu.institution}
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {edu.graduation_date && (
                          <span
                            className={`${getDateFontSize(
                              sectionFontSizes
                            )} text-gray-600 italic text-xs`}
                          >
                            {formatDate(edu.graduation_date)}
                          </span>
                        )}
                        {edu.gpa && (
                          <>
                            <span className="text-gray-400 text-xs">•</span>
                            <span
                              className={`${getDateFontSize(
                                sectionFontSizes
                              )} text-gray-600 italic text-xs`}
                            >
                              GPA: {edu.gpa}
                            </span>
                          </>
                        )}
                        {(edu.start_date || edu.graduation_date) && (
                          <span
                            className={`${getDateFontSize(
                              sectionFontSizes
                            )} text-gray-600 italic text-xs`}
                          >
                            {edu.start_date ? (
                              <>
                                {formatDate(edu.start_date)} -{" "}
                                {edu.is_current
                                  ? "Present"
                                  : formatDate(edu.end_date)}
                              </>
                            ) : (
                              formatDate(edu.graduation_date)
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {showSkills && data.skills && data.skills.length > 0 && (
              <section className="mb-5">
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-900 tracking-widest uppercase`}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      Skills
                    </h2>
                    <div className="w-6 h-px" style={{ backgroundColor: accentColor + '30' }}></div>
                  </div>
                  <div className="w-10 h-0.5 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full font-medium text-xs border"
                      style={{ 
                        borderColor: accentColor + '50', 
                        color: accentColor,
                        backgroundColor: 'white'
                      }}
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

export default ElegantTemplate;

