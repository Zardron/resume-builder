export const DEFAULT_PAGE_MARGINS = {
  short: { top: 24, right: 24, bottom: 24, left: 24 }, // 0.25in
  A4: { top: 24, right: 24, bottom: 24, left: 24 }, // 0.25in
  legal: { top: 24, right: 24, bottom: 24, left: 24 }, // 0.25in
};

export const getDefaultMarginsForPaper = (paperSize) =>
  DEFAULT_PAGE_MARGINS[paperSize] || DEFAULT_PAGE_MARGINS.A4;

const clampMargin = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(numeric), 0), 128);
};

export const resolvePageMargins = (pageMargins, fallbackMargins) => {
  const fallback = fallbackMargins || DEFAULT_PAGE_MARGINS.A4;

  return {
    top: clampMargin(pageMargins?.top ?? fallback.top),
    right: clampMargin(pageMargins?.right ?? fallback.right),
    bottom: clampMargin(pageMargins?.bottom ?? fallback.bottom),
    left: clampMargin(pageMargins?.left ?? fallback.left),
  };
};

export const getPagePaddingStyle = (pageMargins, fallbackMargins) => {
  const resolved = resolvePageMargins(pageMargins, fallbackMargins);

  return {
    paddingTop: `${resolved.top}px`,
    paddingRight: `${resolved.right}px`,
    paddingBottom: `${resolved.bottom}px`,
    paddingLeft: `${resolved.left}px`,
  };
};

