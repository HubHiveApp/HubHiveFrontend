import { createContext, useContext } from 'react';

export const LocationContext = createContext({
  location: ["NYU Tandon Campus", 40.7291, -73.9965],
  set_location: () => {},
});

export const useLocationContext = () => useContext(LocationContext);