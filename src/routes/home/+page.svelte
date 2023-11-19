<script>
  export let data
  if (!data.user) window.location.href = 'https://auth.njsc.ltd/#/launch/ai'
</script>

<p>home</p>
<div>{data.user}</div>
