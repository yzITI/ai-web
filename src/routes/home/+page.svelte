<script>
  import Status from '$lib/components/Status.svelte'
  export let data
</script>

<p>home</p>
<div>{data.user?.name}</div>
<Status></Status>
