export const copyToClipboard = async (text, onSuccess, onError) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      onSuccess?.();
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        onSuccess?.();
      } catch (err) {
        onError?.(err);
      }
      document.body.removeChild(textArea);
    }
  } catch (err) {
    onError?.(err);
  }
};

