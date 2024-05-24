<template>
  <div>
    <pre>{{ data.test[0].Name }}</pre>
    <div >{{ data.test[0] }}</div>
  </div>
</template>

<script setup>

//async function submit() {
  const { data } = await useFetch('/api/sql', {
    method: 'post',
    body: { ID: 12345 }
  })
//}

</script>