<script>
  import { AFile } from 'ace.svelte'
  import srpc from '$lib/srpc.js'
  import swal from 'sweetalert2'
  import Status from '$lib/components/Status.svelte'
  import AcentLine from '$lib/components/AcentLine.svelte'
  import { status, balance, getBalance, loading } from '$lib/store.js'
  import { AIcon } from 'ace.svelte'
  import { mdiClose } from '@mdi/js'
  export let data
  let files = []
  let prompt = ''
  let result = ''

  function loadTask (t) {
    if (!t?.ok) return swal.fire('Error', t.err, 'error')
    prompt = t.prompt
    result = t.result
  }

  async function init () {
    $loading = true
    if (!data.user?.token) return
    const status = await srpc.status(data.user.token)
    if (status.type !== 'transcribe') return $loading = false
    loadTask(await srpc.task(data.user.token))
    $loading = false
  }
  init()

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString().replace(/^.*,/, ''))
    reader.onerror = reject
  })

  async function submit () {
    if ($status.status !== 'idle') return
    if (!files?.length) return
    if ($balance < 5) return swal.fire('Insufficient Balance', 'Your Acent balance has to be at least 5', 'error')
    const f = files[0]
    if (f.size > 25 * 1024 * 1024) return
    const file = await toBase64(f)
    const filetype = f.name.replace(/^.*\./, '')
    $loading = true
    const resp = await srpc.transcribe(data.user.token, file, filetype, prompt)
    $loading = false
    if (resp.ok) return swal.fire('Success', 'Task created successfully', 'success')
    swal.fire('Error', resp.err, 'error')
  }

  async function pay () {
    $loading = true
    loadTask(await srpc.task(data.user.token, true))
    $loading = false
    getBalance()
  }
</script>

<Status></Status>
<div class="min-h-screen w-full px-4 sm:px-10 py-10 bg-gray-100">
  <h1 class="text-2xl font-bold mt-4 px-2">Transcribe</h1>
  <p class="mb-6 px-2">Convert audio to subtitles</p>
  <AFile accept=".mp3,.wav,.flac,.m4a" className="border-dashed border-2 border-blue-500 bg-blue-100 rounded w-full flex flex-wrap p-4 my-4 mx-2" bind:files={files}>
    {#each files as f, i}
      <div class="bg-blue-500 text-white flex items-center py-1 px-3 rounded-full">
        {f.name}
        <button class="ml-1" on:click|stopPropagation={() => { files = [] }}><AIcon path={mdiClose} color="white" /></button>
      </div>
    {/each}
    {#if !files?.length}
      <b class="text-blue-500">Select or Drop Audio File</b>
    {/if}
  </AFile>
  <textarea class="w-full p-2 outline-none m-2 rounded block" rows="3" placeholder="You can prompt keywords here to increase transcribe accuracy" bind:value={prompt}></textarea>
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
    <textarea readonly bind:value={result} class="w-full text-sm p-2 outline-none m-2 my-6 rounded block" rows="10"></textarea>
  {/if}
</div>