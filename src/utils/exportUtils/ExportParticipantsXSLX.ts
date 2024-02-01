import { ExportParticipants } from './ExportParticipants'
import type { User } from '../../types'
import ExcelJS from 'exceljs'
import { getExperienceIds } from '../utils'

export class ExportParticipantsXSLX extends ExportParticipants {
  private readonly FILE_EXTENSION = 'xlsx'

  private workbook: ExcelJS.Workbook

  public constructor(participants: User[]) {
    super(participants)

    // Create workbook
    this.workbook = new ExcelJS.Workbook()
    const sheet = this.workbook.addWorksheet('Participants')
    const sheetExperiments: { [key: string]: ExcelJS.Worksheet } = {}
    const experimentIds = getExperienceIds()
    experimentIds.forEach((id) => {
      sheetExperiments[id] = this.workbook.addWorksheet(`Experiment ${id}`)
      sheetExperiments[id].addRow([
        'ID_USER',
        'Error count',
        'Total time',
        'Unpleasant / pleasant',
        'Not practical / practical',
        'Not nice / nice',
        'Tedious / effective'
      ])
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
      'Motivating / discouraging'
    ])

    // Add data
    this.data.forEach((participant, index) => {
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
        experienceGrades[5]
      ])

      participant.experiments.forEach((experiement) => {
        const experimentSheet = sheetExperiments[experiement.id]
        experimentSheet.addRow([
          index,
          experiement.events.reduce((acc, event) => acc + (event.success ? 0 : 1), 0),
          experiement.events[experiement.events.length - 1]?.ms,
          experiement.questions[0].grade,
          experiement.questions[1].grade,
          experiement.questions[2].grade,
          experiement.questions[3].grade
        ])
      })
    })
  }

  public async exportToBlob(): Promise<Blob> {
    const buffer = await this.workbook.xlsx.writeBuffer()
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  public getFileExtension(): string {
    return this.FILE_EXTENSION
  }
}
