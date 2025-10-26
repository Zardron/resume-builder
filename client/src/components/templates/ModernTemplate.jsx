import { Mail, Phone, MapPin, Linkedin, Globe, Code, Briefcase, GraduationCap, Star, Sparkles, User, Github, Twitter, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";
import { 
    getSectionFontSize, 
    getNameFontSize, 
    getSectionHeaderFontSize, 
    getDateFontSize, 
    getCompanyFontSize, 
    getLocationFontSize 
} from "../../utils/fontSizeUtils";

const ModernTemplate = ({ 
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
				padding: 'py-4 px-4'      // Less padding
			},
			A4: {
				title: 'text-3xl',        // Standard title
				heading: 'text-sm',       // Standard headings
				body: 'text-xs',          // Standard body text
				icon: 'size-2',           // Standard icons
				spacing: 'mb-3',          // Standard spacing
				padding: 'py-6 px-6'      // Standard padding
			},
			legal: {
				title: 'text-4xl',        // Larger title for legal paper
				heading: 'text-base',     // Larger headings
				body: 'text-sm',          // Larger body text
				icon: 'size-3',           // Larger icons
				spacing: 'mb-4',          // More spacing
				padding: 'py-8 px-8'      // More padding
			}
		};
		return sizes[paperSize] || sizes.A4;
	};

	const fontSizes = getFontSizes();

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-900 font-sans">
			{/* Header */}
			{showHeader && (
			<header className={`text-white ${fontSizes.padding} mb-4`} style={{ backgroundColor: accentColor }}>
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<h1 className={`${getNameFontSize(sectionFontSizes)} font-bold text-white mb-1 capitalize`}>
							{data.personal_info?.name || "Your Name"}
						</h1>
						{data.personal_info?.profession && (
							<p className={`${getSectionFontSize(sectionFontSizes, 'title')} text-gray-300 font-light mb-3`}>
								{data.personal_info.profession}
							</p>
						)}
						
						<div className={`flex flex-wrap gap-3 ${getSectionFontSize(sectionFontSizes, 'contact_details')}`}>
							{data.personal_info?.email && (
								<div className="flex items-center gap-2">
									<Mail className={`${fontSizes.icon} text-white`} />
									<span className="text-gray-200">{data.personal_info.email}</span>
								</div>
							)}
							{data.personal_info?.phone && (
								<div className="flex items-center gap-2">
									<Phone className={`${fontSizes.icon} text-white`} />
									<span className="text-gray-200">{data.personal_info.phone}</span>
								</div>
							)}
							{data.personal_info?.address && (
								<div className="flex items-center gap-2">
									<MapPin className={`${fontSizes.icon} text-white`} />
									<span className="text-gray-200">{data.personal_info.address}</span>
								</div>
							)}
							{/* Dynamic social links */}
							{getSocialLinks().map((socialLink, index) => {
								const IconComponent = socialLink.icon;
								return (
									<div key={index} className="flex items-center gap-2">
										<IconComponent className={`${fontSizes.icon} text-white`} />
										<span className="text-gray-200 break-all">{socialLink.value}</span>
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
                                className="w-24 h-24 rounded-full object-cover border-2 border-white"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                                <User className="size-12 text-white/60" />
                            </div>
                        )}
                    </div>
				</div>
			</header>
			)}

			<div className="px-6">
				{/* Professional Summary */}
				{showProfessionalSummary && data.professional_summary && (
					<section className="mb-3">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
								<Sparkles className="size-2 text-white" />
							</div>
							<h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
								Professional Summary
							</h2>
						</div>
						<div className="pl-6">
							<div className="border-l-3 pl-3" style={{ borderLeftColor: accentColor }}>
								<p className={`text-gray-700 leading-relaxed ${getSectionFontSize(sectionFontSizes, 'summary')}`}>{data.professional_summary}</p>
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
											<h3 className={`${getSectionFontSize(sectionFontSizes, 'experience')} font-bold text-gray-900`}>{exp.position}</h3>
											<p className={`${getCompanyFontSize(sectionFontSizes)} font-semibold`} style={{ color: accentColor }}>{exp.company}</p>
											{exp.location && (
												<p className={`${getLocationFontSize(sectionFontSizes)} font-light text-gray-400`}>{exp.location}</p>
											)}
										</div>
										<div className={`${getDateFontSize(sectionFontSizes)} text-gray-600 font-medium`}>
											{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
										</div>
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
				{showProjects && data.project && data.project.length > 0 && (
					<section className="mb-3">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
								<Code className="size-2 text-white" />
							</div>
							<h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
								Key Projects
							</h2>
						</div>

						<div className="pl-6 grid gap-2 md:grid-cols-2">
							{data.project.map((p, index) => (
								<div key={index} className="border border-gray-200 rounded p-2">
									<h3 className="text-xs font-bold text-gray-900 mb-1">{p.name}</h3>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-xs">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="space-y-4">
				{/* Education */}
				{showEducation && data.education && data.education.length > 0 && (
						<section>
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
										<h3 className="text-xs font-bold text-gray-900 mb-1">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center text-xs text-gray-600">
											<span className="font-medium">{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span className="font-medium">GPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

				{/* Skills */}
				{showSkills && data.skills && data.skills.length > 0 && (
						<section>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
									<Star className="size-2 text-white" />
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
		</div>
	);
};

export default ModernTemplate;