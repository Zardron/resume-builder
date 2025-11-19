import { useApp } from '../contexts/AppContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast notification={notification} onRemove={removeNotification} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

