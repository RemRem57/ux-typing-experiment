<script lang="ts">
    import type {User} from ".//src/types";
    import {_} from "svelte-i18n";
    import ExcelJS from "exceljs";

    export let participants: User[] = [];

    // Export excel test
    const exportBtnClick = async () => {
        const data = participants.map((participant) => {
            const experienceGrades = participant.experienceGrades.map((grade) => {
                return {
                    question: grade.ids,
                    grade: grade.grade
                }
            })
            const experiments = participant.experiments.map((experiment) => {
                const events = experiment.events.map((event) => {
                    return {
                        type: event.type,
                        success: event.success,
                        position: event.position,
                        ms: event.ms
                    }
                })
                const questions = experiment.questions.map((question) => {
                    return {
                        question: question.ids,
                        grade: question.grade
                    }
                })
                return {
                    id: experiment.id,
                    events: events,
                    questions: questions
                }
            })
            return {
                sexe: participant.sexe,
                age: participant.age,
                anyExperience: participant.anyExperience,
                device: participant.device,
                experienceGrades: experienceGrades,
                experiments: experiments
            }
        });

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add header
        sheet.addRow([
            'Sexe',
            'Age',
            'Any experience',
            'Device',
            'Experience grades',
            'Experiments'
        ]);

        // Add data
        data.forEach((participant) => {
            const experienceGrades = participant.experienceGrades.map((grade) => {
                return `${grade.ids} : ${grade.grade}`
            })
            const experiments = participant.experiments.map((experiment) => {
                const events = experiment.events.map((event) => {
                    return `${event.type} : ${event.success} : ${event.position} : ${event.ms}`
                })
                const questions = experiment.questions.map((question) => {
                    return `${question.ids} : ${question.grade}`
                })
                return `${experiment.id} : ${events} : ${questions}`
            })
            sheet.addRow([
                participant.sexe,
                participant.age,
                participant.anyExperience,
                participant.device,
                experienceGrades,
                experiments
            ]);
        })

        // Export file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});


        // let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        var url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);

        // Cheat code to download file
        let a = document.createElement("a");
        a.setAttribute("download", `participants.xlsx`);
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
</script>

<div class={`next-btn d-flex justify-content-center my-5`}>
    <button class="btn btn-primary my-auto" on:click={exportBtnClick}>
        <slot>{$_('export all')}</slot>
    </button>
</div>

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
