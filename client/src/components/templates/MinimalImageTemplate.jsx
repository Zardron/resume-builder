import { Mail, Phone, MapPin, Linkedin, Globe, Circle, Award, Briefcase, GraduationCap, User, Github, Twitter, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";

const MinimalImageTemplate = ({ 
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

    return (
        <div className="max-w-6xl mx-auto bg-white text-gray-900 font-sans">
            <div className="grid grid-cols-12">
                
                {/* Left Sidebar */}
                <aside className="col-span-4 bg-gray-100 border-r border-gray-300">
                    <div className="p-4">
                        {/* Profile Image */}
                        <div className="text-center mb-4">
                            {data.personal_info?.image || data.personal_info?.profile_image ? (
                                typeof (data.personal_info.image || data.personal_info.profile_image) === 'string' ? (
                                    <img src={data.personal_info.image || data.personal_info.profile_image} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-lg" />
                                ) : (
                                    <img src={URL.createObjectURL(data.personal_info.image || data.personal_info.profile_image)} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-lg" />
                                )
                            ) : (
                                <div className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300 bg-gray-200 flex items-center justify-center shadow-lg">
                                    <User className="size-12 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Contact */}
                        <section className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                    <Mail className="size-3 text-white" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                    Contact
                                </h2>
                            </div>
                            <div className="space-y-2 text-xs">
                                {data.personal_info?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} style={{ color: accentColor }} />
                                        <span className="text-gray-700">{data.personal_info.phone}</span>
                                    </div>
                                )}
                                {data.personal_info?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} style={{ color: accentColor }} />
                                        <span className="text-gray-700">{data.personal_info.email}</span>
                                    </div>
                                )}
                                {data.personal_info?.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} style={{ color: accentColor }} />
                                        <span className="text-gray-700">{data.personal_info.address}</span>
                                    </div>
                                )}
                                {/* Dynamic social links */}
                                {getSocialLinks().map((socialLink, index) => {
                                    const IconComponent = socialLink.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <IconComponent size={12} style={{ color: accentColor }} />
                                            <span className="text-gray-700 break-all">{socialLink.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <GraduationCap className="size-3 text-white" />
                                    </div>
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        Education
                                    </h2>
                                </div>
                                <div className="space-y-3 text-xs">
                                    {data.education.map((edu, index) => (
                                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                            <p className="font-bold text-gray-800 mb-1">{edu.degree}</p>
                                            <p className="text-gray-600 mb-1">{edu.institution}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(edu.graduation_date)}
                                            </p>
                                            {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <Award className="size-3 text-white" />
                                    </div>
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        Skills
                                    </h2>
                                </div>
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
                            </section>
                        )}
                    </div>
                </aside>

                {/* Right Content */}
                <main className="col-span-8 p-4">
                    {/* Header */}
                    {showHeader && (
                    <header className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            {data.personal_info?.name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className="text-lg text-gray-600 font-medium mb-3">
                                {data.personal_info.profession}
                            </p>
                        )}
                        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor }}></div>
                    </header>
                    )}

                    {/* Summary */}
                    {showProfessionalSummary && data.professional_summary && (
                        <section className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                    <Award className="size-2 text-white" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    Professional Summary
                                </h2>
                            </div>
                            <div className="pl-6">
                                <div className="border-l-3 pl-3" style={{ borderLeftColor: accentColor }}>
                                    <p className="text-gray-700 leading-relaxed text-xs">
                                        {data.professional_summary}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Experience */}
                    {showExperience && data.experience && data.experience.length > 0 && (
                        <section className="mb-4">
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
                                                <h3 className="text-xs font-bold text-gray-900 mb-1">{exp.position}</h3>
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
                        <section>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                    <Award className="size-2 text-white" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    Key Projects
                                </h2>
                            </div>
                            <div className="pl-6 grid gap-2 md:grid-cols-2">
                                {data.project.map((project, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-2">
                                        <h3 className="text-xs font-bold text-gray-900 mb-1">{project.name}</h3>
                                        {project.type && (
                                            <p className="text-xs mb-2 font-semibold" style={{ color: accentColor }}>
                                                {project.type}
                                            </p>
                                        )}
                                        {project.description && (
                                            <div className="text-gray-700 leading-relaxed text-xs">
                                                {project.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MinimalImageTemplate;