const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
  });
};
activateEvent();

self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked.");
  event.notification.close();

  const url = event.notification.data.url;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // If not found, then open a new window/tab. However, if you strictly want to avoid this, you can remove this line.
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
