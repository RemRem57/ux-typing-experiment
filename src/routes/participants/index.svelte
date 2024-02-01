<script context="module" lang="ts">
  import { _ } from 'svelte-i18n';
  import { api } from '../../stores';

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
  import { getExperimentsAverage } from '../../components/graphs/utils'

  import type { User } from '../../types'
  import Table from "../../components/TableParticipants/Table.svelte";
  import LocaleSelect from "../../components/LocaleSelect.svelte";
  
  export let users: User[]

  const experiments = users.map(user => user.experiments).flat()
  const experimentsAverage = getExperimentsAverage(experiments)
</script>

<div class="container position-relative">
  <LocaleSelect />
  <h1>{$_('participants.title', { values: { count: users.length.toString() } })}</h1>

  <Table participants={users} />
</div>
