import { useState } from 'react';

const ConfirmationModal = ({
  cancelButtonText,
  confirmButtonText,
  title,
  message,
  setShowConfirmationModal,
  onConfirm,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      callback?.();
      setShowConfirmationModal(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`animate__animated ${
          isClosing ? 'animate__zoomOut' : 'animate__zoomIn'
        } animate__faster flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
              stroke="#DC2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-gray-900 dark:text-gray-100 font-semibold mt-4 text-xl">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">{message}</p>
        <div className="flex items-center gap-4 mt-5 w-full">
          <button
            onClick={() => handleClose()}
            type="button"
            className="flex-1 md:w-36 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-600 active:scale-95 transition"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={() => handleClose(onConfirm)}
            type="button"
            className="flex-1 md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
