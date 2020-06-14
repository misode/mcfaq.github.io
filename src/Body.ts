import marked from 'marked'
import DOMPrurify from 'dompurify'
import { Question } from './Questions'

export const Body = {
  async fetch(location: string): Promise<string> {
    const res = await fetch(`./database/${location}.md`)
    return await res.text()
  },

  async get(r: Question): Promise<string> {
    if (r.body === undefined) {
      if (r.answer.startsWith('@')) {
        r.body = await Body.fetch(`answers/${encodeURI(r.answer.slice(1))}`)
      } else {
        r.body = r.answer
      }
    }
    return r.body
  },

  sanitize(str: string): string {
    return DOMPrurify.sanitize(str)
  },

  format(str: string): string {
    return Body.sanitize(marked(str))
  },

  async answer(r: Question, preview = false): Promise<string> {
    const body = await this.get(r)
    const lines = body.split('\n')
    const id = r.answer.startsWith('@') ? r.answer.slice(1) : r.question
    return `<div class="result">
      <h3 class="question-title" data-answer="${encodeURI(id)}">
        ${Body.sanitize(r.question)}
      </h3>
      ${this.format(preview ? lines[0] : body)}
      ${preview && lines.length > 1 && lines[1].length > 0 ? `<span class="more">(more)</span>` : ''}
    </div>`
  }
}
