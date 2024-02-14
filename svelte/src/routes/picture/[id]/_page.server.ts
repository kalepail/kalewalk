import { error } from '@sveltejs/kit';
import { kalewalkGetPicture } from "$lib";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    // await platform?.env.API.fetch(`http://fake-host/picture/${params.id}.jpeg`).then((res: any) => {
    //     if (res.ok)
    //         return
    //     else throw error(res.status, res.statusText)
    // })

    try {
        await kalewalkGetPicture(Number(params.id))
    } catch {
        throw error(404)
    }

	return {}
};