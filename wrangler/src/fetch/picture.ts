import type { IRequestStrict } from "itty-router";

export async function getPicture(req: IRequestStrict, env: Env) {
    const picture = await env.KALEWALK_NFTS.get(`${req.params.id}.jpeg`);

    if (picture) {
        return new Response(await picture.arrayBuffer(), {
            headers: {
                'content-length': picture.size.toString() || '0',
                'Content-Type': 'image/jpeg',
            },
        })
    } else {
        await env.KALEWALK_QUEUE.send(req.params.id)
        return new Response(null, { status: 404 })
    }
}

export async function postPicture(req: IRequestStrict, env: Env) {
    await env.KALEWALK_QUEUE.send(req.params.id)
    return new Response(null, { status: 204 })
}