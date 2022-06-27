<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/env';
  let url:string = "";
  let path:string = "";
  let done:boolean = false;
  let error:boolean = false;
  let errorMessage:string = "";
  let success:boolean = false;
  let successMessage:string = "";
  let process:boolean = false;
  const hostname = $page.url.host;
  const urlSafeRegex = /^[a-zA-Z0-9-_]+$/;
  const urlValidator = /[(http(s)?)][:\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  import { fly, fade } from 'svelte/transition';
  const alertError = (msg:string) => {
    if (error == true) {return}
    errorMessage = msg;
    error = true;
    setTimeout(() => {
      error = false;
    }, 1500);
  };
  const alertSuccess = (msg:string) => {
    if (success == true) {return}
    successMessage = msg;
    success = true;
    setTimeout(() => {
      success = false;
    }, 1500);
  };
  const copyText:Function = async (text:string) => {
    if (browser){
      navigator.clipboard.writeText(text);
      alertSuccess("Copied to clipboard!");
    }
  }
  const createShortUrl:Function = async () => {
    if (process == true) {return}
    if (url.length <= 0) {
      alertError("Please enter a URL");
      return;
    };
    if (!urlSafeRegex.test(path) && path.length > 0) {
      alertError("Custom Path is not valid");
      return;
    };
    if (!urlValidator.test(url)) {
      alertError("URL is not valid");
      return;
    };
    process = true;
    const response:Response = await fetch("/api/url.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        path: path,
        createdAt: new Date
      })
    });
    if (response.status === 400) {
      alertError("Custom Path is already taken!");
      process = false;
      return;
    }
    const resjson = await response.json();
    process = false;
    path = resjson.data.path;
    done = true;
  }
</script>

<svelte:head>
  <title>URL Shortener</title>
</svelte:head>

<div class="h-screen w-screen flex flex-col items-center justify-center bg-base-100">
  {#if error}
    <div class="alert alert-error shadow-lg absolute top-4 w-60" transition:fade>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{errorMessage}</span>
      </div>
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success shadow-lg absolute top-4 w-60" transition:fade>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{successMessage}</span>
      </div>
    </div>
  {/if}
  
  <div class="flex flex-col gap-4 w-full px-4">
    <div class="flex items-center justify-center">
      <div class="xl:text-5xl text-2xl">{hostname}/{path}</div>
    </div>
    {#if !done}
      <div class="flex flex-col gap-4 w-full" transition:fly="{{duration: 100, y:150}}">
        <input bind:value={url} type="text" placeholder="URL Here" class="input w-full input-bordered input-secondary"/>
        <input bind:value={path} type="text" placeholder="Custom Path" class="input w-full input-bordered input-secondary" />
        <div on:click={() => {createShortUrl()}} class:loading={process} class="btn btn-accent">Short Me</div>
      </div>
      {:else}
        <div on:click={() => {copyText(`${hostname}/${path}`)}} class="btn btn-accent">Copy</div>
        <div on:click={() => {done = false; path = ""; url = ""; process = false}} class="btn btn-error absolute top-4 left-4">back</div>
    {/if}
  </div>
</div>
