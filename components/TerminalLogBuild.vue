<template>
  <div
    ref="el"
    class="bg-gray-800 text-white rounded-lg p-6 h-[60vh] overflow-auto text-sm font-[Inconsolata] space-y-1 whitespace-pre-wrap"
  ></div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore();

const el = ref();
watchEffect(() => {
  if (!el.value) return;
  projectStore.buildLog.split('\n').forEach((lineStr) => {
    lineStr = lineStr.replaceAll('</br>', '');
    if (!lineStr) return;
    const div = document.createElement('DIV');
    div.classList.add('p-1', 'bg-[rgba(21,209,215,0.08)]');
    if (lineStr.startsWith('> ')) {
      div.classList.add('font-bold', 'text-primary', 'bg-[rgba(21,209,215,0.2)]');
    }
    // lineStr = lineStr
    //   .replaceAll('ℹ', '<span class="text-yellow-400">ℹ</span>')
    //   .replaceAll('WARN', '<span class="bg-yellow-400 text-black p-1">WARN</span>')
    div.textContent = lineStr;
    el.value.appendChild(div);
  });
  el.value.scroll({
    top: el.value.scrollHeight,
  });
});
</script>

<style scoped></style>
