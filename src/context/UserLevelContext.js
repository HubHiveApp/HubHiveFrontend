import { createContext, useContext } from 'react';

export const UserLevelContext = createContext({
  access_token: '',
  set_access_token: () => {},
});

export const useUserLevelContext = () => useContext(UserLevelContext);
