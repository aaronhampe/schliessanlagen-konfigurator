<template>
  <div>
    <pre>{{ data.test[0].ID}}</pre>
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
