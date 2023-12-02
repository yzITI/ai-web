<script>
  import { goto } from '$app/navigation'
  import { balance, getBalance } from '$lib/store.js'
  import swal from 'sweetalert2'
  import Status from '$lib/components/Status.svelte'
  export let data
  const acent = () => window.open('https://auth.njsc.ltd/acent.html?token=' + window.sessionStorage.token)
  getBalance()
  const buttonList = [{
    title: 'Transcribe',
    description: 'Convert audio to subtitles',
    limit: 5,
    action: () => { goto('/transcribe') }
  },{
    title: 'Question',
    description: 'Ask anything!',
    limit: 1,
    action: () => { goto('/question') }
  }
]

  function go (b) {
    if ($balance < b.limit) return swal.fire('Insufficient Balance', '', 'error')
    b.action()
  }
</script>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <h1 class="font-bold text-3xl mx-2">Hi, {data.user?.name}!</h1>
  <p class="mx-2 flex items-center">
    Acent balance: <code class="mx-2 px-1 rounded bg-gray-200">{$balance}</code>
    <button class="rounded-full shadow hover:shadow-md transition-all text-white text-sm bg-blue-500 px-3 py-1 m-2 font-bold" on:click={acent}>Refill</button>
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
    {#each buttonList as b}
      <button on:click={() => { go(b) }} class="m-2 px-4 py-3 flex flex-col text-gray-700 rounded bg-gray-200 hover:bg-gray-300 transition-all">
        <b>{b.title}</b>
        <div class="text-xs">{b.description}</div>
      </button>
    {/each}
  </div>
</div>
<Status></Status>
