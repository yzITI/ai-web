<script>
  import { AFile } from 'ace.svelte'
  import srpc from '$lib/srpc.js'
  import Status from '$lib/components/Status.svelte'
  export let data
  window.srpc = srpc
  let files = null
  let prompt = ''

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString().replace(/^.*,/, ''))
    reader.onerror = reject
  })

  async function submit () {
    if (!files?.length) return
    const f = files[0]
    if (f.size > 25 * 1024 * 1024) return
    const file = await toBase64(f)
    const filetype = f.name.replace(/^.*\./, '')
    const resp = await srpc.transcribe(data.user.token, file, filetype, prompt)
    console.log(resp)
  }
</script>

<Status></Status>
<div class="min-h-screen w-full px-4 sm:px-10 py-10 bg-gray-100 flex flex-col items-center">
  <h1 class="text-2xl p-4">Choose your audio file</h1>
  <AFile accept=".mp3,.wav,.flac,.m4a" className="w-64 p-4" bind:files={files}>Select File</AFile>
  <textarea class="w-64 m-2 rounded text-sm" placeholder="Type your instructions" bind:value={prompt}></textarea>
  <button on:click={submit} class="text-gray-700 rounded-full p-2 m-2 transition-all shadow hover:shadow-md bg-white">Submit</button>
</div>