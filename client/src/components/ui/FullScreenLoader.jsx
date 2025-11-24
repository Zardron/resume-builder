import { useEffect, useMemo, useState } from 'react';
import LOGO from '../../assets/logo.png';

const LOADER_MESSAGES = [
  'Gathering your career highlights...',
  'Tailoring the perfect resume layout...',
  'Spotlighting your standout skills...',
];

const MESSAGE_FADE_DURATION = 350;
const MESSAGE_DISPLAY_DURATION = 2100;

const FullScreenLoader = ({ isExiting = false }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || LOADER_MESSAGES.length < 2 || isExiting) return undefined;

    let cycleTimeoutId;
    let fadeTimeoutId;
    let isCancelled = false;

    const scheduleNextMessage = () => {
      cycleTimeoutId = window.setTimeout(() => {
        setIsMessageVisible(false);

        fadeTimeoutId = window.setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % LOADER_MESSAGES.length);
          setIsMessageVisible(true);

          if (!isCancelled) {
            scheduleNextMessage();
          }
        }, MESSAGE_FADE_DURATION);
      }, MESSAGE_DISPLAY_DURATION);
    };

    scheduleNextMessage();

    return () => {
      isCancelled = true;
      window.clearTimeout(cycleTimeoutId);
      window.clearTimeout(fadeTimeoutId);
    };
  }, [prefersReducedMotion, isExiting]);

  useEffect(() => {
    if (isExiting) {
      setIsMessageVisible(false);
    }
  }, [isExiting]);

  return (
    <div
      className={`initial-loader${isExiting ? ' initial-loader--exit' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="initial-loader__content">
        <div className="initial-loader__logo-wrapper">
          <span className="initial-loader__glow" aria-hidden="true" />
          <div className="initial-loader__ring" aria-hidden="true" />
          <span className="initial-loader__spark initial-loader__spark--one" aria-hidden="true" />
          <span className="initial-loader__spark initial-loader__spark--two" aria-hidden="true" />
          <img src={LOGO} alt="ResumeIQHub logo" className="initial-loader__logo" />
        </div>
        <p className="initial-loader__message">
          <span
            className={`initial-loader__message-text${
              isMessageVisible ? ' initial-loader__message-text--visible' : ''
            }`}
          >
            {LOADER_MESSAGES[messageIndex]}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;

