<script>
  import srpc from '$lib/srpc.js'
  import swal from 'sweetalert2'
  import Status from '$lib/components/Status.svelte'
  import AcentLine from '$lib/components/AcentLine.svelte'
  import { micromark } from 'micromark'
  import { status, balance, getBalance, loading } from '$lib/store.js'
  export let data
  let question = '', system = '', model = 'gpt-3.5-turbo'
  let result = null
  let html

  function loadTask (t) {
    if (!t?.ok) return swal.fire('Error', t.err, 'error')
    if (t.messages[0]?.role === 'system') {
      system = t.messages[0]?.content
      question = t.messages[1]?.content
    } else question = t.messages[0]?.content
    result = t.result
    if (!result?.content) return
    html = micromark(result.content.trim())
    setTimeout(() => { window.hljs.highlightAll() })
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
    const messages = []
    if (system.match(/\S/)) messages.push({ role: 'system', content: system })
    messages.push({ role: 'user', content: question })
    const resp = await srpc.chat(data.user.token, messages, model, 'question')
    $loading = false
    if (!resp.ok) return swal.fire('Error', resp.err, 'error')
    $status.status = 'running'
    swal.fire('Success', 'Task created successfully', 'success')
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <script async defer src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
</svelte:head>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <h1 class="text-2xl font-bold mt-4 px-2">Question</h1>
  <p class="mb-6 px-2">Ask anything!</p>
  <textarea class="w-full p-2 outline-none m-2 rounded block" rows="10" placeholder="Ask any question here!" bind:value={question}></textarea>
  <label class="flex items-center mx-2 my-4">
    <b>System:</b>
    <input bind:value={system} placeholder="Optional System Prompt" class="bg-white outline-none border w-0 px-2 py-1 bg-white ml-2 rounded grow">
  </label>
  <label class="flex items-center mx-2 my-4">
    <b>Model:</b>
    <select class="mx-2 border rounded p-1 outline-none bg-white" bind:value={model}>
      <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
      <option value="gpt-4-1106-preview">GPT 4 Turbo</option>
    </select>
  </label>
  {#if $status.status === 'idle'}
    <button on:click={submit} class="block text-white rounded-full px-6 py-2 m-2 transition-all shadow hover:shadow-md bg-blue-500 font-bold">Submit</button>
  {/if}
  {#if $status.status === 'done'}
    <div class="m-2 p-2 flex items-center flex-wrap">
      <button on:click={pay} class="block text-white rounded-full px-6 py-2 mr-6 transition-all shadow hover:shadow-md bg-orange-500 font-bold">Pay Result</button>
      <AcentLine></AcentLine>
    </div>
  {/if}
  {#if result}
    <div class="mt-6 w-full text-sm p-2 outline-none m-2 rounded block bg-white rounded">
      {@html html}
    </div>
    <p class="m-2 font-mono text-xs text-gray-400">Finish reason: {result.finish_reason}</p>
  {/if}
</div>
<Status></Status>