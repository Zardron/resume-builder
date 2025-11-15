export const hasProjectContent = (project) => {
  if (!project || typeof project !== "object") {
    return false;
  }

  const contentFields = ["title", "name", "description", "technologies", "link"];

  return contentFields.some((field) => {
    const value = project[field];

    if (typeof value === "string") {
      return value.trim() !== "";
    }

    return Boolean(value);
  });
};

export const filterPopulatedProjects = (projects = []) => {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects.filter(hasProjectContent);
};

export const formatUrlForDisplay = (value) => {
  if (!value) {
    return "";
  }

  const trimmed = String(value).trim();

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


