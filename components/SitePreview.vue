<template>
  <div class="site-preview">
    <div class="site-preview-mobile">
      <div class="site-preview-mobile-notch"></div>
      <div class="site-preview-image-container">
        <div v-if="mobilePending" class="absolute inset-0 flex justify-center items-center text-white bg-black z-[1]">
          <UIcon name="i-mdi-loading" class="animate-spin text-4xl" />
        </div>
        <NuxtImg :src="mobileSrc" alt="Capture mobile" placeholder loading="lazy" @load="mobilePending = false" />
      </div>
    </div>
    <div class="site-preview-desktop">
      <div class="site-preview-desktop-screen"></div>
      <div class="site-preview-desktop-keyboard"></div>
      <div class="site-preview-image-container">
        <div v-if="desktopPending" class="absolute inset-0 flex justify-center items-center text-white bg-black z-[1]">
          <UIcon name="i-mdi-loading" class="animate-spin text-4xl" />
        </div>
        <NuxtImg :src="desktopSrc" alt="Capture desktop" placeholder loading="lazy" @load="desktopPending = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore();
const desktopPending = ref(true);
const desktopSrc = computed(() =>
  API.getProjectThumbnail({
    code: projectStore.projectInfo?.code,
    logIdLast: projectStore.projectInfo?.log_id_last,
    width: 1920,
    height: 2000,
  }),
);
const mobilePending = ref(true);
const mobileSrc = computed(() =>
  API.getProjectThumbnail({
    code: projectStore.projectInfo?.code,
    logIdLast: projectStore.projectInfo?.log_id_last,
    width: 375,
    height: 2000,
  }),
);
</script>

<style scoped>
.site-preview {
  --color-carbon: #393939;
  --border-radius: 8px;
  --border-color: #cfcfcf;
  --border-radius-small: calc(var(--border-radius) / 2);
  --border-radius-inner: 6px;
  --border-width: 2px;
  --background-color: #fff;
  --preview-border-width: 1px;

  pointer-events: none;
  position: relative;
  width: 100%;
  padding-top: 5%;
  padding-bottom: 56.25%;
  min-width: 0;
}

.site-preview .site-preview-mobile,
.site-preview .site-preview-desktop {
  position: absolute;
}

.site-preview .site-preview-desktop {
  top: 0;
  left: 0;
  width: 100%;
  padding: 5%;
  height: 100%;
  box-sizing: border-box;
}

.site-preview .site-preview-desktop .site-preview-image-container {
  width: 100%;
  padding-bottom: calc(56.25% - 2px);
}

.site-preview .site-preview-desktop .site-preview-desktop-screen,
.site-preview .site-preview-desktop .site-preview-desktop-screen::before,
.site-preview .site-preview-desktop .site-preview-desktop-keyboard,
.site-preview .site-preview-desktop .site-preview-desktop-keyboard::before {
  content: '';
  display: block;
  position: absolute;
  background: #222;
}

.site-preview .site-preview-desktop .site-preview-desktop-keyboard {
  background: var(--color-carbon);
  bottom: 2.5%;
  width: 100%;
  border-radius: 4px 4px 20px 20px;
  padding-bottom: 2.5%;
  left: 0;
  border: 0;
  z-index: 1;
}

.site-preview .site-preview-desktop .site-preview-desktop-keyboard::before {
  top: 0;
  width: 20%;
  border-radius: 0 0 10px 10px;
  height: 40%;
  left: 40%;
  border: 0;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.03) 10%,
    rgba(255, 255, 255, 0.03) 90%,
    rgba(255, 255, 255, 0.1) 100%
  );
  z-index: 2;
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.03);
}

.site-preview .site-preview-desktop .site-preview-desktop-screen {
  height: 92%;
  left: 3%;
  top: 3%;
  width: 93.8%;
  border: var(--border-width) solid var(--border-color);
  border-radius: 10px 10px 0 0;
}

.site-preview .site-preview-desktop .site-preview-desktop-screen::before {
  top: 2%;
  width: 1%;
  padding-bottom: 1%;
  border-radius: 50%;
  left: 49%;
  background: rgba(0, 0, 0, 0.5);
}

.site-preview .site-preview-mobile {
  bottom: 0;
  height: auto;
  width: 20%;
  padding: 0.5%;
  border-radius: 8px;
  background: var(--background-color);
  border: var(--border-width) solid var(--border-color);
  z-index: 2;
  right: 0;
}

.site-preview .site-preview-mobile .site-preview-mobile-notch {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--background-color);
  width: 30%;
  height: 1%;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  z-index: 10;
  border: var(--preview-border-width) solid #000;
  border-top: 0;
}

.site-preview .site-preview-mobile .site-preview-image-container {
  width: 100%;
  padding-bottom: calc(177.7777777778% - (var(--preview-border-width) * 2));
}

.site-preview .site-preview-image-container {
  background: #000;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.site-preview .site-preview-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  object-position: top;
  width: 100%;
}
</style>
