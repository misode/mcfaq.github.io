import { Questions } from './Questions'
import { Body } from './Body'

const contentDiv = document.getElementById('content')!
const searchInput = (document.getElementById('search-input') as HTMLInputElement)
const searchSubmit = document.getElementById('search-submit')!
const messageDiv = document.getElementById('message')!
const searchResults = document.getElementById('search-results')!
const themeToggle = document.getElementById('theme-toggle')!

fetch('./database/questions.json')
  .then(r => r.json())
  .then(r => {
    const questions = new Questions(r.questions)

    const showMessage = (...message: string[]) => {
      messageDiv.style.display = 'flex';
      messageDiv.innerHTML = message.map(m => Body.format(m)).join('')
    }

    const replaceAnswerLinks = () => {
      document.querySelectorAll('[data-answer]').forEach(el => {
        el.addEventListener('click', evt => {
          window.scrollTo(0, 0);
          reload(`./?a=${el.getAttribute('data-answer')}`)
          evt.preventDefault()
        })
      })
    }

    const showAnswer = (title: string) => {
      contentDiv.setAttribute('data-mode', 'answer')
      const result = questions.from(title)
      document.title = result?.question + ' | MCCQ'
      if (result === undefined) {
        showMessage(`We couldn't find that question. Try one of these similar ones.`)
        showSearch(title)
      } else {
        searchResults.innerHTML = ''
        Body.answer(result).then(r => {
          searchResults.innerHTML = r
          replaceAnswerLinks();
        })
      }
    }

    const showSearch = (query: string) => {
      contentDiv.setAttribute('data-mode', 'search')
      const results = questions.find(query)
      searchResults.innerHTML = ''
      if (results.length === 0) {
        showMessage(`We couldn't find any results for '${query}'.`, `Try other search terms or more general keywords.`, `<br>`, `If you need more help you can ask on the [Minecraft Commands Discord](https://discord.gg/QAFXFtZ).`)
      } else {
        Promise.all(results.map(Questions.formatResult)).then(r => {
          searchResults.innerHTML = r.join('')
          replaceAnswerLinks();
        })
      }
    }

    const onSearch = () => {
      const query = encodeURI(searchInput.value)
      reload(`./?q=${query}`)
    }

    searchInput.addEventListener('keyup', evt => {
      if (evt.which === 13) onSearch()
    })
    searchSubmit.addEventListener('click', evt => {
      onSearch()
    })

    themeToggle.addEventListener('click', evt => {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      }
    })
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    const reload = (target?: string) => {
      messageDiv.style.display = 'none';
      if (target) {
        history.pushState(undefined, 'Change Page', target)
      }
      const params = new URLSearchParams(location.search)
      if (params.has('a')) {
        showAnswer(decodeURI(params.get('a')!))
      }
      if (params.has('q')) {
        document.title = 'Search | MCCQ'
        searchInput.value = decodeURI(params.get('q')!)
        showSearch(decodeURI(params.get('q')!))
      }
      if (!params.has('a') && !params.has('q')) {
        document.title = 'Minecraft Commands Questions | MCCQ'
        searchResults.innerHTML = ''
      }
    }
    reload()
    window.onpopstate = (evt: PopStateEvent) => {
      reload()
    }
  })
