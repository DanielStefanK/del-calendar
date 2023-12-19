<script setup lang="ts">
const { data: teams, error, pending } = await useFetch("/api/teams");
const selectedTeamsId = ref<number | undefined>();
</script>

<template>
  <v-card variant="flat">
    <v-overlay v-model="pending" contained>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-alert v-if="error" type="error">Error: {{ error }}</v-alert>

    <v-card-title>
      <v-select
        v-if="teams"
        v-model="selectedTeamsId"
        :items="teams"
        item-title="name"
        item-value="id"
      ></v-select>
    </v-card-title>
    <v-card-text>
      <games-list :team-id="selectedTeamsId" />
    </v-card-text>
  </v-card>
</template>
