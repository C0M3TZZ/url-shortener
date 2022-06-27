<script lang="ts">
import { onMount } from "svelte";
import { page } from "$app/stores"
import { goto } from '$app/navigation';
let display:any = null;


onMount(async () => {
  const url:Response = await fetch(`/api/url${$page.url.pathname}.json`);
  const data:any = await url.json();
  if (url.status == 200) {
    display.textContent = data.message;
    return goto(data.data.url, {replaceState: true});
  }
  return goto("/");
});
</script>

<svelte:head>
  <title>Redirecting</title>
</svelte:head>

<div class="flex items-center justify-center h-screen w-screen">
  <div bind:this={display} class="xl:text-5xl text-2xl"></div>
</div>
