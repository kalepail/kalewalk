<script lang="ts">
    import { page } from "$app/stores";
    import { kalewalkGetPicture } from "$lib";

    const decoder = new TextDecoder();

    let name: string = "";
    let timestamp: number = 0;
    let canvas: string[] = [];
    let number: number = Number($page.params.id);

    kalewalkGetPicture(number).then(
        (res: { name: string; timestamp: number; canvas: Buffer }) => {
            name = res.name;
            timestamp = Number(res.timestamp);

            for (let i = 0; i < res.canvas.length; i += 4) {
                const slice: Buffer = res.canvas.subarray(i, i + 4);

                canvas.push(
                    decoder.decode(
                        Buffer.from(removeTrailingZeros(slice.toJSON().data)),
                    ),
                );
            }

            canvas = canvas;
        },
    );

    function convertTimestamp(timestamp: number) {
        let date = new Date(timestamp * 1000);

        let year = date.getFullYear().toString();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }
    function removeTrailingZeros(arr: number[]) {
        while (arr[arr.length - 1] === 0) arr.pop();
        return arr;
    }
</script>

<svelte:head>
	<title>kalewalk – {name}</title>
    <meta name="twitter:title" content="kalewalk – {name}">
    <meta property="og:title" content="kalewalk – {name}">

    <meta name="twitter:image" content="https://kalewalk-api.sdf-ecosystem.workers.dev{location.pathname}.jpeg">
    <meta property="og:image" content="https://kalewalk-api.sdf-ecosystem.workers.dev{location.pathname}.jpeg">
</svelte:head>

<div class="flex w-[800px] h-[450px] border font-mono relative">
    {#if canvas.length}
        <div id="picture">
            <h1 class="absolute text-[1.7rem] left-3 top-[4rem]">Smart</h1>
            <h1
                class="flex items-end justify-center text-center absolute top-0 left-0 font-black text-9xl rotate-90 origin-top-left translate-x-full w-[450px] h-[450px]"
            >
                NFT
            </h1>
        </div>

        <div
            class="ml-auto inline-flex flex-col p-3 origin-top-right"
            style="transform: scale({450 / 172})"
        >
            <div class="inline-flex">
                <h1
                    class="text-xs w-6 h-[7.5rem] py-1 border-l border-r border-t"
                >
                    <div
                        class="flex items-center justify-start rotate-90 origin-top-left h-6 translate-x-6"
                        style="width: calc(7.5rem - 0.25rem)"
                    >
                        {name}
                    </div>
                </h1>

                <div
                    class="[&_ul]:flex [&_li]:w-6 [&_li]:flex [&_li]:items-center [&_li]:justify-center [&_li]:h-6 [&_li]:border-t [&_li]:border-r"
                >
                    <ul>
                        {#each canvas.slice(0, 5) as char}
                            <li>{char}</li>
                        {/each}
                    </ul>
                    <ul>
                        {#each canvas.slice(5, 10) as char}
                            <li>{char}</li>
                        {/each}
                    </ul>
                    <ul>
                        {#each canvas.slice(10, 15) as char}
                            <li>{char}</li>
                        {/each}
                    </ul>
                    <ul>
                        {#each canvas.slice(15, 20) as char}
                            <li>{char}</li>
                        {/each}
                    </ul>
                    <ul>
                        {#each canvas.slice(20, 25) as char}
                            <li>{char}</li>
                        {/each}
                    </ul>
                </div>
            </div>

            <h2
                class="flex px-1 bg-black text-white h-6 items-center justify-end"
            >
                <span class="mr-auto text-[0.5rem]"
                    >{convertTimestamp(timestamp)}</span
                >
                <span class="text-xs">{number.toString().padStart(5, "0")}</span>
            </h2>
        </div>
    {/if}
</div>
