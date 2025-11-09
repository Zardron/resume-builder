import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { converter, formatRgb } from 'culori';
import { resolvePageMargins, getDefaultMarginsForPaper } from './marginUtils';

const toRgb = converter('rgb');

const convertOklchToRgb = (oklchString) => {
  try {
    const rgb = toRgb(oklchString);
    if (!rgb || Number.isNaN(rgb.r) || Number.isNaN(rgb.g) || Number.isNaN(rgb.b)) {
      return null;
    }
    return formatRgb(rgb);
  } catch {
    return null;
  }
};

const resolveVarFunctions = (value, element, computedStyle, seen = new Set()) => {
  if (!value || !value.includes('var(')) {
    return value;
  }

  const resolver = computedStyle ?? getComputedStyle(element);

  return value.replace(/var\(\s*(--[^,\s)]+)\s*(?:,\s*([^)]+))?\)/g, (match, varName, fallback) => {
    const normalizedName = varName.trim();

    if (seen.has(normalizedName)) {
      return fallback ? resolveVarFunctions(fallback.trim(), element, resolver, seen) : '';
    }

    seen.add(normalizedName);

    const resolvedRaw = resolver?.getPropertyValue(normalizedName);
    const resolved = resolvedRaw ? resolvedRaw.trim() : '';

    if (resolved) {
      return resolveVarFunctions(resolved, element, resolver, seen);
    }

    if (fallback) {
      return resolveVarFunctions(fallback.trim(), element, resolver, seen);
    }

    return '';
  });
};

const replaceOklchColors = (value, element, computedStyle) => {
  if (!value || typeof value !== 'string' || !value.includes('oklch')) {
    return value;
  }

  let result = '';
  let index = 0;

  while (index < value.length) {
    const start = value.indexOf('oklch(', index);
    if (start === -1) {
      result += value.slice(index);
      break;
    }

    result += value.slice(index, start);

    let depth = 0;
    let end = start;
    while (end < value.length) {
      const char = value[end];
      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          end += 1;
          break;
        }
      }
      end += 1;
    }

    const oklchExpression = value.slice(start, end);
    const resolvedExpression = resolveVarFunctions(oklchExpression, element, computedStyle);
    const converted = convertOklchToRgb(resolvedExpression);
    if (!converted) {
      console.warn('Failed to convert OKLCH color:', oklchExpression);
    }
    result += converted ?? resolvedExpression ?? oklchExpression;

    index = end;
  }

  return result;
};

const normalizeColors = (element) => {
  if (!(element instanceof Element)) {
    return;
  }

  const computedStyle = getComputedStyle(element);

  for (const property of computedStyle) {
    const value = computedStyle.getPropertyValue(property);
    if (!value || !value.includes('oklch')) continue;

    const convertedValue = replaceOklchColors(value, element, computedStyle);
    if (convertedValue && convertedValue !== value) {
      element.style.setProperty(property, convertedValue, 'important');
    }
  }

  // Also normalize inline style attributes that may contain OKLCH
  const inlineStyle = element.getAttribute('style');
  if (inlineStyle && inlineStyle.includes('oklch')) {
    element.setAttribute('style', replaceOklchColors(inlineStyle, element, computedStyle));
  }

  Array.from(element.children).forEach(normalizeColors);
};

const normalizeCustomProperties = (sourceElement, targetElement) => {
  const computedStyle = getComputedStyle(sourceElement);

  for (const property of computedStyle) {
    if (!property.startsWith('--')) continue;

    const value = computedStyle.getPropertyValue(property);
    if (!value || !value.includes('oklch')) continue;

    const convertedValue = replaceOklchColors(value, sourceElement, computedStyle);
    if (convertedValue && convertedValue !== value) {
      targetElement.style.setProperty(property, convertedValue, 'important');
    }
  }
};

const PAPER_SIZE_CONFIG = {
  short: { width: 215.9, height: 279.4, format: 'letter' }, // 8.5" × 11"
  A4: { width: 210, height: 297, format: 'a4' },
  legal: { width: 215.9, height: 355.6, format: 'legal' }, // 8.5" × 14"
};

const getPaperConfig = (paperSize) => PAPER_SIZE_CONFIG[paperSize] || PAPER_SIZE_CONFIG.A4;

export const generateResumePdf = async ({
  node,
  fileName,
  paperSize = 'A4',
  pageMargins,
}) => {
  if (!node) {
    throw new Error('Preview node is not available.');
  }

  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.top = '0';
  tempContainer.style.left = '0';
  tempContainer.style.width = '100%';
  tempContainer.style.height = '100%';
  tempContainer.style.display = 'flex';
  tempContainer.style.alignItems = 'flex-start';
  tempContainer.style.justifyContent = 'center';
  tempContainer.style.padding = '32px';
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.zIndex = '-1';
  tempContainer.style.pointerEvents = 'none';
  tempContainer.style.opacity = '0';
  tempContainer.style.overflow = 'hidden';

  const clone = node.cloneNode(true);
  clone.classList.remove('scale-75', 'origin-top-left', 'w-[133%]', 'h-[133%]');
  clone.style.transform = 'scale(1)';
  clone.style.transformOrigin = 'top left';
  clone.style.margin = '0';
  clone.style.boxSizing = 'border-box';
  clone.style.backgroundColor = '#ffffff';

  const contentWidth = node.scrollWidth || node.getBoundingClientRect().width;
  const contentHeight = node.scrollHeight || node.getBoundingClientRect().height;

  if (contentWidth) {
    clone.style.width = `${contentWidth}px`;
  }

  if (contentHeight) {
    clone.style.height = `${contentHeight}px`;
  }

  const ensureMinimumCloneHeight = () => {
    const { height: paperHeightMm } = getPaperConfig(paperSize);
    const MM_TO_PX = 96 / 25.4;
    const minHeightPx = paperHeightMm * MM_TO_PX;

    if (!Number.isFinite(minHeightPx) || minHeightPx <= 0) {
      return;
    }

    const currentHeight = clone.getBoundingClientRect().height || contentHeight;
    if (!currentHeight || currentHeight < minHeightPx) {
      clone.style.minHeight = `${minHeightPx}px`;
    }
  };

  ensureMinimumCloneHeight();

  clone.style.maxWidth = 'unset';
  clone.style.maxHeight = 'unset';

  const cloneRect = clone.getBoundingClientRect();
  const cssWidthPx =
    (cloneRect?.width && Number.isFinite(cloneRect.width) && cloneRect.width > 0
      ? cloneRect.width
      : 0) ||
    (contentWidth && Number.isFinite(contentWidth) && contentWidth > 0 ? contentWidth : 0) ||
    (clone.offsetWidth && clone.offsetWidth > 0 ? clone.offsetWidth : 0);

  tempContainer.appendChild(clone);

  document.body.appendChild(tempContainer);

  const parsePaddingValue = (value) => {
    const numeric = Number.parseFloat(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      return 0;
    }
    return numeric;
  };

  const resolveContentPadding = () => {
    const possibleContentRoot =
      clone.querySelector('[data-resume-content]') || clone.firstElementChild || clone;

    if (!possibleContentRoot) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    const style = getComputedStyle(possibleContentRoot);
    return {
      top: parsePaddingValue(style.paddingTop),
      right: parsePaddingValue(style.paddingRight),
      bottom: parsePaddingValue(style.paddingBottom),
      left: parsePaddingValue(style.paddingLeft),
    };
  };

  const contentPaddingSource = (() => {
    if (pageMargins) {
      try {
        const defaultMargins = getDefaultMarginsForPaper(paperSize);
        return resolvePageMargins(pageMargins, defaultMargins);
      } catch (error) {
        console.warn('Failed to resolve provided page margins; falling back to computed padding.', error);
      }
    }
    return resolveContentPadding();
  })();

  const contentPadding = contentPaddingSource || resolveContentPadding();

  // Normalize global custom properties that may use OKLCH
  normalizeCustomProperties(document.documentElement, tempContainer);
  normalizeCustomProperties(document.body, tempContainer);

  normalizeColors(clone);

  const baseOptions = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  };

  let dataUrl;
  const styleSheetPrototype = CSSStyleSheet.prototype;
  const originalInsertRule = styleSheetPrototype.insertRule;

  styleSheetPrototype.insertRule = function(rule, index) {
    if (rule && rule.trim().toLowerCase().startsWith('@charset')) {
      return 0;
    }
    return originalInsertRule.call(this, rule, index);
  };

  const waitForImageLoad = async (img) => {
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      if (typeof img.decode === 'function') {
        try {
          await img.decode();
        } catch {
          // Ignore decode errors and resolve immediately
        }
      }
      return;
    }

    await new Promise((resolve) => {
      const cleanUp = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      };

      const onLoad = () => {
        cleanUp();
        resolve();
      };

      const onError = () => {
        cleanUp();
        resolve();
      };

      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
    });
  };

  const waitForImages = async (element) => {
    if (!element) return;
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(images.map(waitForImageLoad));
  };

  try {
    await waitForImages(clone);
    dataUrl = await toPng(clone, baseOptions);
  } catch (error) {
    console.warn('Primary capture failed, retrying without embedded fonts.', error);
    dataUrl = await toPng(clone, {
      ...baseOptions,
      skipFonts: true,
      fontEmbedCSS: '',
    });
  } finally {
    styleSheetPrototype.insertRule = originalInsertRule;
    document.body.removeChild(tempContainer);
  }

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });

  const PX_TO_MM = 25.4 / 96; // 96 DPI
  const captureScaleX =
    cssWidthPx > 0 && Number.isFinite(image.width) && image.width > 0
      ? image.width / cssWidthPx
      : 1;
  const captureScale =
    Number.isFinite(captureScaleX) && captureScaleX > 0 ? captureScaleX : 1;
  const cssBaseWidthPx =
    cssWidthPx > 0
      ? cssWidthPx
      : Number.isFinite(image.width) && image.width > 0
        ? image.width / captureScale
        : 0;
  const { width: maxPdfWidth, height: maxPdfHeight, format } = getPaperConfig(paperSize);

  const contentPaddingTopPx = contentPadding.top;
  const contentPaddingBottomPx = contentPadding.bottom;
  const paddingTopImagePx = contentPaddingTopPx * captureScale;
  const paddingBottomImagePx = contentPaddingBottomPx * captureScale;

  const basePdfWidth =
    cssBaseWidthPx > 0 ? cssBaseWidthPx * PX_TO_MM : image.width * PX_TO_MM;
  const widthScale = maxPdfWidth / basePdfWidth;
  const normalizedScale = Number.isFinite(widthScale) && widthScale > 0 ? Math.min(widthScale, 1) : 1;
  const scaledPdfWidth = basePdfWidth * normalizedScale;

  const rawContentHeightPx = image.height - paddingTopImagePx - paddingBottomImagePx;
  const hasValidPadding = rawContentHeightPx > 0;

  const effectiveContentHeightPx = hasValidPadding ? rawContentHeightPx : image.height;
  const startOffsetPx = hasValidPadding ? paddingTopImagePx : 0;

  let paddingTopMm = hasValidPadding ? contentPaddingTopPx * PX_TO_MM * normalizedScale : 0;
  let paddingBottomMm = hasValidPadding ? contentPaddingBottomPx * PX_TO_MM * normalizedScale : 0;

  let innerPageHeightMm = maxPdfHeight - paddingTopMm - paddingBottomMm;
  if (!hasValidPadding || innerPageHeightMm <= 0) {
    innerPageHeightMm = maxPdfHeight;
    paddingTopMm = 0;
    paddingBottomMm = 0;
  }

  const innerPageHeightPxExact =
    innerPageHeightMm * captureScale / (PX_TO_MM * normalizedScale);
  const innerPageHeightPx =
    Number.isFinite(innerPageHeightPxExact) && innerPageHeightPxExact > 0
      ? innerPageHeightPxExact
      : image.height;

  const totalPages = Math.max(
    1,
    Math.ceil(effectiveContentHeightPx / innerPageHeightPx),
  );

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format,
  });
  const xOffset = scaledPdfWidth < maxPdfWidth ? (maxPdfWidth - scaledPdfWidth) / 2 : 0;

  const paddingTopPx = hasValidPadding ? paddingTopImagePx : 0;
  const paddingBottomPx = hasValidPadding ? paddingBottomImagePx : 0;

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const contentOffsetPx = startOffsetPx + pageIndex * innerPageHeightPx;
    const remainingContentPx =
      effectiveContentHeightPx - pageIndex * innerPageHeightPx;
    const contentSliceHeightPx = Math.max(
      Math.min(innerPageHeightPx, remainingContentPx),
      0,
    );

    if (contentSliceHeightPx <= 0) {
      continue;
    }

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = image.width;
    const canvasHeightPx = Math.max(
      Math.ceil(contentSliceHeightPx + paddingTopPx + paddingBottomPx),
      1,
    );
    sliceCanvas.height = canvasHeightPx;

    const context = sliceCanvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    context.drawImage(
      image,
      0,
      contentOffsetPx,
      image.width,
      contentSliceHeightPx,
      0,
      paddingTopPx,
      image.width,
      contentSliceHeightPx,
    );

    const sliceDataUrl = sliceCanvas.toDataURL('image/png');
    const canvasHeightCssPx =
      captureScale > 0 ? canvasHeightPx / captureScale : canvasHeightPx;
    const sliceHeightMm = Math.min(
      maxPdfHeight,
      canvasHeightCssPx * PX_TO_MM * normalizedScale,
    );

    if (pageIndex > 0) {
      pdf.addPage(format, 'p');
    }

    pdf.addImage(
      sliceDataUrl,
      'PNG',
      xOffset,
      0,
      scaledPdfWidth,
      sliceHeightMm,
    );
  }

  pdf.save(fileName);
};

