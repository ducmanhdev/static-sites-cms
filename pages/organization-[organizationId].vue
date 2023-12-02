<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import mqtt from 'mqtt';

const route = useRoute();
const toast = useToast();

definePageMeta({
  middleware: [
    (to) => {
      if (to.name === 'organization-organizationId') {
        return navigateTo({
          name: 'organization-organizationId-projects',
          params: {
            organizationId: to.params.organizationId,
          },
        });
      }
    },
  ],
});

const connection = {
  host: '192.168.1.109',
  port: 8083,
  endpoint: '/mqtt',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  // Certification Information
  clientId: Math.random() + '',
  username: '',
  password: '',
};
const { host, port, endpoint, ...options } = connection;
const connectUrl = `ws://${host}:${port}${endpoint}`;
const mqttClient = mqtt.connect(connectUrl, options);

const handleSubscribeMQTT = () => {
  try {
    handleUnsubscribeMQTT();
    mqttClient.subscribe(mqttSubscribeTopic.value, { qos: 1 }, (error, res) => {
      if (error) throw error;
      console.log('MQTT: Subscribe mqtt success', res);
    });
  } catch (error) {
    console.log('MQTT: Subscribe mqtt error: ', error);
  }
};
const handleUnsubscribeMQTT = () => {
  try {
    mqttClient.unsubscribe(mqttSubscribeTopic.value);
  } catch (err) {
    console.log('MQTT: Unsubscribe error', err);
  }
};
provide('mqttClient', mqttClient);
onUnmounted(() => {
  handleUnsubscribeMQTT();
});

const organizationStore = useOrganizationStore();
const organizationInfo = ref<any>(null);
const mqttSubscribeTopic = computed(() => `newzen_cloud/${organizationInfo.value?.mqtt_key}/update`);
const isGetOrganizationInfoLoading = ref(false);
const handleGetOrganizationInfo = async () => {
  try {
    organizationStore.clearOrganizationInfo();
    organizationInfo.value = null;
    isGetOrganizationInfoLoading.value = true;
    const res: any = await API.viewOrganization({ id: Number(route.params.organizationId) });
    if (!res.data.organization) {
      throw new Error('Organization not found');
    }
    organizationInfo.value = res.data.organization;
    organizationStore.setOrganizationInfo(organizationInfo.value);
    handleSubscribeMQTT();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
    navigateTo('/', {
      replace: true,
    });
  } finally {
    isGetOrganizationInfoLoading.value = false;
  }
};
handleGetOrganizationInfo();
</script>

<style scoped></style>
