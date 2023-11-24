<script>
  import { AFile } from 'ace.svelte'
  import srpc from '$lib/srpc.js'
  import swal from 'sweetalert2'
  import Status from '$lib/components/Status.svelte'
  import AcentLine from '$lib/components/AcentLine.svelte'
  import languages from '$lib/utilities/languages.json'
  import { status, balance, getBalance, loading } from '$lib/store.js'
  import { AIcon } from 'ace.svelte'
  import { mdiClose } from '@mdi/js'
  export let data
  let files = []
  let prompt = '', language = '', format = 'srt'
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
    if (status.label !== 'transcribe') return $loading = false
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
    result = ''
    if ($status.status !== 'idle') return
    if (!files?.length) return
    if ($balance < 5) return swal.fire('Insufficient Balance', 'Your Acent balance has to be at least 5', 'error')
    const f = files[0]
    if (f.size > 25 * 1024 * 1024) return
    const file = await toBase64(f)
    const filetype = f.name.replace(/^.*\./, '')
    $loading = true
    const resp = await srpc.transcribe(data.user.token, file, filetype, prompt, language, format)
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

  async function download () {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.style = 'visibility: hidden;'
    link.download = 'transcribe.' + format.replace(/.*?_/, '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  window.download = r => {
    result = r
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
  <label class="flex items-center mx-2 my-4">
    <b>Language:</b>
    <select class="mx-2 border rounded p-1 outline-none" bind:value={language}>
      <option value="">Auto Detect</option>
      {#each Object.keys(languages) as l}
        <option value={l}>{languages[l]}</option>
      {/each}
    </select>
  </label>
  <label class="flex items-center mx-2 my-4">
    <b>Format:</b>
    <select class="mx-2 border rounded p-1 outline-none" bind:value={format}>
      <option>json</option>
      <option>text</option>
      <option>srt</option>
      <option>verbose_json</option>
      <option>vtt</option>
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
    <button class="text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow hover:shadow-md transition-all mx-2 mt-4" on:click={download}>Download transcribe.{format.replace(/.*?_/, '')}</button>
    <textarea readonly bind:value={result} class="w-full text-sm p-2 outline-none m-2 rounded block" rows="10"></textarea>
  {/if}
</div>