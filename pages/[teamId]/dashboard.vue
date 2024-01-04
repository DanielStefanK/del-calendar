<script setup lang="ts">
import type { ScrapedTableEntry } from "~/server/scraper";

const route = useRoute();
const events = ref<Array<ScrapedTableEntry>>([]);

const teamId = computed(() => route.params.teamId);

const fetchTeamData = async () => {
  events.value = await $fetch(`/api/teams/${teamId.value}`);
};

onMounted(fetchTeamData);

const nextGame = computed(() => {
  return events.value.find((event) => {
    if (event.date === undefined) return false;
    const date = new Date(event.date);
    return date > new Date();
  });
});

const daysUntil = computed(() => {
  if (!nextGame.value || !nextGame.value.date) return undefined;
  const date = new Date(nextGame.value.date);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 3600 * 24));
});
</script>

<template>
  <v-layout>
    <v-card>
      <v-card-text>
        <h2>{{ daysUntil }} days</h2>
        {{ nextGame?.date }}
      </v-card-text>
    </v-card>
  </v-layout>
</template>
