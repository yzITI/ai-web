<script>
  const allowType = new Set(".mp3", ".wma", ".wav", ".amr")
  function checkfile(filename) {
    const sufix = filename.substr(filename.lastIndexOf(".")).toLowerCase()
    if(allowType.has(sufix)) return true
  }
  function Submit () {
    
  }
</script>

<div class="min-h-screen w-full px-4 sm:px-10 py-10 bg-gray-100 flex flex-col items-center">
  <h1 class="text-2xl p-4">Choose your audio file</h1>
  <input type="file" class="w-64 p-4">
  <textarea class="w-64 m-2 rounded text-sm" placeholder="Type your instructions"></textarea>
  <button on:click={Submit} class="text-gray-700 rounded-full p-2 m-2 transition-all shadow hover:shadow-md bg-white">Submit</button>
</div>