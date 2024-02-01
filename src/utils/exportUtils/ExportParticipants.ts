import type { User } from '../../types'

export abstract class ExportParticipants {
  protected data: {
    sexe: User['sexe']
    age: User['age']
    anyExperience: User['anyExperience']
    device: User['device']
    experienceGrades: {
      question: string
      grade: number
    }[]
    experiments: {
      id: string
      events: {
        type: string
        success: boolean
        position: number
        ms: number
      }[]
      questions: {
        question: string
        grade: number
      }[]
    }[]
  }[];

  protected constructor(participants: User[]) {
    this.data = participants.map((participant) => {
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
    })
  }

  protected abstract exportToBlob(): Promise<Blob>;

  protected abstract getFileExtension(): string;
}
