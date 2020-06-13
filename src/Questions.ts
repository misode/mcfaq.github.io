import Fuse from 'fuse.js'
import { Answer } from './Answer'

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
        { name: 'keywords', weight: 1 },
        { name: 'question', weight: 0.2 },
      ],
      minMatchCharLength: 3,
      threshold: 0.6
    })
  }

  search(query: string): Question[] {
    return this.fuse.search(query).map(r => r.item)
  }

  from(query: string): Question | undefined {
    const fromAnswer = this.questions.filter(r => r.answer === `@${query}`)[0]
    if (fromAnswer !== undefined) return fromAnswer
    return this.fromTitle(query)
  }

  fromTitle(title: string): Question | undefined {
    return this.questions.filter(r => r.question === title)[0]
  }

  async formatResult(r: Question): Promise<string> {
    r.body = await new Answer(r).getPreview()
    const id = r.answer.startsWith('@') ? r.answer.slice(1) : r.question
    return `<div class="result">
      <h3 class="question-title" data-answer="${encodeURI(id)}">${r.question}</h3>
      ${r.body}
    </div>`
  }
}
