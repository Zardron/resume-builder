export const createHalfBlurredPreviewImage = (
  dataUrl,
  blurRadius = 12,
  visibleRatio = 0.4,
  fadeRatio = 0.25,
  highlightOpacity = 0.35
) =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(dataUrl);
      return;
    }

    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(dataUrl);
          return;
        }

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);

        context.save();
        const clampedVisibleRatio = Math.min(Math.max(visibleRatio, 0), 1);
        const clampedFadeRatio = Math.min(Math.max(fadeRatio, 0), 1);

        const blurStartY = Math.round(image.height * clampedVisibleRatio);
        const fadeHeight = Math.max(
          Math.round(image.height * clampedFadeRatio),
          1
        );
        const gradientStartY = Math.max(blurStartY - fadeHeight, 0);

        context.drawImage(image, 0, 0);

        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = image.width;
        blurCanvas.height = image.height;
        const blurContext = blurCanvas.getContext("2d");
        if (!blurContext) {
          resolve(canvas.toDataURL("image/png"));
          return;
        }
        blurContext.filter = `blur(${blurRadius}px)`;
        blurContext.drawImage(image, 0, 0);

        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = image.width;
        maskCanvas.height = image.height;
        const maskContext = maskCanvas.getContext("2d");
        if (!maskContext) {
          resolve(canvas.toDataURL("image/png"));
          return;
        }

        const gradient = maskContext.createLinearGradient(
          0,
          gradientStartY,
          0,
          image.height
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");

        const relativeStart =
          blurStartY >= image.height
            ? 1
            : (blurStartY - gradientStartY) /
              Math.max(image.height - gradientStartY, 1);
        gradient.addColorStop(
          Math.min(Math.max(relativeStart, 0), 1),
          "rgba(0,0,0,0.4)"
        );
        gradient.addColorStop(1, "rgba(0,0,0,1)");

        maskContext.fillStyle = gradient;
        maskContext.fillRect(0, gradientStartY, image.width, image.height);

        blurContext.globalCompositeOperation = "destination-in";
        blurContext.drawImage(maskCanvas, 0, 0);
        blurContext.globalCompositeOperation = "source-over";

        context.drawImage(blurCanvas, 0, 0);

        if (highlightOpacity > 0) {
          const overlayGradient = context.createLinearGradient(
            0,
            gradientStartY,
            0,
            image.height
          );
          overlayGradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${Math.max(highlightOpacity - 0.2, 0)})`
          );
          overlayGradient.addColorStop(
            1,
            `rgba(255, 255, 255, ${highlightOpacity})`
          );
          context.fillStyle = overlayGradient;
          context.fillRect(0, gradientStartY, image.width, image.height);
        }

        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error("Failed to create blurred preview image:", error);
        resolve(dataUrl);
      }
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });


