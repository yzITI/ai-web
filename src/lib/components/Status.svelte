<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import srpc from '$lib/srpc.js'
  import swal from 'sweetalert2'
  const SS = window.sessionStorage
  if (!SS) window.location.href = 'https://auth.njsc.ltd/#/launch/ai'
  let show = false
  let S = { status: 'loading' }
  const statusColor = {
    loading: 'from-gray-500',
    idle: 'from-green-500',
    running: 'from-red-500',
    done: 'from-blue-500'
  }
  const breath = setInterval(async () => {
    const res = await srpc.status(SS.token)
    if (!res.ok) {
      clearInterval(breath)
      return swal.fire('Error', res.err, 'error')
    }
    S = res
  }, 2000)

  function go () {
    if (!S.type) return
    if ($page.url.pathname === '/' + S.type) return
    goto('/' + S.type)
  }
</script>

<div class={'fixed top-4 right-4 rounded transition-all duration-500 shadow hover:shadow-md overflow-hidden bg-gray-800 ' + (show ? 'h-32 w-56' : 'h-8 w-24')}>
  <button class={'capitalize w-full h-8 font-bold text-right text-white pr-2 bg-gradient-to-r to-transparent ' + statusColor[S.status]} on:click={() => { show = !show && (S.status === 'running' || S.status === 'done') }}>{S.status}</button>
  <div class="flex h-24 w-full items-center flex-col justify-center">
    <button class="capitalize transition-all duration-500 shadow hover:shadow-md rounded-full font-bold px-6 hover:px-8 py-2 bg-white text-black" on:click={go}>{S.type}</button>
    {#if S.acent}
      <p class="text-gray-200 text-sm my-1">Acent: {S.acent}</p>
    {/if}
  </div>
</div>