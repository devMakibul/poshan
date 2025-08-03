
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.method === "POST" &&
    url.pathname === "/poshan/"
  ) {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const file = formData.get("image");
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Save image to session storage to use in app
            self.registration.navigationPreload
              ?.enable()
              .then(() => {
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => {
                    client.postMessage({
                      type: "shared-image",
                      data: reader.result,
                    });
                  });
                });
              });
          };
          reader.readAsDataURL(file);
        }

        // Respond with your normal app shell
        const response = await fetch("/poshan/", { method: "GET" });
        return response;
      })()
    );
  }
});
