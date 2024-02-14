import type puppeteer from "@cloudflare/puppeteer";

export function waitForDOMToSettle(page: puppeteer.Page, timeoutMs = 30000, debounceMs = 1000) {
    return page.evaluate(
        (timeoutMs, debounceMs) => {
            let timeout: NodeJS.Timeout;

            return new Promise((resolve) => {
                const mainTimeout = setTimeout(() => {
                    clearTimeout(timeout);
                    observer.disconnect();
                    resolve(void 0);
                }, timeoutMs);

                const observer = new MutationObserver(() => {
                    clearTimeout(timeout);

                    timeout = setTimeout(() => {
                        clearTimeout(mainTimeout);
                        observer.disconnect();
                        resolve(void 0);
                    }, debounceMs);
                });

                const config = {
                    attributes: true,
                    childList: true,
                    subtree: true,
                };

                observer.observe(document.body, config);
            });
        },
        timeoutMs,
        debounceMs,
    )
}