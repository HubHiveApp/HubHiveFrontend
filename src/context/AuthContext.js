import { createContext, useContext } from 'react';

export const TokenContext = createContext({
  access_token: '',
  set_access_token: () => {},
});

export const useAccessToken = () => useContext(TokenContext);
