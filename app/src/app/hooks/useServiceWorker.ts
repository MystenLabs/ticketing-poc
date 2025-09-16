import { useContext } from "react";
import { ServiceWorkerContext } from "../contexts/serviceWorker/ServiceWorkerContext";

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);
  return context;
};
