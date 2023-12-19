
<script setup lang="ts">
const props = defineProps<{teamId?: Number}>()

const events = ref<Array<ScrapedTableEntry>>([])

const fetchTeamData = async () => {
  if (!props.teamId) {
    events.value = []
    return
  }

  events.value = await $fetch(`/api/teams/${props.teamId}`)
}

watch(() => props.teamId, fetchTeamData, {immediate: true})

const headers = [
  { title: 'Datum', key: "date" },
  { title: 'Spieltag', key: "matchDay" },
  { title: 'Heimteam', key: "homeTeam" },
  { title: 'Auswärtsteam', key: "awayTeam" },
  { title: 'Aktion', key: "actions", sortable: false}
]


const formatDate = (dateString) => {
  const date = new Date(dateString)

  return date.toLocaleDateString('de-DE', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',

})  + ' ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <v-data-table :items="events" :headers="headers">
    <template v-slot:item.date="{ item }">
        <div class="text-start">
          <span>{{formatDate(item.date)}}</span>
        </div>
      </template>
    <template v-slot:item.actions="{ item }">
        <div class="text-end">
          <v-btn color="primary" text>Im Kalendar speichern</v-btn>
        </div>
      </template>
  </v-data-table>
</template>