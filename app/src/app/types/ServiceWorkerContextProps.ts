export interface ServiceWorkerContextProps {
  registration: ServiceWorkerRegistration | null;
  handleRefreshServiceWorker: () => void;
}
