<script setup lang="ts">
defineProps<{
  msg: String
}>();
</script>

<template>
  <div id="blabla">Text from component: [{{msg}}]</div>
  <hr/>
  <marquee>Woooooooooooooooooohoooooooooooooooo!!!!!!!!!!!!!!</marquee>
</template>

<style>
#blabla {
  color: #E5861A;
  background-color: #1A79E5;
  padding: 0.5rem 1.5rem;
  width: 100%;
  font-size: 1.2rem;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
}
marquee {
    background: pink;
}
</style>
