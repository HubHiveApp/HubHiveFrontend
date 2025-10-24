import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  loggedIn: false,
  setLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);
