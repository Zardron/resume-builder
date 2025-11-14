/**
 * Template Dummy Data
 * 12 different resume data sets optimized for A4 paper size (794px × 1123px)
 * Each dataset is carefully crafted to fit perfectly on a single A4 page
 */

export const templateDummyData = [
  {
    // ----------------------------------------------------- Resume 1: Software Engineer ------------------------------------------------------
    personal_info: {
      full_name: "Sarah Chen",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (415) 555-0123",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/sarahchen",
      website: "sarahchen.dev",
      profession: "Senior Software Engineer",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading teams to deliver scalable web applications serving millions of users. Passionate about building efficient, maintainable code and mentoring junior developers.",
    experience: [
      {
        position: "Senior Software Engineer",
        company: "Tech Corp",
        start_date: "2022-01",
        end_date: "",
        is_current: true,
        description:
          "Led development of scalable web applications using React and Node.js, serving over 2 million active users. Architected microservices infrastructure that improved system performance by 40%. Mentored a team of 5 junior developers and established best practices for code reviews.",
      },
      {
        position: "Software Engineer",
        company: "StartupXYZ",
        start_date: "2020-06",
        end_date: "2021-12",
        is_current: false,
        description:
          "Developed and maintained web applications using React, TypeScript, and Python. Built RESTful APIs that handled 500K+ requests daily. Implemented automated testing suites that increased code coverage from 60% to 85%.",
      },
      {
        position: "Junior Software Developer",
        company: "Digital Solutions Inc",
        start_date: "2018-07",
        end_date: "2020-05",
        is_current: false,
        description:
          "Developed responsive web applications using JavaScript, HTML, and CSS. Fixed critical bugs and improved application performance, reducing page load times by 30%.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "University of California, Berkeley",
        graduation_date: "2018-05",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        type: "Web Application",
        description:
          "Built a full-stack e-commerce solution with React and Node.js, serving 10,000+ users. Implemented payment processing, inventory management, and real-time order tracking. Integrated with third-party APIs for shipping and tax calculations. Achieved 99.9% uptime and processed over $500K in transactions.",
      },
      {
        name: "Task Management App",
        type: "Web Application",
        description:
          "Developed a collaborative task management application with real-time updates. Built using React, Socket.io, and MongoDB. Used by 50+ teams with over 1,000 active users. Features include task assignments, due dates, priority levels, comments, and activity logs.",
      },
      {
        name: "Analytics Dashboard",
        type: "Web Application",
        description:
          "Created a comprehensive analytics dashboard for tracking user behavior and business metrics. Built with React, D3.js, and Python backend. Implemented data visualization components and custom reports.",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Docker",
      "Kubernetes",
      "GraphQL",
      "REST APIs",
      "CI/CD",
      "Agile",
      "Scrum",
      "Redis",
      "Express.js",
      "Next.js",
    ],
    template: "classic",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 2: Product Designer ------------------------------------------------------
    personal_info: {
      full_name: "Marcus Johnson",
      name: "Marcus Johnson",
      email: "marcus.j@email.com",
      phone: "+1 (212) 555-0456",
      location: "New York, NY",
      linkedin: "linkedin.com/in/marcusjohnson",
      website: "marcusjohnson.design",
      profession: "Product Designer",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Creative product designer with 6+ years of experience crafting user-centered digital experiences. Specialized in SaaS platforms and mobile applications. Expert in design systems, user research, and prototyping. Passionate about creating intuitive interfaces that solve real user problems.",
    experience: [
      {
        position: "Lead Product Designer",
        company: "DesignStudio Inc",
        start_date: "2021-03",
        end_date: "",
        is_current: true,
        description:
          "Lead design for a SaaS platform used by 50K+ users. Designed and implemented a comprehensive design system that increased design consistency by 60%. Conducted user research and usability testing to inform design decisions.",
      },
      {
        position: "Senior Product Designer",
        company: "Creative Labs",
        start_date: "2019-08",
        end_date: "2021-02",
        is_current: false,
        description:
          "Designed mobile and web applications for fintech products. Created wireframes, prototypes, and high-fidelity designs. Collaborated with product managers and engineers to deliver features on time.",
      },
      {
        position: "Product Designer",
        company: "StartupHub",
        start_date: "2018-01",
        end_date: "2019-07",
        is_current: false,
        description:
          "Designed user interfaces for web and mobile applications. Conducted user interviews and created personas.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Fine Arts",
        field: "Interaction Design",
        institution: "Rhode Island School of Design",
        graduation_date: "2017-05",
        gpa: "3.9",
      },
    ],
    projects: [
      {
        name: "Design System Library",
        type: "Design System",
        description:
          "Created a comprehensive design system with 200+ components, design tokens, and documentation. Adopted by 5 product teams and reduced design time by 40%. Established design principles and guidelines for consistent user experiences across all products.",
      },
      {
        name: "Mobile Banking App",
        type: "Mobile Application",
        description:
          "Designed a mobile banking application with focus on security and user experience. App has 100K+ downloads with 4.5+ star rating. Implemented biometric authentication, transaction history, and bill payment features with intuitive navigation.",
      },
      {
        name: "SaaS Dashboard Redesign",
        type: "Web Application",
        description:
          "Led complete redesign of analytics dashboard for SaaS platform. Improved user engagement by 45% through better information architecture and data visualization. Conducted extensive user research and A/B testing.",
      },
    ],
    skills: [
      "Figma",
      "Sketch",
      "Adobe XD",
      "Prototyping",
      "User Research",
      "Design Systems",
      "UI/UX Design",
      "Wireframing",
      "User Testing",
      "Illustration",
      "Motion Design",
      "Accessibility",
      "Design Thinking",
    ],
    template: "modern",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 3: Data Scientist ------------------------------------------------------
    personal_info: {
      full_name: "Dr. Emily Rodriguez",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1 (617) 555-0789",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/emilyrodriguez",
      website: "emilyrodriguez.ai",
      profession: "Senior Data Scientist",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Data scientist with 7+ years of experience in machine learning and predictive modeling. PhD in Statistics with expertise in deep learning and NLP. Published 15+ research papers.",
    experience: [
      {
        position: "Senior Data Scientist",
        company: "AI Innovations",
        start_date: "2020-09",
        end_date: "",
        is_current: true,
        description:
          "Lead data science initiatives for recommendation systems serving 5M+ users. Developed and deployed ML models that increased user engagement by 35%.",
      },
      {
        position: "Data Scientist",
        company: "Analytics Corp",
        start_date: "2018-06",
        end_date: "2020-08",
        is_current: false,
        description:
          "Developed predictive models for customer churn and fraud detection. Analyzed large datasets using SQL, Python, and R.",
      },
    ],
    education: [
      {
        degree: "PhD",
        field: "Statistics",
        institution: "Massachusetts Institute of Technology",
        graduation_date: "2018-05",
        gpa: "3.95",
      },
    ],
    projects: [
      {
        name: "Recommendation Engine",
        type: "Machine Learning",
        description:
          "Built a deep learning recommendation system using collaborative filtering and neural networks. Improved click-through rates by 45% and generated $2M+ in additional revenue.",
      },
      {
        name: "Fraud Detection System",
        type: "Machine Learning",
        description:
          "Developed an anomaly detection system using ensemble methods. Reduced false positives by 60% while maintaining 99.5% detection accuracy.",
      },
    ],
    skills: [
      "Python",
      "R",
      "SQL",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "AWS",
      "Docker",
      "Spark",
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
    ],
    template: "technical",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 4: Marketing Manager ------------------------------------------------------
    personal_info: {
      full_name: "Jessica Williams",
      name: "Jessica Williams",
      email: "jessica.w@email.com",
      phone: "+1 (310) 555-0234",
      location: "Los Angeles, CA",
      linkedin: "linkedin.com/in/jessicawilliams",
      website: "jessicawilliams.com",
      profession: "Marketing Manager",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Results-driven marketing manager with 8+ years of experience in digital marketing and campaign strategy. Expert in SEO, SEM, and social media marketing. Successfully launched campaigns that generated $10M+ in revenue.",
    experience: [
      {
        position: "Marketing Manager",
        company: "Brand Solutions",
        start_date: "2021-04",
        end_date: "",
        is_current: true,
        description:
          "Lead marketing strategy for B2B SaaS products, managing a team of 8 marketers. Increased lead generation by 150% and improved conversion rates by 40%.",
      },
      {
        position: "Senior Marketing Specialist",
        company: "Digital Marketing Agency",
        start_date: "2019-01",
        end_date: "2021-03",
        is_current: false,
        description:
          "Managed digital marketing campaigns for 20+ clients. Developed SEO strategies that increased organic traffic by 200%.",
      },
    ],
    education: [
      {
        degree: "Master of Business Administration",
        field: "Marketing",
        institution: "UCLA Anderson School",
        graduation_date: "2017-05",
        gpa: "3.7",
      },
    ],
    projects: [
      {
        name: "Brand Rebranding Campaign",
        type: "Marketing Campaign",
        description:
          "Led complete brand rebranding for a tech company, including new logo, website, and marketing materials. Campaign resulted in 300% increase in brand awareness and 50% increase in sales.",
      },
    ],
    skills: [
      "SEO",
      "SEM",
      "Google Analytics",
      "Social Media Marketing",
      "Content Strategy",
      "Email Marketing",
      "Marketing Automation",
      "HubSpot",
      "Salesforce",
      "Adobe Creative Suite",
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "French", proficiency: "Conversational" },
    ],
    template: "business",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 5: Financial Analyst ------------------------------------------------------
    personal_info: {
      full_name: "David Kim",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 (312) 555-0567",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/davidkim",
      website: "davidkim.finance",
      profession: "Senior Financial Analyst",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Analytical financial analyst with 6+ years of experience in financial modeling and investment analysis. Expert in Excel, SQL, and financial software. Strong background in corporate finance.",
    experience: [
      {
        position: "Senior Financial Analyst",
        company: "Global Finance Corp",
        start_date: "2020-07",
        end_date: "",
        is_current: true,
        description:
          "Analyze financial data and create models for investment decisions. Prepare quarterly and annual financial reports. Support M&A activities with financial due diligence.",
      },
      {
        position: "Financial Analyst",
        company: "Investment Bank",
        start_date: "2018-06",
        end_date: "2020-06",
        is_current: false,
        description:
          "Built financial models for equity research and investment recommendations. Analyzed company financials and industry trends.",
      },
    ],
    education: [
      {
        degree: "Master of Finance",
        field: "Finance",
        institution: "University of Chicago",
        graduation_date: "2017-05",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "Financial Forecasting Model",
        type: "Financial Analysis",
        description:
          "Developed a comprehensive financial forecasting model that improved budget accuracy by 25%. Model used for strategic planning and investment decisions.",
      },
    ],
    skills: [
      "Financial Modeling",
      "Excel",
      "SQL",
      "Bloomberg",
      "VBA",
      "Python",
      "Tableau",
      "Power BI",
      "Financial Analysis",
      "Valuation",
      "M&A",
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Korean", proficiency: "Fluent" },
    ],
    template: "corporate",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 6: UX Researcher ------------------------------------------------------
    personal_info: {
      full_name: "Alexandra Taylor",
      name: "Alexandra Taylor",
      email: "alex.taylor@email.com",
      phone: "+1 (206) 555-0890",
      location: "Seattle, WA",
      linkedin: "linkedin.com/in/alexandrataylor",
      website: "alexandrataylor.ux",
      profession: "UX Researcher",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "User experience researcher with 5+ years of experience conducting user research and usability testing. Expert in qualitative and quantitative research methods. Passionate about understanding user needs.",
    experience: [
      {
        position: "Senior UX Researcher",
        company: "Tech Products Inc",
        start_date: "2021-01",
        end_date: "",
        is_current: true,
        description:
          "Lead user research initiatives for consumer products used by millions. Conduct user interviews, surveys, and usability tests. Synthesize research findings and present insights.",
      },
      {
        position: "UX Researcher",
        company: "Design Agency",
        start_date: "2019-03",
        end_date: "2020-12",
        is_current: false,
        description:
          "Conducted user research for web and mobile applications. Performed usability testing and created research reports.",
      },
    ],
    education: [
      {
        degree: "Master of Science",
        field: "Human-Computer Interaction",
        institution: "University of Washington",
        graduation_date: "2017-05",
        gpa: "3.9",
      },
    ],
    projects: [
      {
        name: "User Research Framework",
        type: "Research Methodology",
        description:
          "Developed a comprehensive user research framework adopted by 3 product teams. Framework standardized research processes and improved research quality.",
      },
    ],
    skills: [
      "User Interviews",
      "Usability Testing",
      "Surveys",
      "Data Analysis",
      "Figma",
      "Miro",
      "UserTesting",
      "Optimal Workshop",
      "Statistics",
      "Research Methods",
    ],
    languages: [{ language: "English", proficiency: "Native" }],
    template: "creative",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 7: DevOps Engineer ------------------------------------------------------
    personal_info: {
      full_name: "Michael Brown",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "+1 (512) 555-0345",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/michaelbrown",
      website: "michaelbrown.dev",
      profession: "DevOps Engineer",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "DevOps engineer with 7+ years of experience in cloud infrastructure and CI/CD pipelines. Expert in AWS, Docker, Kubernetes, and infrastructure as code. Passionate about improving deployment processes and system reliability. Successfully managed infrastructure serving millions of users.",
    experience: [
      {
        position: "Senior DevOps Engineer",
        company: "Cloud Services Inc",
        start_date: "2020-05",
        end_date: "",
        is_current: true,
        description:
          "Design and maintain cloud infrastructure on AWS serving millions of users. Implemented CI/CD pipelines that reduced deployment time by 80%. Manage Kubernetes clusters and containerized applications.",
      },
      {
        position: "DevOps Engineer",
        company: "Tech Solutions",
        start_date: "2018-08",
        end_date: "2020-04",
        is_current: false,
        description:
          "Built and maintained CI/CD pipelines using Jenkins and GitLab. Automated infrastructure provisioning using Terraform. Improved system uptime from 99.5% to 99.9%.",
      },
      {
        position: "Systems Administrator",
        company: "IT Services",
        start_date: "2017-01",
        end_date: "2018-07",
        is_current: false,
        description:
          "Managed Linux servers and network infrastructure. Automated routine tasks using shell scripts. Monitored system performance and resolved issues.",
      },
      {
        position: "IT Support Specialist",
        company: "Digital Solutions",
        start_date: "2016-06",
        end_date: "2016-12",
        is_current: false,
        description:
          "Provided technical support for hardware and software issues. Assisted with server maintenance and troubleshooting. Gained foundational experience in Linux systems and network administration.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "University of Texas at Austin",
        graduation_date: "2016-05",
        gpa: "3.6",
      },
    ],
    projects: [
      {
        name: "Infrastructure Automation",
        type: "DevOps",
        description:
          "Automated infrastructure provisioning using Terraform and Ansible. Reduced infrastructure setup time from days to hours. Implemented for 10+ environments.",
      },
      {
        name: "CI/CD Pipeline",
        type: "DevOps",
        description:
          "Built a comprehensive CI/CD pipeline using Jenkins, Docker, and Kubernetes. Enabled automated testing and deployment, reducing manual work by 90%.",
      },
      {
        name: "Monitoring & Alerting System",
        type: "DevOps",
        description:
          "Implemented a comprehensive monitoring solution using Prometheus, Grafana, and ELK stack. Reduced incident response time by 70% and improved system visibility across all services.",
      },
      {
        name: "Container Orchestration Platform",
        type: "DevOps",
        description:
          "Designed and deployed a Kubernetes-based container orchestration platform supporting 50+ microservices. Achieved 99.9% uptime and reduced deployment time by 80%.",
      },
    ],
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Jenkins",
      "GitLab CI",
      "Linux",
      "Bash",
      "Python",
      "CI/CD",
      "Monitoring",
      "CloudFormation",
    ],
    languages: [{ language: "English", proficiency: "Native" }],
    template: "minimal",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 8: Project Manager ------------------------------------------------------
    personal_info: {
      full_name: "Rachel Green",
      name: "Rachel Green",
      email: "rachel.green@email.com",
      phone: "+1 (303) 555-0678",
      location: "Denver, CO",
      linkedin: "linkedin.com/in/rachelgreen",
      website: "rachelgreen.pm",
      profession: "Project Manager",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Certified project manager with 8+ years of experience leading cross-functional teams to deliver complex projects. Expert in Agile, Scrum, and Waterfall methodologies. Strong background in software development.",
    experience: [
      {
        position: "Senior Project Manager",
        company: "Enterprise Solutions",
        start_date: "2020-11",
        end_date: "",
        is_current: true,
        description:
          "Lead multiple software development projects with teams of 10-15 members. Manage project budgets up to $5M. Implemented Agile practices that improved delivery time by 30%.",
      },
      {
        position: "Project Manager",
        company: "Software Development Co",
        start_date: "2018-04",
        end_date: "2020-10",
        is_current: false,
        description:
          "Managed software development projects from initiation to closure. Coordinated with stakeholders, developers, and designers.",
      },
    ],
    education: [
      {
        degree: "Master of Business Administration",
        field: "Project Management",
        institution: "University of Colorado",
        graduation_date: "2016-05",
        gpa: "3.7",
      },
    ],
    projects: [
      {
        name: "Enterprise Software Implementation",
        type: "Project Management",
        description:
          "Led implementation of enterprise software for 500+ users. Project completed on time and 10% under budget. Improved operational efficiency by 40%.",
      },
    ],
    skills: [
      "Project Management",
      "Agile",
      "Scrum",
      "Jira",
      "Confluence",
      "Risk Management",
      "Stakeholder Management",
      "Budget Management",
      "PMP Certified",
    ],
    certifications: [
      {
        name: "PMP Certification",
        issuer: "Project Management Institute",
        date: "2019-03",
        credential_id: "PMP-12345",
      },
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Conversational" },
    ],
    template: "professional",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 9: Content Writer ------------------------------------------------------
    personal_info: {
      full_name: "Olivia Martinez",
      name: "Olivia Martinez",
      email: "olivia.m@email.com",
      phone: "+1 (305) 555-0123",
      location: "Miami, FL",
      linkedin: "linkedin.com/in/oliviamartinez",
      website: "oliviamartinez.com",
      profession: "Content Writer",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Creative content writer with 6+ years of experience creating engaging content for digital platforms. Expert in SEO writing and copywriting. Published 500+ articles with over 10M total views.",
    experience: [
      {
        position: "Senior Content Writer",
        company: "Content Marketing Agency",
        start_date: "2020-02",
        end_date: "",
        is_current: true,
        description:
          "Create SEO-optimized content for clients across various industries. Write blog posts and web copy that drive traffic and conversions.",
      },
      {
        position: "Content Writer",
        company: "Digital Media",
        start_date: "2018-06",
        end_date: "2020-01",
        is_current: false,
        description:
          "Wrote articles and blog posts for technology and lifestyle topics. Optimized content for SEO and social media sharing.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Arts",
        field: "English Literature",
        institution: "University of Miami",
        graduation_date: "2016-05",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "Content Strategy Guide",
        type: "Content Creation",
        description:
          "Created a content strategy guide that increased client website traffic by 200%.",
      },
    ],
    skills: [
      "Content Writing",
      "SEO",
      "Copywriting",
      "Blog Writing",
      "Social Media",
    ],
    languages: [{ language: "English", proficiency: "Native" }],
    template: "elegant",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 10: Business Analyst ------------------------------------------------------
    personal_info: {
      full_name: "James Wilson",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (404) 555-0456",
      location: "Atlanta, GA",
      linkedin: "linkedin.com/in/jameswilson",
      website: "jameswilson.analytics",
      twitter: "twitter.com/jameswilson",
      facebook: "facebook.com/jameswilson",
      profession: "Business Analyst",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Analytical business analyst with 7+ years of experience analyzing business processes and requirements gathering. Expert in data analysis and process improvement. Strong background in finance and technology.",
    experience: [
      {
        position: "Senior Business Analyst",
        company: "Business Solutions Corp",
        start_date: "2020-08",
        end_date: "",
        is_current: true,
        description:
          "Analyze business requirements and translate them into technical specifications. Work with stakeholders to identify process improvements. Lead requirements gathering sessions.",
      },
      {
        position: "Business Analyst",
        company: "Financial Services",
        start_date: "2018-03",
        end_date: "2020-07",
        is_current: false,
        description:
          "Analyzed business processes and identified improvement opportunities. Created process flow diagrams and business requirement documents.",
      },
    ],
    education: [
      {
        degree: "Master of Business Administration",
        field: "Business Analytics",
        institution: "Georgia Institute of Technology",
        graduation_date: "2017-05",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "Process Improvement Initiative",
        type: "Business Analysis",
        description:
          "Led process improvement initiative that reduced operational costs by $500K annually. Analyzed workflows and implemented automation solutions.",
      },
    ],
    skills: [
      "Business Analysis",
      "Requirements Gathering",
      "Process Improvement",
      "Data Analysis",
      "SQL",
      "Excel",
      "Visio",
      "Jira",
      "Agile",
      "Stakeholder Management",
      "Business Process Modeling",
      "Business Process Mapping",
    ],
    languages: [{ language: "English", proficiency: "Native" }, { language: "Spanish", proficiency: "Conversational" }, { language: "French", proficiency: "Conversational" } , { language: "German", proficiency: "Conversational" } ],
    certifications: [
      {
        name: "Business Analyst Certification",
        issuer: "Business Analyst Institute",
        date: "2020-01",
        credential_id: "BA-12345",
      },
    ],
    template: "executive",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 11: Sales Manager ------------------------------------------------------
    personal_info: {
      full_name: "Robert Anderson",
      name: "Robert Anderson",
      email: "robert.a@email.com",
      phone: "+1 (214) 555-0789",
      location: "Dallas, TX",
      linkedin: "linkedin.com/in/robertanderson",
      website: "robertanderson.sales",
      profession: "Sales Manager",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Results-oriented sales manager with 9+ years of experience in B2B sales and team leadership. Expert in building relationships and developing sales strategies. Consistently exceeded sales targets by 20%+ annually.",
    experience: [
      {
        position: "Sales Manager",
        company: "Enterprise Sales Corp",
        start_date: "2020-01",
        end_date: "",
        is_current: true,
        description:
          "Lead sales team of 8 representatives selling enterprise software solutions. Exceeded annual sales targets by 25% for three consecutive years.",
      },
      {
        position: "Senior Sales Representative",
        company: "Tech Sales Inc",
        start_date: "2017-05",
        end_date: "2019-12",
        is_current: false,
        description:
          "Sold SaaS products to enterprise clients. Built relationships with C-level executives. Consistently ranked in top 10% of sales team.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Business Administration",
        institution: "University of Texas",
        graduation_date: "2015-05",
        gpa: "3.6",
      },
    ],
    projects: [
      {
        name: "Sales Process Optimization",
        type: "Sales Strategy",
        description:
          "Developed and implemented new sales process that reduced sales cycle time by 30% and increased close rate by 20%. Process adopted company-wide.",
      },
    ],
    skills: [
      "Sales Management",
      "B2B Sales",
      "CRM",
      "Salesforce",
      "Negotiation",
      "Relationship Building",
      "Lead Generation",
      "Account Management",
      "Sales Strategy",
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Conversational" },
      { language: "French", proficiency: "Conversational" },
    ],
    certifications: [
      {
        name: "SHRM-CP Certification",
        issuer: "Society for Human Resource Management",
        date: "2019-05",
        credential_id: "SHRM-CP-67890",
      },
      {
        name: "PMP Certification",
        issuer: "Project Management Institute",
        date: "2019-03",
        credential_id: "PMP-12345",
      },
    ],
    template: "spotlight",
    accent_color: "#3b82f6",
  },

  {
    // ----------------------------------------------------- Resume 12: HR Manager ------------------------------------------------------
    personal_info: {
      full_name: "Lisa Thompson",
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "+1 (503) 555-0234",
      location: "Portland, OR",
      linkedin: "linkedin.com/in/lisathompson",
      website: "lisathompson.hr",
      profession: "HR Manager",
      image: null,
      profile_image: null,
    },
    professional_summary:
      "Strategic HR manager with 8+ years of experience in talent acquisition and employee relations. Expert in HR policies and performance management. Successfully managed HR operations for companies with 200+ employees.",
    experience: [
      {
        position: "HR Manager",
        company: "People First Inc",
        start_date: "2020-06",
        end_date: "",
        is_current: true,
        description:
          "Lead HR operations for company with 250 employees. Manage recruitment, onboarding, and performance reviews. Implemented HRIS system that improved efficiency by 50%.",
      },
      {
        position: "Senior HR Specialist",
        company: "Global Corporation",
        start_date: "2018-02",
        end_date: "2020-05",
        is_current: false,
        description:
          "Managed talent acquisition and recruitment processes. Conducted interviews and made hiring recommendations. Developed employee engagement programs.",
      },
    ],
    education: [
      {
        degree: "Master of Science",
        field: "Human Resources",
        institution: "Portland State University",
        graduation_date: "2016-05",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "Employee Engagement Program",
        type: "HR Initiative",
        description:
          "Developed and launched employee engagement program that increased employee satisfaction scores by 35% and reduced turnover by 25%.",
      },
    ],
    skills: [
      "Talent Acquisition",
      "Employee Relations",
      "Performance Management",
      "HRIS",
      "Recruitment",
      "Onboarding",
      "HR Policies",
      "Compensation",
      "Benefits Administration",
    ],
    certifications: [
      {
        name: "SHRM-CP Certification",
        issuer: "Society for Human Resource Management",
        date: "2019-05",
        credential_id: "SHRM-CP-67890",
      },
    ],
    languages: [{ language: "English", proficiency: "Native" }],
    template: "formal",
    accent_color: "#3b82f6",
  },
];
