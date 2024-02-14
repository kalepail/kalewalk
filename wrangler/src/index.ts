import {
	error,
	json,
	Router,
	createCors,
} from 'itty-router'
import { DoBrowser } from "./durable_object/browser";
import { queueProcess } from './queue/process';
import { getPicture, postPicture } from './fetch/picture';

const { preflight, corsify } = createCors()

const router = Router()

router
	.all('*', preflight)
	.get('/picture/:id.jpeg', getPicture)
	.post('/picture/:id', postPicture)
	.all('*', () => error(404))

const handler = {
	fetch: (req: Request, ...extra: any[]) =>
		router
			.handle(req, ...extra)
			.then(json)
			.catch((err) => {
				console.error(err)
				return error(err)
			})
			.then(corsify),
	queue: queueProcess,
}

export {
	DoBrowser,
	handler as default
}