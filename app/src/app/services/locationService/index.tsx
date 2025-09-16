import React, { useState, useContext } from "react";
import { createContext } from "react";
import { LocationService } from "./provider";

interface ILocationContext {
  locationService: any;
}

const defaultState = {
  locationService: LocationService(),
};

export const LocationServiceContext =
  createContext<ILocationContext>(defaultState);

interface Props {
  children: React.ReactNode;
}

const LocationProvider: React.FC<Props> = ({ children }) => {
  const [locationService, setLocationService] = useState(
    defaultState.locationService,
  );

  return (
    <LocationServiceContext.Provider value={{ locationService }}>
      {children}
    </LocationServiceContext.Provider>
  );
};

export function useLocationService() {
  return useContext(LocationServiceContext);
}

export default LocationProvider;
