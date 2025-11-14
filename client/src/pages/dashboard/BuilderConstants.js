import { RandomIdGenerator } from "../../util/RandomIdGenerator";
import { DEFAULT_FONT_SIZES } from "../../utils/fontSizeUtils";
import { DEFAULT_PAGE_MARGINS } from "../../utils/marginUtils";
import { User, FileText, Briefcase, GraduationCap, Folder, Sparkles, Plus } from "lucide-react";

export const DRAFT_STORAGE_KEY = "resume_builder_draft";

export const createInitialResumeData = () => ({
  _id: RandomIdGenerator(),
  title: "",
  personal_info: {
    name: "",
    email: "",
    phone: "",
    address: "",
    profession: "",
    linkedin: "",
    website: "",
    summary: "",
    image: null,
  },
  professional_summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  soft_skills: [],
  languages: [],
  certifications: [],
  achievements: [],
  volunteer_work: [],
  template: "classic",
  accent_color: "#3B82F6",
  font_size: "medium",
  section_font_sizes: { ...DEFAULT_FONT_SIZES },
  public: false,
  paper_size: "A4",
  page_margins: { ...DEFAULT_PAGE_MARGINS.A4 },
});

export const SECTIONS = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "summary", name: "Professional Summary", icon: FileText },
  { id: "experience", name: "Professional Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "projects", name: "Projects", icon: Folder },
  { id: "skills", name: "Skills & Languages", icon: Sparkles },
  { id: "additional", name: "Additional Sections", icon: Plus },
];

export const TEMPLATE_DISPLAY_NAMES = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
  spotlight: "Spotlight",
  executive: "Executive",
  creative: "Creative",
  technical: "Technical",
  elegant: "Elegant",
  corporate: "Corporate",
  professional: "Professional",
  business: "Business",
  formal: "Formal",
};

export const PAPER_SIZES = [
  { id: "short", label: "Short", dimensions: '8.5" × 11"' },
  { id: "A4", label: "A4", dimensions: '8.27" × 11.69"' },
  { id: "legal", label: "Legal", dimensions: '8.5" × 14"' },
];

export const PAPER_DIMENSIONS = {
  short: { width: "816px", height: "1056px" }, // 8.5" × 11" at 96 DPI
  A4: { width: "794px", height: "1123px" }, // 210mm × 297mm at 96 DPI
  legal: { width: "816px", height: "1344px" }, // 8.5" × 14" at 96 DPI
};

export const MARGIN_PRESETS = [
  { id: "0.25", label: "0.25 in", value: 24 },
  { id: "0.5", label: "0.5 in", value: 48 },
  { id: "0.75", label: "0.75 in", value: 72 },
  { id: "1", label: "1 in", value: 96 },
];

