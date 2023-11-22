<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import swal from 'sweetalert2'
  import srpc from '$lib/srpc.js'
  import AcentLine from '$lib/components/AcentLine.svelte'
  import { status } from '$lib/store.js'
  if (!window.sessionStorage.token) window.location.href = 'https://auth.njsc.ltd/#/launch/ai'
  let show = false
  const statusColor = {
    loading: 'from-gray-500',
    idle: 'from-green-500',
    running: 'from-red-500',
    done: 'from-blue-500'
  }
</script>

<div class={'fixed top-4 right-4 rounded transition-all duration-500 shadow hover:shadow-md overflow-hidden bg-gray-800 ' + (show ? 'h-32 w-64' : 'h-8 w-24')}>
  <button class={'capitalize w-full h-8 font-bold text-right text-white pr-2 bg-gradient-to-r to-transparent ' + statusColor[$status.status]} on:click={() => { show = !show && ($status.status === 'running' || $status.status === 'done') }}>{$status.status}</button>
  <div class="flex h-24 w-full items-center flex-col justify-center text-gray-200">
    <button class="capitalize transition-all duration-500 shadow hover:shadow-md rounded-full font-bold px-6 hover:px-8 py-2 bg-white text-black" on:click={() => { goto('/' + $status.type) }}>{$status.type}</button>
    {#if $status.acent}
      <AcentLine color="white"></AcentLine>
    {/if}
  </div>
</div>