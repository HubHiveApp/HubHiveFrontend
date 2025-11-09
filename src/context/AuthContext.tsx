import { createContext, useContext } from 'react';

interface TokenContextType {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const TokenContext = createContext<TokenContextType>({
  accessToken: '',
  setAccessToken: () => {},
});

export const useAccessToken = () => useContext(TokenContext);
