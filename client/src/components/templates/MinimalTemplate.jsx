import { Mail, Phone, MapPin, Linkedin, Globe, Circle, Minus } from "lucide-react";

const MinimalTemplate = ({ 
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
        <div className="max-w-4xl mx-auto bg-white text-gray-900 font-sans p-6">
            {/* Header */}
            {showHeader && (
            <header className="mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-light text-gray-900 mb-1 tracking-wide">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className="text-lg text-gray-600 font-light tracking-wide mb-3">
                                {data.personal_info.profession}
                            </p>
                        )}
                        
                        <div className="space-y-1 text-xs">
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
                            {data.personal_info?.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="size-3" style={{ color: accentColor }} />
                                    <span className="text-gray-700 break-all">{data.personal_info.linkedin}</span>
                                </div>
                            )}
                            {data.personal_info?.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="size-3" style={{ color: accentColor }} />
                                    <span className="text-gray-700 break-all">{data.personal_info.website}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {data.personal_info?.profile_image && (
                        <div className="ml-6">
                            <img 
                                src={data.personal_info.profile_image} 
                                alt="Profile" 
                                className="w-16 h-16 rounded-full object-cover border border-gray-300"
                            />
                        </div>
                    )}
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
                                        <h3 className="text-xs font-medium text-gray-900">{exp.position}</h3>
                                        <p className="text-xs font-medium text-gray-600">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 font-light">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
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
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                            Projects
                        </h2>
                    </div>

                    <div className="pl-3 space-y-2">
                        {data.project.map((proj, index) => (
                            <div key={index} className="relative">
                                <h3 className="text-xs font-medium text-gray-900 mb-1">{proj.name}</h3>
                                <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>
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
                                            <h3 className="text-xs font-medium text-gray-900 mb-1">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </h3>
                                            <p className="text-gray-600 text-xs">{edu.institution}</p>
                                            {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                                        </div>
                                        <span className="text-xs text-gray-500 font-light">
                                            {formatDate(edu.graduation_date)}
                                        </span>
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
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest">
                                Skills
                            </h2>
                        </div>

                        <div className="pl-3">
                            <div className="text-gray-700 text-xs leading-relaxed">
                                {data.skills.slice(0, 10).join(" • ")}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MinimalTemplate;