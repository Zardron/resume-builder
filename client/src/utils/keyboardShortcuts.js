import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if typing in input, textarea, or contenteditable
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build shortcut key
      const shortcutKey = [
        ctrl && 'ctrl',
        shift && 'shift',
        alt && 'alt',
        key,
      ]
        .filter(Boolean)
        .join('+');

      // Find matching shortcut
      const shortcut = shortcuts.find(
        (s) => s.keys.toLowerCase() === shortcutKey || s.keys.toLowerCase() === key
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;

