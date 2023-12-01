<template>
  <div class="text-center flex flex-col justify-center items-center p-6">
    <div class="loader bg-primary"></div>
    <p v-if="title" class="text-lg font-medium mt-2">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

<style scoped>
.loader {
  width: 40px;
  padding: 4px;
  aspect-ratio: 1;
  border-radius: 50%;
  //background: #000;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
