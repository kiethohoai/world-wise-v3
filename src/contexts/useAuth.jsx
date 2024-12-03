import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    return new Error(`Can't not use AuthContext outside the AuthProvider!`);
  return context;
}
export default useAuth;
