<script>
  import { goto } from '$app/navigation'
  import { balance } from '$lib/store.js'
  import Status from '$lib/components/Status.svelte'
  export let data
  const acent = () => window.open('https://auth.njsc.ltd/acent.html?token=' + window.sessionStorage.token)
</script>

<p>Home (Page in construction)</p>
<div>User: {data.user?.name}</div>
<button class="m-4 p-2 bg-gray-200 block" on:click={acent}>Acent Balance: {$balance}</button>
<button class="m-4 p-2 bg-gray-200 block" on:click={() => { goto('/transcribe') }}>Transcribe</button>
<Status></Status>
