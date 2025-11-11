import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Circle,
  Award,
  Briefcase,
  GraduationCap,
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

const MinimalImageTemplate = ({
  data,
  accentColor,
  sectionFontSizes = {},
  showHeader = true,
  showProfessionalSummary = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showSkills = true,
  paperSize = "A4",
  pageMargins,
  availableCredits = 0,
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

  // Function to get the appropriate icon for social platforms
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

  // Function to get social links from personal_info
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

  // Determine text color based on background
  const textColor = getTextColorForBackground(accentColor);
  const textColorClass = textColor === "black" ? "text-gray-900" : "text-white";

  const getPaperHeight = () => {
    const heights = {
      short: "1056px",
      A4: "1123px",
      legal: "1344px",
    };
    return heights[paperSize] || heights.A4;
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

  const paddingStyle = getPagePaddingStyle(
    pageMargins,
    getDefaultMarginsForPaper(paperSize)
  );

  const showWatermark = availableCredits <= 0;
  const containerOverflowClass =
    isDownloadMode && showWatermark ? "overflow-visible" : "";
  const projectsToRender = filterPopulatedProjects(data.projects);

  const watermarkText = (
    <>
      This resume was generated with Resume Builder by Zardron Angelo Pesquera.
    </>
  );

  return (
    <div
      id={isDownloadMode ? "resume-print-content" : undefined}
      data-paper-size={paperSize}
      className={`relative max-w-6xl mx-auto bg-white text-gray-900 font-sans ${containerOverflowClass}`}
      style={{ ...paddingStyle, minHeight: getPaperHeight() }}
    >
      {isDownloadMode && showWatermark && (
        <WatermarkOverlay className="z-20" paperSize={paperSize} />
      )}
      <div className="flex flex-col" style={{ minHeight: "100%" }}>
        <div className="grid grid-cols-12 flex-1">
          {/* Left Sidebar */}
          <aside className="col-span-4 bg-gray-100 border-r border-gray-300 h-full flex flex-col">
            <div className="p-4 flex-1">
              {/* Profile Image */}
              <div className="text-center mb-4">
                {getProfileImageSrc(
                  data.personal_info?.image || data.personal_info?.profile_image
                ) ? (
                  <img
                    src={getProfileImageSrc(
                      data.personal_info?.image ||
                        data.personal_info?.profile_image
                    )}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300 bg-gray-200 flex items-center justify-center shadow-lg">
                    <User className="size-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Contact */}
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Mail className={`size-3 ${textColorClass}`} />
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Contact
                  </h2>
                </div>
                <div className="space-y-2 text-xs">
                  {data.personal_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} style={{ color: accentColor }} />
                      <span
                        className={`text-gray-700 ${getSectionFontSize(
                          sectionFontSizes,
                          "contact_details"
                        )}`}
                      >
                        {data.personal_info.phone}
                      </span>
                    </div>
                  )}
                  {data.personal_info?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} style={{ color: accentColor }} />
                      <span
                        className={`text-gray-700 ${getSectionFontSize(
                          sectionFontSizes,
                          "contact_details"
                        )}`}
                      >
                        {data.personal_info.email}
                      </span>
                    </div>
                  )}
                  {data.personal_info?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={12} style={{ color: accentColor }} />
                      <span
                        className={`text-gray-700 ${getSectionFontSize(
                          sectionFontSizes,
                          "contact_details"
                        )}`}
                      >
                        {data.personal_info.address}
                      </span>
                    </div>
                  )}
                  {/* Dynamic social links */}
                  {getSocialLinks().map((socialLink, index) => {
                    const IconComponent = socialLink.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent
                          size={12}
                          style={{ color: accentColor }}
                        />
                        <span
                          className={`text-gray-700 break-all ${getSectionFontSize(
                            sectionFontSizes,
                            "contact_details"
                          )}`}
                        >
                          {socialLink.displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Education */}
              {data.education && data.education.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <GraduationCap className={`size-3 ${textColorClass}`} />
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      Education
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs">
                    {data.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                      >
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "education"
                          )} font-bold text-gray-800 mb-1`}
                        >
                          {edu.degree}
                        </p>
                        <p
                          className={`${getCompanyFontSize(
                            sectionFontSizes
                          )} text-gray-600 mb-1`}
                        >
                          {edu.institution}
                        </p>
                        {edu.location && (
                          <p
                            className={`${getLocationFontSize(
                              sectionFontSizes
                            )} text-gray-500 mb-1`}
                          >
                            {edu.location}
                          </p>
                        )}
                        <p
                          className={`${getDateFontSize(
                            sectionFontSizes
                          )} text-gray-500`}
                        >
                          {formatDate(edu.start_date)} -{" "}
                          {edu.is_current
                            ? "Present"
                            : formatDate(edu.end_date)}
                        </p>
                        {edu.description && (
                          <p
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "job_descriptions"
                            )} text-gray-700 mt-2 leading-relaxed whitespace-pre-line`}
                          >
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Skills */}
              {data.skills && data.skills.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Award className={`size-3 ${textColorClass}`} />
                    </div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-800 uppercase tracking-wide`}
                    >
                      Technical Skills
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 font-medium rounded ${getSectionFontSize(
                          sectionFontSizes,
                          "skills",
                          "small"
                        )} ${textColorClass}`}
                        style={{ backgroundColor: accentColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Soft Skills */}
              {data.soft_skills && data.soft_skills.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Star className={`size-3 ${textColorClass}`} />
                    </div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-800 uppercase tracking-wide`}
                    >
                      Soft Skills
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.soft_skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 font-medium rounded ${getSectionFontSize(
                          sectionFontSizes,
                          "soft_skills",
                          "small"
                        )} ${textColorClass}`}
                        style={{ backgroundColor: accentColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages && data.languages.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Languages className={`size-3 ${textColorClass}`} />
                    </div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-800 uppercase tracking-wide`}
                    >
                      Languages
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {data.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-2 shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "languages",
                              "small"
                            )} font-medium text-gray-800`}
                          >
                            {lang.language}
                          </span>
                          <span
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "languages",
                              "small"
                            )} text-gray-600 capitalize`}
                          >
                            {lang.proficiency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {data.certifications && data.certifications.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Award className={`size-3 ${textColorClass}`} />
                    </div>
                    <h2
                      className={`${getSectionHeaderFontSize(
                        sectionFontSizes
                      )} font-bold text-gray-800 uppercase tracking-wide`}
                    >
                      Certifications
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {data.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-2 shadow-sm border border-gray-200"
                      >
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "certifications",
                            "small"
                          )} font-bold text-gray-800 mb-1`}
                        >
                          {cert.name}
                        </p>
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "certifications",
                            "small"
                          )} text-gray-600 mb-1`}
                        >
                          {cert.issuer}
                        </p>
                        {cert.credential_id && (
                          <p
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "certifications",
                              "small"
                            )} text-gray-500`}
                          >
                            ID: {cert.credential_id}
                          </p>
                        )}
                        {cert.date && (
                          <p
                            className={`${getDateFontSize(
                              sectionFontSizes
                            )} text-gray-500 mt-1`}
                          >
                            {formatDate(cert.date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>

          {/* Right Content */}
          <main className="col-span-8 p-4 h-full flex flex-col">
            {/* Header */}
            {showHeader && (
              <header className="mb-4">
                <h1
                  className={`${getNameFontSize(
                    sectionFontSizes
                  )} font-bold text-gray-900 mb-1 capitalize`}
                >
                  {data.personal_info?.name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                  <p
                    className={`${getSectionFontSize(
                      sectionFontSizes,
                      "title"
                    )} text-gray-600 font-medium mb-3`}
                  >
                    {data.personal_info.profession}
                  </p>
                )}
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ backgroundColor: accentColor }}
                ></div>
              </header>
            )}

            {/* Summary */}
            {showProfessionalSummary && data.professional_summary && (
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Award className="size-2 ${textColorClass}" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Professional Summary
                  </h2>
                </div>
                <div className="pl-6">
                  <div
                    className="border-l-3 pl-3"
                    style={{ borderLeftColor: accentColor }}
                  >
                    <p className="text-gray-700 leading-relaxed text-[10px]">
                      {data.professional_summary}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Experience */}
            {showExperience &&
              data.experience &&
              data.experience.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Briefcase className="size-2 ${textColorClass}" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Professional Experience
                    </h2>
                  </div>
                  <div className="pl-6 space-y-2">
                    {data.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-3 pl-3"
                        style={{ borderLeftColor: accentColor }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
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
                              )} font-semibold mb-1`}
                              style={{ color: accentColor }}
                            >
                              {exp.company}
                            </p>
                            {exp.location && (
                              <p
                                className={`${getLocationFontSize(
                                  sectionFontSizes
                                )} text-gray-600 mb-1`}
                              >
                                {exp.location}
                              </p>
                            )}
                          </div>
                          <div
                            className={`${getDateFontSize(
                              sectionFontSizes
                            )} text-gray-600 font-medium`}
                          >
                            {formatDate(exp.start_date)} -{" "}
                            {exp.is_current
                              ? "Present"
                              : formatDate(exp.end_date)}
                          </div>
                        </div>
                        {exp.description && (
                          <div
                            className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                              sectionFontSizes,
                              "job_descriptions"
                            )} whitespace-pre-line`}
                          >
                            {exp.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Projects */}
            {showProjects && projectsToRender.length > 0 && (
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Award className="size-2 ${textColorClass}" />
                  </div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 uppercase tracking-wide`}
                  >
                    Key Projects
                  </h2>
                </div>
                <div className="pl-6 grid gap-2 md:grid-cols-2">
                  {projectsToRender.map((project, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded p-2"
                    >
                      <h3
                        className={`${getSectionFontSize(
                          sectionFontSizes,
                          "projects",
                          "small"
                        )} font-bold text-gray-900 mb-1`}
                      >
                        {project.title}
                      </h3>
                      {project.technologies && (
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "projects",
                            "small"
                          )} mb-2 font-semibold`}
                          style={{ color: accentColor }}
                        >
                          {project.technologies}
                        </p>
                      )}
                      {project.description && (
                        <div
                          className={`text-gray-700 leading-relaxed ${getSectionFontSize(
                            sectionFontSizes,
                            "job_descriptions",
                            "small"
                          )} mb-1`}
                        >
                          {project.description}
                        </div>
                      )}
                      {project.link && (
                        <p
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "projects",
                            "small"
                          )} break-all`}
                          style={{ color: accentColor }}
                        >
                          {formatUrlForDisplay(project.link)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {data.achievements && data.achievements.length > 0 && (
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Award className="size-2 ${textColorClass}" />
                  </div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 uppercase tracking-wide`}
                  >
                    Achievements
                  </h2>
                </div>
                <div className="pl-6 space-y-2">
                  {data.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="border-l-3 pl-3"
                      style={{ borderLeftColor: accentColor }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "achievements",
                              "small"
                            )} font-bold text-gray-900`}
                          >
                            {achievement.title}
                          </h3>
                          {achievement.description && (
                            <p
                              className={`${getSectionFontSize(
                                sectionFontSizes,
                                "job_descriptions",
                                "small"
                              )} text-gray-700 mt-1`}
                            >
                              {achievement.description}
                            </p>
                          )}
                        </div>
                        <div
                          className={`${getDateFontSize(
                            sectionFontSizes
                          )} text-gray-600 font-medium`}
                        >
                          {achievement.date && formatDate(achievement.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Volunteer Work */}
            {data.volunteer_work && data.volunteer_work.length > 0 && (
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Heart className="size-2 ${textColorClass}" />
                  </div>
                  <h2
                    className={`${getSectionHeaderFontSize(
                      sectionFontSizes
                    )} font-bold text-gray-900 uppercase tracking-wide`}
                  >
                    Volunteer Work
                  </h2>
                </div>
                <div className="pl-6 space-y-2">
                  {data.volunteer_work.map((volunteer, index) => (
                    <div
                      key={index}
                      className="border-l-3 pl-3"
                      style={{ borderLeftColor: accentColor }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "volunteer_work",
                              "small"
                            )} font-bold text-gray-900`}
                          >
                            {volunteer.position}
                          </h3>
                          <p
                            className={`${getSectionFontSize(
                              sectionFontSizes,
                              "volunteer_work",
                              "small"
                            )} font-semibold mb-1`}
                            style={{ color: accentColor }}
                          >
                            {volunteer.organization}
                          </p>
                        </div>
                        <div
                          className={`${getDateFontSize(
                            sectionFontSizes
                          )} text-gray-600 font-medium`}
                        >
                          {formatDate(volunteer.start_date)} -{" "}
                          {volunteer.is_current
                            ? "Present"
                            : formatDate(volunteer.end_date)}
                        </div>
                      </div>
                      {volunteer.description && (
                        <div
                          className={`${getSectionFontSize(
                            sectionFontSizes,
                            "job_descriptions",
                            "small"
                          )} text-gray-700 leading-relaxed whitespace-pre-line`}
                        >
                          {volunteer.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
        {isDownloadMode && showWatermark && (
          <footer className="mt-6 text-center text-[10px] text-gray-400 italic">
            {watermarkText}
          </footer>
        )}
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
