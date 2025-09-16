import { ServiceWorkerContextProps } from "@/app/types/ServiceWorkerContextProps";
import React, { createContext } from "react";

export const ServiceWorkerContext = createContext<ServiceWorkerContextProps>({
  registration: null,
  handleRefreshServiceWorker: () => {},
});
