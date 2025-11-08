import { Mail, Phone, MapPin, Linkedin, Globe, Circle, Minus, User, Github, Twitter, Instagram, Youtube, Facebook, MessageCircle, Languages, Heart } from "lucide-react";
import { 
    getSectionFontSize, 
    getNameFontSize, 
    getSectionHeaderFontSize, 
    getDateFontSize, 
    getCompanyFontSize, 
    getLocationFontSize 
} from "../../utils/fontSizeUtils";

const MinimalTemplate = ({ 
    data, 
    accentColor, 
    sectionFontSizes = {},
    showHeader = true,
    showProfessionalSummary = true,
    showExperience = true,
    showProjects = true,
    showEducation = true,
    showSkills = true,
    paperSize = "A4"
}) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    const getProfileImageSrc = (image) => {
        if (!image) return null;
        if (typeof image === 'string') return image;
        if (image?.dataUrl) return image.dataUrl;
        if (image instanceof File) return URL.createObjectURL(image);
        return null;
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
        if (!value) return '';
        const trimmed = value.trim();

        try {
            const prefixed = trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`;
            const url = new URL(prefixed);
            const host = url.hostname.replace(/^www\./i, '');
            const pathname = url.pathname.replace(/^\/+/, '');
            const search = url.search.replace(/^\?/, '');
            const hash = url.hash.replace(/^#/, '');
            const path = [pathname, search].filter(Boolean).join(search ? '?' : '');
            const fullPath = [path, hash].filter(Boolean).join('#');
            return [host, fullPath].filter(Boolean).join('/');
        } catch {
            return trimmed.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
        }
    };

    const getSocialLinks = () => {
        const socialPlatforms = ['linkedin', 'website', 'github', 'twitter', 'instagram', 'youtube', 'facebook', 'telegram'];
        return socialPlatforms
            .filter(platform => data.personal_info?.[platform] && data.personal_info[platform].trim() !== '')
            .map(platform => ({
                platform,
                value: data.personal_info[platform],
                displayValue: formatSocialValue(data.personal_info[platform]),
                icon: getSocialIcon(platform)
            }));
    };


    // Remove content limits - let paper height determine what's visible

    // Calculate height based on paper size
    const getPaperHeight = () => {
        const heights = {
            short: '880px',       // Matches modal preview height
            A4: '935px',          // Matches modal preview height
            legal: '1120px'       // Matches modal preview height
        };
        return heights[paperSize] || heights.A4;
    };

    return (
        <div id="resume-print-content" className="max-w-4xl mx-auto bg-white text-gray-900 font-sans p-6">
            {/* Header */}
            {showHeader && (
            <header className="mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className={`${getNameFontSize(sectionFontSizes)} font-light text-gray-900 mb-1 tracking-wide capitalize`}>
                            {data.personal_info?.name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className={`${getSectionFontSize(sectionFontSizes, 'title')} text-gray-600 font-light tracking-wide mb-3`}>
                                {data.personal_info.profession}
                            </p>
                        )}
                        
                        <div className={`flex flex-wrap gap-3 ${getSectionFontSize(sectionFontSizes, 'contact_details')}`}>
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="size-3" style={{ color: accentColor }} />
                                    <span className="text-gray-700">{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="size-3" style={{ color: accentColor }} />
                                    <span className="text-gray-700">{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-3" style={{ color: accentColor }} />
                                    <span className="text-gray-700">{data.personal_info.location}</span>
                                </div>
                            )}
                            {/* Dynamic social links */}
                            {getSocialLinks().map((socialLink, index) => {
                                const IconComponent = socialLink.icon;
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <IconComponent className="size-3" style={{ color: accentColor }} />
                                        <span className="text-gray-700 break-all">{socialLink.displayValue}</span>
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
                                className="w-24 h-24 rounded-full object-cover border border-gray-300"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                                <User className="size-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            </header>
            )}

            {/* Professional Summary */}
            {showProfessionalSummary && data.professional_summary && (
                <section className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                            Summary
                        </h2>
                    </div>
                    <div className="pl-3">
                        <p className="text-gray-700 leading-relaxed text-xs">
                            {data.professional_summary}
                        </p>
                    </div>
                </section>
            )}

            {/* Experience */}
            {showExperience && data.experience && data.experience.length > 0 && (
                <section className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                            Experience
                        </h2>
                    </div>

                    <div className="pl-3 space-y-2">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="relative">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className={`${getSectionFontSize(sectionFontSizes, 'experience')} font-medium text-gray-900`}>{exp.position}</h3>
                                        <p className={`${getCompanyFontSize(sectionFontSizes)} font-medium text-gray-600`}>{exp.company}</p>
                                        {exp.location && (
                                            <p className={`${getLocationFontSize(sectionFontSizes)} text-gray-500`}>{exp.location}</p>
                                        )}
                                    </div>
                                    <span className={`${getDateFontSize(sectionFontSizes)} text-gray-500 font-light`}>
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                {exp.description && (
                                    <div className={`text-gray-700 leading-relaxed ${getSectionFontSize(sectionFontSizes, 'job_descriptions')} whitespace-pre-line`}>
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {showProjects && data.projects && data.projects.length > 0 && (
                <section className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                            Projects
                        </h2>
                    </div>

                    <div className="pl-3 space-y-2">
                        {data.projects.map((proj, index) => (
                            <div key={index} className="relative">
                                <h3 className="text-xs font-medium text-gray-900 mb-1">{proj.title}</h3>
                                {proj.technologies && (
                                    <p className="text-xs mb-1 font-medium" style={{ color: accentColor }}>
                                        {proj.technologies}
                                    </p>
                                )}
                                {proj.description && (
                                    <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>
                                )}
                                {proj.link && (
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline mt-1 inline-block" style={{ color: accentColor }}>
                                        View Project
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="space-y-4">
                {/* Education */}
                {showEducation && data.education && data.education.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Education
                            </h2>
                        </div>

                        <div className="pl-3 space-y-2">
                            {data.education.map((edu, index) => (
                                <div key={index} className="relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`${getSectionFontSize(sectionFontSizes, 'education')} font-medium text-gray-900 mb-1`}>
                                                {edu.degree}
                                            </h3>
                                            <p className={`${getCompanyFontSize(sectionFontSizes)} text-gray-600`}>{edu.institution}</p>
                                            {edu.location && <p className={`${getLocationFontSize(sectionFontSizes)} text-gray-500 mt-1`}>{edu.location}</p>}
                                        </div>
                                        <span className={`${getDateFontSize(sectionFontSizes)} text-gray-500 font-light`}>
                                            {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                                        </span>
                                    </div>
                                    {edu.description && (
                                        <p className={`${getSectionFontSize(sectionFontSizes, 'job_descriptions')} text-gray-700 mt-2 leading-relaxed whitespace-pre-line`}>
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technical Skills */}
                {showSkills && data.skills && data.skills.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Technical Skills
                            </h2>
                        </div>

                        <div className="pl-3">
                            <div className="text-gray-700 text-xs leading-relaxed">
                                {data.skills.slice(0, 10).join(" • ")}
                            </div>
                        </div>
                    </section>
                )}

                {/* Soft Skills */}
                {data.soft_skills && data.soft_skills.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Soft Skills
                            </h2>
                        </div>

                        <div className="pl-3">
                            <div className="text-gray-700 text-xs leading-relaxed">
                                {data.soft_skills.slice(0, 8).join(" • ")}
                            </div>
                        </div>
                    </section>
                )}

                {/* Languages */}
                {data.languages && data.languages.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Languages
                            </h2>
                        </div>

                        <div className="pl-3">
                            <div className="space-y-1">
                                {data.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-900">{lang.language}</span>
                                        <span className="text-xs text-gray-500 capitalize">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Certifications
                            </h2>
                        </div>

                        <div className="pl-3 space-y-2">
                            {data.certifications.map((cert, index) => (
                                <div key={index} className="relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-900">{cert.name}</h3>
                                            <p className="text-xs text-gray-600">{cert.issuer}</p>
                                            {cert.credential_id && (
                                                <p className="text-xs text-gray-500">ID: {cert.credential_id}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 font-light">
                                            {cert.date && formatDate(cert.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && data.achievements.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Achievements
                            </h2>
                        </div>

                        <div className="pl-3 space-y-2">
                            {data.achievements.map((achievement, index) => (
                                <div key={index} className="relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-900">{achievement.title}</h3>
                                            {achievement.description && (
                                                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 font-light">
                                            {achievement.date && formatDate(achievement.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Volunteer Work */}
                {data.volunteer_work && data.volunteer_work.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Volunteer Work
                            </h2>
                        </div>

                        <div className="pl-3 space-y-2">
                            {data.volunteer_work.map((volunteer, index) => (
                                <div key={index} className="relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-900">{volunteer.position}</h3>
                                            <p className="text-xs text-gray-600">{volunteer.organization}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 font-light">
                                            {formatDate(volunteer.start_date)} - {volunteer.is_current ? "Present" : formatDate(volunteer.end_date)}
                                        </span>
                                    </div>
                                    {volunteer.description && (
                                        <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                            {volunteer.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MinimalTemplate;