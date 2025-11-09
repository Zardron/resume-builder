import {
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  Loader2,
  Share2,
} from "lucide-react";
import PaperSizeDropdown from "./PaperSizeDropdown";
import MarginPresetDropdown from "./MarginPresetDropdown";
import SectionFontSizeDropdown from "./SectionFontSizeDropdown";

const ResumePreviewPanel = ({
  title = "Live Preview",
  paperSizes,
  selectedPaperSize,
  onPaperSizeChange,
  templateDisplayName,
  templateBadgeClassName,
  isPublic,
  onTogglePublic,
  onDownload,
  isDownloading,
  isDownloadDisabled,
  downloadTitle,
  downloadButtonIdleLabel = "Download",
  downloadButtonLoadingLabel = "Generating...",
  onShare,
  shareButtonLabel = "Share",
  shareButtonTitle,
  shareButtonDisabled = false,
  marginPresets,
  currentMarginPresetId,
  onMarginPresetChange,
  activeSectionId,
  sectionFontSizes,
  onSectionFontSizeChange,
  alertMessage,
  previewDimensions,
  previewScale,
  scaledWrapperWidth,
  scaledWrapperHeight,
  previewPageCount = 1,
  pageHeightPx,
  pageGap = 32,
  pageMargins,
  isFullHeightTemplate,
  previewContainerRef,
  previewRef,
  renderTemplate,
  previewFooterText = "Preview updates in real-time as you fill out the form",
  containerClassName = "",
}) => {
  const totalPages =
    typeof previewPageCount === "number" && previewPageCount > 0
      ? Math.ceil(previewPageCount)
      : 1;
  const pageWidthValue =
    typeof previewDimensions?.width === "string" && previewDimensions.width
      ? previewDimensions.width
      : "100%";
  const pageHeightValue =
    typeof previewDimensions?.height === "string" && previewDimensions.height
      ? previewDimensions.height
      : "auto";
  const numericPageHeight =
    typeof pageHeightPx === "number" && Number.isFinite(pageHeightPx)
      ? pageHeightPx
      : parseFloat(
          typeof previewDimensions?.height === "string"
            ? previewDimensions.height
            : ""
        ) || 0;
  const pageGapValue =
    typeof pageGap === "number" && Number.isFinite(pageGap) ? pageGap : 32;
  const canRenderTemplate = typeof renderTemplate === "function";
  const marginTopPx =
    typeof pageMargins?.top === "number" && Number.isFinite(pageMargins.top)
      ? pageMargins.top
      : 0;
  const marginBottomPx =
    typeof pageMargins?.bottom === "number" &&
    Number.isFinite(pageMargins.bottom)
      ? pageMargins.bottom
      : 0;
  const contentSliceHeight =
    numericPageHeight > 0
      ? Math.max(numericPageHeight - marginTopPx - marginBottomPx, 0)
      : 0;

  const handleShare = onShare || (() => {});
  const handleTogglePublic = onTogglePublic || (() => {});
  const handleDownload = onDownload || (() => {});
  const downloadButtonLabel = isDownloading
    ? downloadButtonLoadingLabel
    : downloadButtonIdleLabel;

  return (
    <div
      className={`w-full relative rounded-md lg:col-span-5 overflow-hidden mb-4 sticky top-18 ${containerClassName}`}
    >
      <div className="bg-white rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <PaperSizeDropdown
                  paperSizes={paperSizes}
                  selectedPaperSize={selectedPaperSize}
                  onSelect={onPaperSizeChange}
                />
                {templateDisplayName ? (
                  <span
                    className={
                      templateBadgeClassName ||
                      "px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg"
                    }
                  >
                    {templateDisplayName} Template
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handleTogglePublic}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
                style={
                  isPublic
                    ? {
                        backgroundColor:
                          "rgba(var(--primary-color-rgb, 59, 130, 246), 0.1)",
                        color: "var(--primary-color)",
                        border:
                          "1px solid rgba(var(--primary-color-rgb, 59, 130, 246), 0.2)",
                      }
                    : {
                        backgroundColor: "rgba(156, 163, 175, 0.1)",
                        color: "#6b7280",
                        border: "1px solid rgba(156, 163, 175, 0.2)",
                      }
                }
                type="button"
              >
                {isPublic ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Private
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloadDisabled}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    "rgba(var(--accent-color-rgb, 139, 92, 246), 0.1)",
                  color: "var(--accent-color)",
                  border:
                    "1px solid rgba(var(--accent-color-rgb, 139, 92, 246), 0.2)",
                }}
                title={downloadTitle}
                type="button"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloadButtonLabel}
              </button>

              <button
                onClick={handleShare}
                disabled={shareButtonDisabled}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    "rgba(var(--primary-color-rgb, 59, 130, 246), 0.1)",
                  color: "var(--primary-color)",
                  border:
                    "1px solid rgba(var(--primary-color-rgb, 59, 130, 246), 0.2)",
                }}
                title={shareButtonTitle}
                type="button"
              >
                <Share2 className="w-4 h-4" />
                {shareButtonLabel}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <MarginPresetDropdown
                presets={marginPresets}
                currentPresetId={currentMarginPresetId}
                onSelect={onMarginPresetChange}
              />
              <SectionFontSizeDropdown
                activeSectionId={activeSectionId}
                sectionFontSizes={sectionFontSizes}
                onChange={onSectionFontSizeChange}
              />
            </div>
          </div>

          {alertMessage ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-700">
              <AlertTriangle className="mt-1 h-3.5 w-3.5 flex-shrink-0" />
              <p className="max-w-xl">{alertMessage}</p>
            </div>
          ) : null}
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mx-4" />

        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div
              ref={previewContainerRef}
              className="max-h-[600px] overflow-y-auto overflow-x-hidden"
            >
          <div className="flex justify-center">
                <div
                  className="resume-preview-scale-wrapper"
                  style={{
                    width: scaledWrapperWidth,
                    height: scaledWrapperHeight,
                  }}
                >
              {canRenderTemplate ? (
                <div
                  className="resume-preview-page-container"
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: pageWidthValue,
                  }}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{
                      gap: `${pageGapValue}px`,
                      width: "100%",
                    }}
                  >
                    {Array.from({ length: totalPages }, (_, index) => {
                      const effectiveContentHeight =
                        contentSliceHeight > 0
                          ? contentSliceHeight
                          : Math.max(
                              numericPageHeight - marginTopPx - marginBottomPx,
                              0
                            );
                      const viewportHeight =
                        effectiveContentHeight > 0
                          ? effectiveContentHeight
                          : numericPageHeight;
                      const sliceOffset =
                        marginTopPx +
                        index *
                          (effectiveContentHeight > 0
                            ? effectiveContentHeight
                            : numericPageHeight);

                      return (
                        <div
                          key={`preview-page-${index}`}
                          className="relative bg-white border border-gray-200 dark:border-gray-700 shadow-sm rounded-md overflow-hidden"
                          style={{
                            width: pageWidthValue,
                            height: pageHeightValue,
                          }}
                        >
                          {marginTopPx > 0 ? (
                            <div
                              style={{
                                height: `${marginTopPx}px`,
                                width: "100%",
                                backgroundColor: "#ffffff",
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              width: "100%",
                              height: viewportHeight
                                ? `${viewportHeight}px`
                                : "100%",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              className="text-[1em] resume-preview-content"
                              data-preview-environment="true"
                              style={{
                                width: pageWidthValue,
                                height: isFullHeightTemplate
                                  ? previewDimensions.height
                                  : "auto",
                                transform:
                                  sliceOffset > 0
                                    ? `translateY(-${sliceOffset}px)`
                                    : undefined,
                                transformOrigin: "top left",
                              }}
                            >
                              {renderTemplate(false)}
                            </div>
                          </div>
                          {marginBottomPx > 0 ? (
                            <div
                              style={{
                                height: `${marginBottomPx}px`,
                                width: "100%",
                                backgroundColor: "#ffffff",
                              }}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
                </div>
              </div>
            </div>
        {canRenderTemplate ? (
          <div
            aria-hidden="true"
            className="pointer-events-none"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              opacity: 0,
              zIndex: -1,
              width: pageWidthValue,
            }}
          >
            <div
              ref={previewRef}
              data-preview-environment="true"
              className="text-[1em] resume-preview-content"
              style={{
                width: pageWidthValue,
                height: isFullHeightTemplate
                  ? previewDimensions.height
                  : "auto",
              }}
            >
              {renderTemplate(false)}
            </div>
          </div>
        ) : null}
          </div>
          {previewFooterText ? (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {previewFooterText}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPanel;

