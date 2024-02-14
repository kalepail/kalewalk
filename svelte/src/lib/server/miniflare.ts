export const minifare = async () => {
    const { Miniflare } = await import('miniflare')
    const mf = new Miniflare({
      modules: true,
  
      kvPersist: true,
      cachePersist: true,
      durableObjectsPersist: true,
      d1Persist: true,
      r2Persist: true,
  
      script: '',
      serviceBindings: {
        'API': {
          external: {
            address: '0.0.0.0:8787',
            http: {},
          }
        }
      },
    })
  
    const env = await mf.getBindings()
  
    // TODO need to find a way to add in global stuff like crypto and caches and ctx things like waitUntil
    return { env } as App.Platform
  }