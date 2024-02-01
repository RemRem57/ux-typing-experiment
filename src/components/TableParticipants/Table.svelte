<script lang="ts">
    import type { User, Event } from '../../types'
    import { _ } from 'svelte-i18n'
    import { downloadBlob } from '../../utils/utils'
    import { ExportParticipantsXSLX } from '../../utils/exportUtils/ExportParticipantsXSLX'

    export let participants: User[] = []

    const exportBtnClick = async () => {
      const exportClass = new ExportParticipantsXSLX(participants)

      const date = new Date().toLocaleDateString().replace(/\//g, '_')
      const fileName = `Participants_${date}`
      downloadBlob(exportClass.exportToBlob(), fileName, exportClass.getFileExtension())
    }
</script>


<div class="participants">
    <button class="btn btn-primary mx-auto " on:click={exportBtnClick}>
        <slot>{$_('participants.table.export')}</slot>
    </button>
    <table class="table table-striped overflow-auto">
        <thead>
        <tr>
            <th scope="col">{$_('participants.table.sexe')}</th>
            <th scope="col">{$_('participants.table.age')}</th>
            <th scope="col">{$_('participants.table.anyExp')}</th>
            <th scope="col">{$_('participants.table.device')}</th>
            <th scope="col">{$_('participants.table.expGrade')}</th>
            <th scope="col">{$_('participants.table.experiments')}</th>
        </tr>
        </thead>
        <tbody>
        {#each participants as participant}
        <tr>
            <td>{participant.sexe}</td>
            <td>{participant.age}</td>
            <td>{participant.anyExperience}</td>
            <td>{participant.device}</td>
            <td>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">{$_('participants.table.question')}</th>
                        <th scope="col">{$_('participants.table.grade')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each participant.experienceGrades as grade}
                    <tr>
                        <td>{grade.ids}</td>
                        <td>{grade.grade}</td>
                    </tr>
                    {/each}
                    </tbody>
                </table>
            </td>
            <td>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">{$_('participants.table.expId')}</th>
                        <th scope="col">{$_('participants.table.events')}</th>
                        <th scope="col">{$_('participants.table.questions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each participant.experiments as experiment}
                    <tr>
                        <td>{experiment.id}</td>
                        <td>
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">{$_('participants.table.type')}</th>
                                    <th scope="col">{$_('participants.table.success')}</th>
                                    <th scope="col">{$_('participants.table.position')}</th>
                                    <th scope="col">Ms</th>
                                </tr>
                                </thead>
                                <tbody>
                                {#each experiment.events as event}
                                <tr>
                                    <td>{event.type}</td>
                                    <td>{event.success}</td>
                                    <td>{event.position}</td>
                                    <td>{event.ms}</td>
                                </tr>
                                {/each}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">{$_('participants.table.question')}</th>
                                    <th scope="col">{$_('participants.table.grade')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {#each experiment.questions as question}
                                <tr>
                                    <td>{question.ids}</td>
                                    <td>{question.grade}</td>
                                </tr>
                                {/each}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    {/each}
                    </tbody>
                </table>
            </td>
        </tr>
        {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .participants {
      display: flex;
      flex-direction: column;
        align-items: center;
    }
</style>
