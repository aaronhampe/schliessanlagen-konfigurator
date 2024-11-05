<template>
    <!-- <NewConfigurator :isSchliessanlage="$route.query.isSchliessanlage === 'true'" /> -->
    <!-- <ConfiguratorView :isSchliessanlage="true" /> -->
    <CompAPI :isSchliessanlage="true" />
    
</template>
  

<script setup>
import CompAPI from '~/components/compAPI.vue';

</script>