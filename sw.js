self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/poshan/share-target') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const file = formData.get('image');
      if (file && file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        const dataUrl = `data:${file.type};base64,${btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))}`;

        const allClients = await clients.matchAll({ includeUncontrolled: true });
        for (const client of allClients) {
          client.postMessage({ type: 'shared-image', data: dataUrl });
        }
      }

      return Response.redirect('/poshan/', 303);
    })());
  }
});
