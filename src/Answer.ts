import marked from 'marked'
import { Question } from './Questions';
import DOMPrurify from 'dompurify'

export class Answer {
  private result: Question
  private body?: string

  constructor(question: Question) {
    this.result = question
    this.body = question.body
    if (!question.answer.startsWith('@')) {
      this.body = question.answer
    }
  }

  async getBody(): Promise<string> {
    if (this.body === undefined) {
      const res = await fetch(`./database/answers/${encodeURI(this.result.answer.slice(1))}.md`)
      this.body = await res.text()
    }
    return this.body
  }

  async format(): Promise<string> {
    if (this.body === undefined) await this.getBody()
    return `<div class="result">
      <h3 class="question-title">${this.result.question}</h3>
      ${Answer.format(this.body!)}
    </div>`
  }

  static format(str: string) {
    return DOMPrurify.sanitize(marked(str))
  }
}
