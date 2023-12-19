<script setup lang="ts">
const { data: teams, error, pending } = await useFetch("/api/teams");
const selectedTeamsId = ref<
  | {
      id: number;
      name: string;
    }
  | undefined
>();

const teamId = computed({
  get: () => selectedTeamsId.value?.id,
  set: (value) => {
    selectedTeamsId.value = teams.value?.find((team) => team.id === value);
  },
});

useQueryFilter("teamId", teamId);
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
        return-object
        item-title="name"
        item-value="id"
      ></v-select>
    </v-card-title>
    <v-card-text>
      <games-list
        :team-id="selectedTeamsId?.id"
        :team-name="selectedTeamsId?.name"
      />
    </v-card-text>
  </v-card>
</template>
