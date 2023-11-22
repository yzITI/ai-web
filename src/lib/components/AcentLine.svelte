<script>
  import { AIcon } from 'ace.svelte'
  import { mdiRefresh } from '@mdi/js'
  import { status, balance, getBalance } from '$lib/store.js'
  export let color = 'black'
  function acent () {
    window.open('https://auth.njsc.ltd/acent.html?token=' + window.sessionStorage.token)
  }
</script>

<div class="text-sm my-1 font-mono flex items-center">
  <button on:click={acent}>Acent:</button>
  <b class={'mx-2 ' + (($status.acent > $balance || $balance <= 0) && 'text-red-500')}>{$status.acent}/{$balance}</b>
  <button on:click={getBalance}>
    <AIcon path={mdiRefresh} {color} />
  </button>
</div>