<script lang="ts">
    import { kalewalkMint } from "$lib";

    const MAX_RETRIES = 30;
    const encoder = new TextEncoder();

    let chars: string[] = new Array(25).fill(""); // Array.from(`┌┬┬┬┐││▀▄││█│▀││▄▀││┴┴┴┴┴`); // new Array(25).fill(' ').map((_, i) => i % 2 === 0 ? '⸻' : '⎝')
    let name: string = "";
    let number: number = 0;
    let loading: boolean = false;
    let generating: boolean = false;
    let retries: number = 0;

    async function mint() {
        number = 0
        retries = 0
        generating = false

        if (name.length > 15)
            return alert("Name is too long (15 characters max)");

        loading = true;

        try {
            const picture = chars
                .map((char) => {
                    let arr = new Uint8Array(4);
                    encoder.encodeInto(char, arr);

                    return [...arr];
                })
                .flat();

            number = await kalewalkMint(name, picture);
        } finally {
            loading = false;
        }
    }
    function resetTarget(event: MouseEvent) {
        const target = event.target as HTMLInputElement;
        target.select();
    }
    function imgError(e: Event) {
        const target = e.target as HTMLImageElement;

        setTimeout(() => {
            if (retries < MAX_RETRIES) {
                target.src = target.src;
                generating = true;
                retries++;
            } else {
                generating = false;
                retries = 0
            }
        }, 1000);
    }
</script>

<div class="flex flex-col items-start m-3">
    <div class="font-mono border-t border-l">
        <ul class="flex flex-wrap w-[7.5rem]">
            {#each chars as char}
                <li class="w-6 h-6 border-r border-b">
                    <input
                        class="w-full relative focus:z-10 text-center bg-transparent border-none"
                        type="text"
                        bind:value={char}
                        on:click={(e) => resetTarget(e)}
                        on:input={(e) => (char = char.at(-1) || " ")}
                    />
                </li>
            {/each}
        </ul>
    </div>

    <input
        class="border rounded mt-2 px-2"
        type="text"
        placeholder="Name"
        bind:value={name}
    />

    <button
        class="bg-black text-white px-3 rounded mt-2"
        on:click={() => mint()}>{loading ? "..." : "Mint"}</button
    >
</div>

{#if number}
    <p class="ml-3 mt-3">Minted 🎉</p>
    
    {#if generating}
        <p class="ml-3 mt-3">Generating picture...</p>
    {/if}

    <img
        class="ml-3 mt-3"
        src="https://kalewalk-api.sdf-ecosystem.workers.dev/picture/{number}.jpeg"
        alt={name}
        on:error={(e) => imgError(e)}
        on:load={() => (generating = false)}
    />
{/if}
