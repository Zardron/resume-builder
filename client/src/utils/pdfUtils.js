import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { converter, formatRgb } from 'culori';

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

export const generateResumePdf = async ({ node, fileName }) => {
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

  clone.style.maxWidth = 'unset';
  clone.style.maxHeight = 'unset';

  tempContainer.appendChild(clone);

  document.body.appendChild(tempContainer);

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
  const maxPdfWidth = 210;
  const maxPdfHeight = 297;

  let pdfWidth = image.width * PX_TO_MM;
  let pdfHeight = image.height * PX_TO_MM;

  const widthScale = maxPdfWidth / pdfWidth;
  const heightScale = maxPdfHeight / pdfHeight;
  const scale = Math.min(widthScale, heightScale);
  const normalizedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

  pdfWidth *= normalizedScale;
  pdfHeight *= normalizedScale;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const xOffset = pdfWidth < maxPdfWidth ? (maxPdfWidth - pdfWidth) / 2 : 0;
  const yOffset = pdfHeight < maxPdfHeight ? (maxPdfHeight - pdfHeight) / 2 : 0;
  pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
  pdf.save(fileName);
};

