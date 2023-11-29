<script>
  import srpc from '$lib/srpc.js'
  import swal from 'sweetalert2'
  import Status from '$lib/components/Status.svelte'
  import AcentLine from '$lib/components/AcentLine.svelte'
  import languages from '$lib/utilities/languages.json'
  import { status, balance, getBalance, loading } from '$lib/store.js'
  export let data
  let question = '', language = '', format = 'srt'
  let result = ''

  function loadTask (t) {
    if (!t?.ok) return swal.fire('Error', t.err, 'error')
    prompt = t.prompt
    language = t.language
    format = t.format
    result = t.result
  }

  async function init () {
    $loading = true
    if (!data.user?.token) return
    await getBalance()
    const status = await srpc.status(data.user.token)
    if (status.label !== 'question') return $loading = false
    loadTask(await srpc.task(data.user.token))
    $loading = false
  }
  init()

  async function pay () {
    $loading = true
    loadTask(await srpc.task(data.user.token, true))
    $loading = false
    getBalance()
  }

  async function submit () {
    result = ''
    if ($status.status !== 'idle') return

    $loading = true
    // const resp = await srpc.question() to be continued
    $loading = false
    if (resp.ok) return swal.fire('Success', 'Task created successfully', 'success')
    swal.fire('Error', resp.err, 'error')
  }
</script>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <h1 class="text-2xl font-bold mt-4 px-2">Question</h1>
  <p class="mb-6 px-2">Generate a reply using AI</p>
  <textarea class="w-full p-2 outline-none m-2 rounded block" rows="3" placeholder="Be free to ask any question to Chatgpt here!" bind:value={question} on:keyup|preventDefault={(event) => event.key === 'Enter' && submit()}></textarea>
  {#if $status.status === 'idle'}
    <button on:click={submit} class="block text-white rounded-full px-6 py-2 m-2 transition-all shadow hover:shadow-md bg-blue-500 font-bold">Submit</button>
  {/if}
  {#if $status.status === 'done'}
    <div class="m-2 p-2 flex items-center flex-wrap">
      <button on:click={pay} class="block text-white rounded-full px-6 py-2 mr-6 transition-all shadow hover:shadow-md bg-orange-500 font-bold">Pay Result</button>
      <AcentLine></AcentLine>
    </div>
  {/if}
</div>