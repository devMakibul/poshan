self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'POST' || new URL(event.request.url).pathname !== '/poshan/') return;

  event.respondWith(handlePost(event));
});

async function handlePost(event) {
  const formData = await event.request.formData();
  const files = formData.getAll('image');

  const dataURLs = await Promise.all(files.map(file => fileToDataURL(file)));

  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  let targetClient = allClients.find(c => c.focused) || allClients[0];

  if (!targetClient) {
    targetClient = await self.clients.openWindow('/?from=share_target');
  }

  // Wait for new tab to be ready
  await new Promise(resolve => setTimeout(resolve, 500));

  targetClient.postMessage({
    type: 'share-target',
    files: dataURLs
  });

  return Response.redirect('/poshan/', 303);
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
