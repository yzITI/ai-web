<script>
  import '../index.css'
  import loadingImg from '$lib/images/loading.svg'
  import { loading } from '$lib/store.js'
  import { fade } from 'svelte/transition'
</script>

<svelte:head>
  <title>AI</title>
</svelte:head>

<slot />

{#if $loading}
  <div transition:fade class="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-100 flex flex-col items-center justify-center">
    <img alt="loading" src={loadingImg}>
    {#if typeof $loading === 'string'}
      <div class="my-2">{$loading}</div>
    {/if}
  </div>
{/if}
