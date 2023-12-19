<script setup lang="ts">
import type { ScrapedTableEntry } from "~/server/scraper";
import { downloadCalendarEvents } from "~/utils/icsCreator";

const props = defineProps<{ teamId?: Number; teamName?: string }>();

const events = ref<Array<ScrapedTableEntry>>([]);

const fetchTeamData = async () => {
  if (!props.teamId) {
    events.value = [];
    return;
  }

  events.value = await $fetch(`/api/teams/${props.teamId}`);
};

watch(() => props.teamId, fetchTeamData, { immediate: true });

const headers = [
  { title: "Datum", key: "date" },
  { title: "Spieltag", key: "matchDay" },
  { title: "Heimteam", key: "homeTeam" },
  { title: "Auswärtsteam", key: "awayTeam" },
  { title: "Aktion", key: "actions", sortable: false },
];

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  return (
    date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  );
};

const onlyFuture = ref<boolean>(false);
useQueryFilter("onlyFuture", onlyFuture);

const location = ref<"all" | "home" | "away">("all");

const locationOptions = [
  { title: "Alle", value: "all" },
  { title: "Heim", value: "home" },
  { title: "Auswärts", value: "away" },
];
useQueryFilter("location", location);

const filteredEvents = computed(() => {
  return events.value
    .filter((event) => {
      if (!onlyFuture.value || !event.date) return true;
      const date = new Date(event.date);
      return date > new Date();
    })
    .filter((event) => {
      if (!location.value || location.value === "all") return true;
      if (location.value === "home") {
        return event.homeTeam === props.teamName;
      } else {
        return event.awayTeam === props.teamName;
      }
    });
});

const downloadSingle = (item: ScrapedTableEntry) => {
  if (!item.date) return;
  downloadCalendarEvents(
    [
      {
        title: `🏒 DEL: ${item.homeTeam} - ${item.awayTeam}`,
        date: new Date(item.date),
        durationMin: 180,
      },
    ],
    `${item.homeTeam} - ${item.awayTeam}`,
    true,
  );
};

const downloadAll = () => {
  downloadCalendarEvents(
    filteredEvents.value
      .filter((i) => i.date)
      .map((event) => ({
        title: `🏒 DEL: ${event.homeTeam} - ${event.awayTeam}`,
        date: new Date(event.date || new Date()),
        durationMin: 180,
      })),
    `DEL Spielplan: ${props.teamName}`,
    true,
  );
};
</script>

<template>
  <v-checkbox v-model="onlyFuture" label="Nur Ausstehende"></v-checkbox>
  <v-select v-model="location" :items="locationOptions" label="Ort"></v-select>
  <v-btn color="primary" @click="downloadAll">Alle im Kalendar speichern</v-btn>
  <v-data-table :items="filteredEvents" :headers="headers">
    <template #[`item.date`]="{ item }">
      <div class="text-start">
        <span>{{ formatDate(item.date?.toString()) }}</span>
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="text-end">
        <v-btn color="primary" @click="downloadSingle(item)"
          >Im Kalendar speichern</v-btn
        >
      </div>
    </template>
  </v-data-table>
</template>
