import Fuse from 'fuse.js'
import { Body } from './Body'

export type Version = '1.15' | '1.16'

export type Question = {
  keywords: string[]
  version: Version,
  question: string,
  answer: string,
  body?: string
}

export class Questions {
  private questions: Question[]
  private fuse: Fuse<Question, Fuse.IFuseOptions<Question>>

  constructor(questions: Question[]) {
    this.questions = questions
    this.fuse = new Fuse(questions, {
      keys: [
        { name: 'tags', weight: 1 },
        { name: 'question', weight: 0.2 },
      ],
      minMatchCharLength: 3,
      threshold: 0.6
    })
  }

  search(query: string): Question[] {
    const fixedQuery = query
      .replace(/\bcheck\b/g, 'detect')
    return this.fuse.search(fixedQuery).map(r => r.item)
  }

  from(query: string): Question | undefined {
    const fromAnswer = this.questions.filter(r => r.answer === `@${query}`)[0]
    if (fromAnswer !== undefined) return fromAnswer
    return this.fromTitle(query)
  }

  fromTitle(title: string): Question | undefined {
    return this.questions.filter(r => r.question === title)[0]
  }

  static async formatResult(r: Question): Promise<string> {
    return Body.answer(r, true)
  }
}
