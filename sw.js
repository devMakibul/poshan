self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Listen for POST requests from share_target
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle POST requests to '/'
  if (event.request.method === 'POST') {
    event.respondWith((async () => {
      // Parse the form data
      const formData = await event.request.formData();

      // Get the shared file(s) from the form data
      const files = formData.getAll('image');

      if (files.length > 0) {
        // We can only communicate with controlled clients
        const allClients = await self.clients.matchAll({
          includeUncontrolled: true,
          type: 'window'
        });

        // Send the file(s) to the client page
        for (const client of allClients) {
          client.postMessage({
            type: 'share-target',
            files: await Promise.all(
              files.map(file => fileToDataURL(file))
            )
          });
        }
      }

      // Respond with a redirect to the homepage or any URL you want
      
    })());
  }
});

// Helper: Convert File to DataURL to send via postMessage
async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
