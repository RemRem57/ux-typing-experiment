<script context="module" lang="ts">
  /* eslint-disable no-multiple-empty-lines */
  import { api } from '../../stores/api'

  export async function load() {
    const users = await api.getAllUsers()

    return {
      props: {
        users
      }
    }
  }
</script>
<script lang="ts">
  import SexeRepartition from '../../components/graphs/SexeRepartition.svelte'
  import AgeRepartition from '../../components/graphs/AgeRepartition.svelte'
  import ErrorPerChunksCount from '../../components/graphs/ErrorPerChunksCount.svelte'
  import DeleteUpdatePerChunksCount from '../../components/graphs/DeleteUpdatePerChunksCount.svelte'
  import DevicesRepartition from '../../components/graphs/DevicesRepartition.svelte'

  import { getExperimentsAverage } from '../../components/graphs/utils'

  import type { User } from '../../types'
  import DurationPerChunks from '../../components/graphs/DurationPerChunks.svelte'
  import Table from "../../components/TableParticipants/Table.svelte";
  
  export let users: User[]

  const experiments = users.map(user => user.experiments).flat()
  const experimentsAverage = getExperimentsAverage(experiments)
</script>

<div class="container position-relative">
  <h1>Table of <b>{users.length}</b> participants:</h1>
  <!--{#each users as user, i}-->
  <!--    <p>{i}</p>-->
  <!--    <p>{ JSON.stringify(user) }</p>-->
  <!--{/each}-->

  <Table participants={users} />

</div>
