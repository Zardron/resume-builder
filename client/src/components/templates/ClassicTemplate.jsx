import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Code2, Star, User, Github, Twitter, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";

const ClassicTemplate = ({ 
    data, 
    accentColor, 
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
    const getSocialLinks = () => {
        const socialPlatforms = ['linkedin', 'website', 'github', 'twitter', 'instagram', 'youtube', 'facebook', 'telegram'];
        return socialPlatforms
            .filter(platform => data.personal_info?.[platform] && data.personal_info[platform].trim() !== '')
            .map(platform => ({
                platform,
                value: data.personal_info[platform],
                icon: getSocialIcon(platform)
            }));
    };

    // Calculate font sizes based on paper size to fit all content
    const getFontSizes = () => {
        const sizes = {
            short: {
                title: 'text-2xl',        // Smaller title for short paper
                heading: 'text-sm',       // Smaller headings
                body: 'text-xs',          // Smaller body text
                icon: 'size-2',           // Smaller icons
                spacing: 'mb-2',          // Tighter spacing
                padding: 'p-4'            // Less padding
            },
            A4: {
                title: 'text-3xl',        // Standard title
                heading: 'text-sm',       // Standard headings
                body: 'text-xs',          // Standard body text
                icon: 'size-2',           // Standard icons
                spacing: 'mb-3',          // Standard spacing
                padding: 'p-6'            // Standard padding
            },
            legal: {
                title: 'text-4xl',        // Larger title for legal paper
                heading: 'text-base',     // Larger headings
                body: 'text-sm',          // Larger body text
                icon: 'size-3',           // Larger icons
                spacing: 'mb-4',          // More spacing
                padding: 'p-8'            // More padding
            }
        };
        return sizes[paperSize] || sizes.A4;
    };

    const fontSizes = getFontSizes();

    console.log(data);

    return (
        <div className={`max-w-4xl mx-auto bg-white text-gray-900 font-sans ${fontSizes.padding}`}>
            {/* Header */}
            {showHeader && (
            <header className="mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className={`${fontSizes.title} font-bold text-gray-900 mb-1 capitalize`}>
                            {data.personal_info?.name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className={`${fontSizes.heading} text-gray-600 font-medium mb-3`}>
                                {data.personal_info.profession}
                            </p>
                        )}
                        <div className="w-12 h-1 rounded-full mb-3" style={{ backgroundColor: accentColor }}></div>
                        
                        <div className="flex flex-wrap gap-3 text-xs">
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <Mail className={`${fontSizes.icon} text-white`} />
                                    </div>
                                    <span className="text-gray-700">{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <Phone className={`${fontSizes.icon} text-white`} />
                                    </div>
                                    <span className="text-gray-700">{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.address && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <MapPin className={`${fontSizes.icon} text-white`} />
                                    </div>
                                    <span className="text-gray-700">{data.personal_info?.address}</span>
                                </div>
                            )}
                            {/* Dynamic social links */}
                            {getSocialLinks().map((socialLink, index) => {
                                const IconComponent = socialLink.icon;
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                            <IconComponent className={`${fontSizes.icon} text-white`} />
                                        </div>
                                        <span className="text-gray-700 break-all">{socialLink.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="ml-6">
                        {data.personal_info?.image ? (
                            <img 
                                src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
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
                    <div className={`flex items-center gap-2 ${fontSizes.spacing}`}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                            <Star className={`${fontSizes.icon} text-white`} />
                        </div>
                        <h2 className={`${fontSizes.heading} font-bold text-gray-900 uppercase tracking-wide`}>
                            Professional Summary
                        </h2>
                    </div>
                    <div className="pl-6">
                        <div className="border-l-3 pl-3" style={{ borderLeftColor: accentColor }}>
                            <p className={`text-gray-700 leading-relaxed ${fontSizes.body}`}>{data.professional_summary}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Experience */}
            {showExperience && data.experience && data.experience.length > 0 && (
                <section className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                            <Briefcase className="size-2 text-white" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            Professional Experience
                        </h2>
                    </div>

                    <div className="pl-6 space-y-2">
                            {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-3" style={{ borderLeftColor: accentColor }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-900">{exp.position}</h3>
                                        <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>{exp.company}</p>
                                    </div>
                                    <div className="text-xs text-gray-600 font-medium">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed text-xs whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {showProjects && data.project && data.project.length > 0 && (
                <section className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                            <Code2 className="size-2 text-white" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            Key Projects
                        </h2>
                    </div>

                    <div className="pl-6 grid gap-2 md:grid-cols-2">
                            {data.project.map((proj, index) => (
                            <div key={index} className="border border-gray-200 rounded p-2">
                                <h3 className="text-xs font-bold text-gray-900 mb-1">{proj.name}</h3>
                                <p className="text-gray-700 leading-relaxed text-xs">{proj.description}</p>
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
                            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                <GraduationCap className="size-2 text-white" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Education
                            </h2>
                        </div>

                        <div className="pl-6 space-y-2">
                            {data.education.map((edu, index) => (
                                <div key={index} className="border-l-3 pl-3" style={{ borderLeftColor: accentColor }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-900 mb-1">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </h3>
                                            <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>{edu.institution}</p>
                                            {edu.gpa && <p className="text-xs text-gray-600 font-medium">GPA: {edu.gpa}</p>}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            <p>{formatDate(edu.graduation_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {showSkills && data.skills && data.skills.length > 0 && (
                    <section className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                <Award className="size-2 text-white" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Core Skills
                            </h2>
                        </div>

                        <div className="pl-6">
                            <div className="flex flex-wrap gap-1">
                                {data.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2 py-1 text-xs font-medium text-white rounded"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicTemplate;