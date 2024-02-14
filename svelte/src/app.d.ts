// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: {
        API: Fetcher;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache }
    }
  }
}

export { }