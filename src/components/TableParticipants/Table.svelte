<script lang="ts">
    import type {User, Event} from "../../types";
    import {_} from "svelte-i18n";
    import ExcelJS from "exceljs";
    import type {ExperimentID} from "../../types";
    import {getExperienceIds} from "../../utils";

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
        const sheet = workbook.addWorksheet('Participants');
        const sheetExperiments: { [key: string]: ExcelJS.Worksheet } = {};
        const experimentIds = getExperienceIds();
        experimentIds.forEach((id) => {
            sheetExperiments[id] = workbook.addWorksheet(`Experiment ${id}`);
            // TODO : add some calculations
            sheetExperiments[id].addRow([
                'ID_USER',
                'Error count',
                'Total time',
                'Simultaneous typing characters',
                'Unpleasant / pleasant',
                'Not practical / practical',
                'Not nice / nice',
                'Tedious / effective',
            ]);
        })

        // Add header
        sheet.addRow([
            'ID',
            'Sexe',
            'Age',
            'Any experience (0-6)',
            'Device',
            'Unpleasant / pleasant',
            'Simple / complicated',
            'Practical / not practical',
            'Tedious / effective',
            'Good / bad',
            'Motivating / discouraging',
        ]);

        // Add data
        data.forEach((participant, index) => {
            const experienceGrades = participant.experienceGrades.map((grade) => {
                return grade.grade
            })
            sheet.addRow([
                index,
                participant.sexe,
                participant.age,
                participant.anyExperience,
                participant.device,
                experienceGrades[0],
                experienceGrades[1],
                experienceGrades[2],
                experienceGrades[3],
                experienceGrades[4],
                experienceGrades[5],
            ]);

            participant.experiments.forEach((experiement) => {
                const experimentSheet = sheetExperiments[experiement.id];
                experiement.events
                experimentSheet.addRow([
                    index,
                    experiement.events.reduce((acc, event) => acc + (event.success ? 0 : 1), 0),
                    experiement.events[experiement.events.length - 1]?.ms,
                    findCharactersInARow(experiement.events),
                    experiement.questions[0].grade,
                    experiement.questions[1].grade,
                    experiement.questions[2].grade,
                    experiement.questions[3].grade,
                ]);
            })
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

    // Fonction pour calculer la moyenne d'un tableau de nombres
    const calculateMean = (array: number[]): number => {
        return array.reduce((sum, value) => sum + value, 0) / array.length;
    };

    // Fonction pour calculer l'écart-type d'un tableau de nombres
    const calculateStandardDeviation = (array: number[]): number => {
        const mean = calculateMean(array);
        const squaredDifferences = array.map(value => Math.pow(value - mean, 2));
        const variance = calculateMean(squaredDifferences);
        return Math.sqrt(variance);
    };

    // Fonction pour trouver le nombre de caractères saisis à la suite en utilisant l'écart-type comme seuil
    const findCharactersInARow = (events: Event[]): number => {
        const msThreshold = calculateStandardDeviation(events.map(event => event.ms)) * 2; // Vous pouvez ajuster le multiplicateur si nécessaire
        let charactersInARow = 0;

        for (let i = 1; i < events.length; i++) {
            const timeDifference = events[i].ms - events[i - 1].ms;

            if (timeDifference <= msThreshold) {
                charactersInARow++;
            } else {
                // Réinitialiser le compteur si la différence de temps dépasse le seuil
                charactersInARow = 0;
            }
        }

        return charactersInARow;
    };
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
