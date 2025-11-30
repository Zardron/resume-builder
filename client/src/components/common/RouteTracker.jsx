import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView, logRouteChange } from '../../services/loggingService';
import { useAppSelector } from '../../store/hooks';

let lastRoute = null;

const RouteTracker = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const currentRoute = location.pathname;
    
    // Log page view
    logPageView(currentRoute);

    // Log route change if it's different from last route
    if (lastRoute !== null && lastRoute !== currentRoute) {
      logRouteChange(lastRoute, currentRoute);
    }

    lastRoute = currentRoute;
  }, [location.pathname, user]);

  return null; // This component doesn't render anything
};

export default RouteTracker;



