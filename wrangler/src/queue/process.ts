export async function queueProcess(batch: MessageBatch<number>, env: Env, ctx: ExecutionContext) {
    const id = env.DO_BROWSER.idFromName("kalewalk.v1");
    const obj = env.DO_BROWSER.get(id);

    for (const message of batch.messages)
        await obj.fetch(`http://fake-host/${message.body}`, { method: "POST" });
}