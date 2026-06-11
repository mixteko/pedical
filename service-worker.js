const CACHE_NAME = "pedicalc-v1.73-health-brand";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./brand-icon.svg",
  "./manifest.json"
];

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(
          urlsToCache
        );

      })

    );

  }
);

self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches.match(
        event.request
      )
      .then(response => {

        return response ||
        fetch(event.request);

      })

    );

  }
);

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys()
      .then(keys => {

        return Promise.all(

          keys.map(key => {

            if(
              key !== CACHE_NAME
            ){

              return caches.delete(
                key
              );

            }

          })

        );

      })

    );

  }
);
