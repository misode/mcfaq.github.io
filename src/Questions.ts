import * as JsSearch from 'js-search'
import { Body } from './Body'

export type Version = '1.15' | '1.16'

export type Question = {
  tags: string[]
  question: string,
  answer: string,
  body?: string
}

export class Questions {
  private questions: Question[]
  private search: JsSearch.Search

  constructor(questions: Question[]) {
    this.questions = questions
    this.search = new JsSearch.Search('question')
    this.search.indexStrategy = new JsSearch.PrefixIndexStrategy();
    this.search.addIndex('tags')
    this.search.addIndex('question')
    this.search.addDocuments(questions)
  }

  find(query: string): Question[] {
    const fixedQuery = query
      .replace(/\bcheck\b/g, 'detect')
      .replace(/\bdatapack\b/g, 'data pack')
    return this.search.search(fixedQuery) as Question[]
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
