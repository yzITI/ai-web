<script>
  import { goto } from '$app/navigation'
  import { balance } from '$lib/store.js'
  import Status from '$lib/components/Status.svelte'
  export let data
  const acent = () => window.open('https://auth.njsc.ltd/acent.html?token=' + window.sessionStorage.token)

  const buttonList = [{
    title: 'Acent Balance: ' + `${$balance}`,
    action: acent
  }, {
    title: 'Transcribe',
    action: () => { goto('/transcribe') }
  }]
</script>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <p class="m-2">Home (Page in construction)</p>
  <h1 class="font-bold text-3xl">User: {data.user?.name}</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
    {#each buttonList as b}
      <button on:click={b.action} class="m-2 p-4 bg-gray-200 flex items-center font-bold text-gray-700 rounded hover:bg-gray-300 transition-all">{b.title}
      </button>
    {/each}
  </div>
</div>
<Status></Status>
