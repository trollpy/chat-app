import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

export default GuestRoute;