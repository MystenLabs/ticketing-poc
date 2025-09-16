import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ServiceWorkerContext } from "./ServiceWorkerContext";

export interface ServiceWorkerProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ServiceWorkerProvider = ({
  children,
}: ServiceWorkerProviderProps) => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    register();
    return () => {
      // Unregister the service worker when the component unmounts
      if (registration) {
        handleUnRegisterServiceWorker(registration);
      }
    };
  }, []);

  const register = async () => {
    let serviceWorkerRegistration = await handleRegisterServiceWorker();
    if (!!serviceWorkerRegistration) {
      setRegistration(serviceWorkerRegistration);
    } else {
      setRegistration(null);
    }
  };

  const handleRegisterServiceWorker = ():
    | Promise<ServiceWorkerRegistration | undefined>
    | undefined => {
    if ("serviceWorker" in navigator) {
      return navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          return registration;
        })
        .catch((err) => {
          return undefined;
        });
    } else {
      return undefined;
    }
  };

  const handleUnRegisterServiceWorker = (
    serviceWorkerRegistration: ServiceWorkerRegistration,
    callback?: () => void,
  ) => {
    serviceWorkerRegistration
      .unregister()
      .then(() => {
        !!callback && callback();
      })
      .catch((err: any) => {
        console.error("Error while unregistering service worker:", err);
      });
  };

  const handleRefreshServiceWorker = () => {
    if (!registration) {
      handleRegisterServiceWorker();
    } else {
      handleUnRegisterServiceWorker(registration, () => {
        handleRegisterServiceWorker();
      });
    }
  };

  return (
    <ServiceWorkerContext.Provider
      value={{
        registration,
        handleRefreshServiceWorker,
      }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
};
