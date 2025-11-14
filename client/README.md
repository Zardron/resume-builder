# ResumeIQ

Modern, template-driven ResumeIQ built with React and Tailwind CSS. Craft, preview, and export polished resumes without leaving the browser.

**Author:** Zardron Angelo Pesquera

---

## Overview

This repository contains the front-end client for an AI-inspired ResumeIQ. The application focuses on a smooth authoring experience: users can switch between templates, customize typography and colors, adjust page margins, and generate PDF exports—all with instant visual feedback. Authentication views are currently UI-only; no backend services ship with this codebase.

## Key Features

- **Template Library** – Classic, Modern, Minimal, Minimal (with image), and Spotlight layouts with responsive design.
- **Guided Builder** – Step-by-step forms for personal info, summaries, experience, education, projects, skills, and additional sections.
- **Deep Customization** – Fine-grained control over font sizes, section typography, accent colors, margins, and paper sizes (Letter, A4, Legal).
- **Live Preview & Export** – Real-time template preview with high-fidelity PDF export powered by `html-to-image`, `html2canvas`, and `jsPDF`.
- **Resume Management Flows** – Dedicated experiences for starting a new resume or working from an uploaded document (UI scaffolding for future parsing).
- **Theme Support** – Global light/dark mode with persistence via `ThemeContext`.

## Tech Stack

- **React 19** with functional components and hooks
- **Vite 7** for development and build tooling
- **Tailwind CSS 4** with custom design tokens
- **React Router 7** for client-side routing
- **Lucide Icons**, **html-to-image**, **html2canvas**, **jsPDF**, and **culori** for UI polish and PDF export workflows
- **ESLint 9** configured via flat config (`eslint.config.js`)

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm (ships with Node) or a compatible package manager

### Installation & Local Development

```bash
# From the repository root
cd resume-builder/client

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) in your browser.

### Production Builds

```bash
# Generate an optimized production build in client/dist
npm run build

# Preview the production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
client/
├── public/                     # Static assets served as-is
├── src/
│   ├── assets/                 # Local images and asset manifests
│   ├── components/             # Reusable UI components
│   │   ├── home/               # Landing page sections
│   │   ├── templates/          # Resume template renderers
│   │   └── ...                 # Shared UI controls (navbar, footer, etc.)
│   ├── pages/                  # Route-level pages (home, auth, dashboard)
│   │   └── dashboard/          # ResumeIQ workflows & forms
│   ├── util/                   # UI utilities (color picker, modal, etc.)
│   ├── utils/                  # Helper libraries (font sizing, margins, PDF)
│   ├── ThemeContext.jsx        # Light/dark theme provider
│   ├── App.jsx                 # Route configuration
│   └── main.jsx                # Application entry point
├── index.html                  # Root HTML shell
├── package.json                # Scripts and dependencies
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.js              # Vite configuration
```

## Working with Templates

- Templates live in `src/components/templates/`.
- Each template accepts the same `resumeData` model, enabling instant switching.
- Font sizing helpers (`utils/fontSizeUtils.js`) and margin utilities (`utils/marginUtils.js`) centralize typography and layout logic.
- PDF export logic lives in `utils/pdfUtils.js` and handles OKLCH → RGB conversion for consistent colors in downloads.

## Known Limitations & Next Steps

- Authentication screens are UI-only placeholders; integrate your preferred backend or auth provider to persist user accounts.
- Uploaded resumes currently trigger UI flows but do not parse document content—hook in parsing logic or APIs as needed.
- State management is local to the builder components; consider extracting to a dedicated store or backend when collaboration or persistence is required.

## Contributing

Issues and pull requests are welcome. Please open a discussion if you plan significant changes so the roadmap can stay aligned.

## License

This project is licensed under the MIT License. See the root `LICENSE` file for details.
