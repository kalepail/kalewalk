import puppeteer from '@cloudflare/puppeteer';
import {
    error,
    IRequestStrict,
    json,
    Router,
    RouterType,
    StatusError,
} from 'itty-router'
import { waitForDOMToSettle } from '../lib/puppeteer';

const KEEP_BROWSER_ALIVE_IN_SECONDS = 60;

export class DoBrowser {
    state: DurableObjectState;
    env: Env;
    keptAliveInSeconds: number = 0
    storage: DurableObjectStorage
    browser: puppeteer.Browser | null = null
    page: puppeteer.Page | undefined = undefined
    router: RouterType = Router()

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
        this.storage = state.storage;

        this.router
            .post('/:id', this.process.bind(this))
            .all('*', () => error(404))
    }
    fetch(req: Request, ...extra: any[]) {
        return this.router
            .handle(req, ...extra)
            .then(json)
            .catch((err) => {
                console.error(err)
                return error(err)
            })
    }

    async process(req: IRequestStrict) {
        if (!await this.storage.getAlarm())
            await this.storage.setAlarm(Date.now() + 10 * 1000);

        if (!this.browser || !this.browser?.isConnected()) {
            try {
                this.browser = await puppeteer.launch(this.env.BROWSER);
                this.keptAliveInSeconds = 0;
            } catch (err) {
                console.error(`Could not start browser instance. Error: ${err}`);
                throw err
            }
        }

        if (!this.page || this.page?.isClosed()) {
            try {
                this.page = await this.browser?.newPage();

                await this.page?.setViewport({
                    width: 900,
                    height: 550,
                })
            } catch (err) {
                console.error(`Could not open new page. Error: ${err}`);
                throw err
            }
        }

        if (this.page) {
            await this.page.goto(`https://kalewalk.pages.dev/picture/${req.params.id}`, { timeout: 5000, waitUntil: 'domcontentloaded' })

            try {
                await this.page.waitForSelector('#picture', { timeout: 5000 })
            } catch {
                throw new StatusError(404)
            }

            await waitForDOMToSettle(this.page, 5000, 1000)

            const img = await this.page.screenshot({
                encoding: 'binary',
                fullPage: false,
                type: 'jpeg',
                quality: 100,
                captureBeyondViewport: false,
                clip: {
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 450
                }
            });

            await this.env.KALEWALK_NFTS.put(`${req.params.id}.jpeg`, img);

            await this.page.close();
        }

        return new Response(null, { status: 204 });
    }

    async alarm() {
        this.keptAliveInSeconds += 10;

        if (this.keptAliveInSeconds < KEEP_BROWSER_ALIVE_IN_SECONDS)
            await this.storage.setAlarm(Date.now() + 10 * 1000);
        else {
            this.keptAliveInSeconds = 0;

            if (this.browser)
                await this.browser.close()

            if (this.page)
                await this.page.close()
        }
    }
}