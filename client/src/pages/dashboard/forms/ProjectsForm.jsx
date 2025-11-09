import React, { useState, useCallback, useEffect, useRef } from "react";
import InputField from "../../../components/InputField";
import { 
  Plus, 
  Trash2, 
  Folder, 
  Calendar, 
  Link as LinkIcon,
  ChevronDown
} from "lucide-react";

const ProjectsForm = ({ data, onChange, onValidationChange }) => {
  const [projects, setProjects] = useState(data || []);
  const [validationErrors, setValidationErrors] = useState({});
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const validationRef = useRef();
  const latestOnChangeRef = useRef(onChange);

  // Initialize with one empty project if none exist
  useEffect(() => {
    if (!projects || projects.length === 0) {
      const initialProject = {
        id: Date.now(),
        title: "",
        technologies: "",
        link: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: ""
      };
      setProjects([initialProject]);
      setExpandedProjects(new Set([initialProject.id]));
    }
  }, []);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  // Update parent component when projects change
  useEffect(() => {
    latestOnChangeRef.current?.(projects);
  }, [projects]);

  // Add new project
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "",
      technologies: "",
      link: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    };
    setProjects([...projects, newProject]);
    setExpandedProjects(prev => new Set([...prev, newProject.id]));
  };

  // Remove project
  const removeProject = (id) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
      setExpandedProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Update project field
  const updateProject = (id, field, value) => {
    setProjects(projects.map(proj => {
      if (proj.id === id) {
        const updatedProj = { ...proj, [field]: value };
        
        // If currently working is enabled, clear the end date
        if (field === 'is_current' && value === true) {
          updatedProj.end_date = '';
        }
        
        return updatedProj;
      }
      return proj;
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[`${id}-${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${id}-${field}`];
        return newErrors;
      });
    }
  };

  // Toggle project expansion
  const toggleExpansion = (id) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Validate fields
  const validateField = (projectId, field, value) => {
    const requiredFields = ['title'];
    const isEmpty = !value || value.trim() === '';
    
    if (requiredFields.includes(field) && isEmpty) {
      setValidationErrors(prev => ({ ...prev, [`${projectId}-${field}`]: true }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${projectId}-${field}`];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all projects
  const validateAllProjects = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    projects.forEach(proj => {
      const requiredFields = ['title'];
      requiredFields.forEach(field => {
        const value = proj[field];
        if (!value || value.trim() === '') {
          errors[`${proj.id}-${field}`] = true;
          hasErrors = true;
        }
      });
    });

    setValidationErrors(errors);
    return !hasErrors;
  }, [projects]);

  // Store validation function in ref and expose to parent
  useEffect(() => {
    validationRef.current = validateAllProjects;
  }, [validateAllProjects]);

  // Expose validation function to parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(() => validationRef.current());
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">5</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Showcase your personal projects and technical achievements
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
            Include links to live demos or repositories when possible.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => {
          const isExpanded = expandedProjects.has(project.id);
          
          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
                      <Folder className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {project.title || `Project ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.technologies || 'Technologies used'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpansion(project.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`} />
                    </button>
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(project.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Form */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Project Title</span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <InputField
                        type="text"
                        icon="folder"
                        width="w-full"
                        placeholder="E-commerce Platform"
                        value={project.title}
                        onChange={(value) => updateProject(project.id, 'title', value)}
                        hasError={validationErrors[`${project.id}-title`]}
                        name={`title-${project.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Technologies Used</span>
                      </label>
                      <InputField
                        type="text"
                        icon="code"
                        width="w-full"
                        placeholder="React, Node.js, MongoDB"
                        value={project.technologies}
                        onChange={(value) => updateProject(project.id, 'technologies', value)}
                        name={`technologies-${project.id}`}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Project Link</span>
                      </label>
                      <InputField
                        type="url"
                        icon="link"
                        width="w-full"
                        placeholder="https://github.com/username/project or https://project-demo.com"
                        value={project.link}
                        onChange={(value) => updateProject(project.id, 'link', value)}
                        name={`link-${project.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Start Date</span>
                      </label>
                      <InputField
                        type="month"
                        icon="calendar"
                        width="w-full"
                        placeholder="Start Date"
                        value={project.start_date}
                        onChange={(value) => updateProject(project.id, 'start_date', value)}
                        name={`start_date-${project.id}`}
                      />
                    </div>

                    {!project.is_current && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                          <span className="text-sm font-medium">End Date</span>
                        </label>
                        <InputField
                          type="month"
                          icon="calendar"
                          width="w-full"
                          placeholder="End Date"
                          value={project.end_date}
                          onChange={(value) => updateProject(project.id, 'end_date', value)}
                          name={`end_date-${project.id}`}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Currently Working</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={project.is_current}
                            onChange={(e) => updateProject(project.id, 'is_current', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--accent-color)] transition-all duration-300 ease-in-out" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          I'm currently working on this project
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <span className="text-sm font-medium">Project Description</span>
                    </label>
                    <textarea
                      placeholder="Describe your project, key features, your role, and achievements..."
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      className="w-full h-24 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-xs outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Project Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Another Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsForm;

