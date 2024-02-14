interface Env {
    BROWSER: BrowserWorker
    KALEWALK_QUEUE: Queue
    KALEWALK_NFTS: R2Bucket
    DO_BROWSER: DurableObjectNamespace
}