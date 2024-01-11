<script lang="ts">
    import type {User} from "../../types";

    export let participants: User[] = [];
</script>


<div class="participants">
    <h2>Participants</h2>

<!--    Table of all participants with bootstrap style-->

    <table class="table table-striped overflow-auto">
        <thead>
        <tr>
            <th scope="col">Sexe</th>
            <th scope="col">Age</th>
            <th scope="col">Any experience</th>
            <th scope="col">Device</th>
            <th scope="col">Experience grades</th>
            <th scope="col">Experiments</th>
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
                        <th scope="col">Question</th>
                        <th scope="col">Grade</th>
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
                        <th scope="col">Experiment ID</th>
                        <th scope="col">Events</th>
                        <th scope="col">Questions</th>
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
                                    <th scope="col">Type</th>
                                    <th scope="col">Success</th>
                                    <th scope="col">Position</th>
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
                                    <th scope="col">Question</th>
                                    <th scope="col">Grade</th>
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

</style>
