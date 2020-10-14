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

    const showAnswer = (title: string) => {
      contentDiv.setAttribute('data-mode', 'answer')
      const result = questions.from(title)
      if (result === undefined) {
        showMessage(`We couldn't find that question. Try one of these similar ones.`)
        showSearch(title)
      } else {
        searchResults.innerHTML = ''
        Body.answer(result).then(r => {
          searchResults.innerHTML = r
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
          document.querySelectorAll('[data-answer]').forEach(el => {
            el.addEventListener('click', evt => {
              window.scrollTo(0, 0);
              reload(`./?a=${el.getAttribute('data-answer')}`)
              evt.preventDefault()
            })
          })
        })
      }
    }

    const onSearch = () => {
      const query = encodeURI(searchInput.value)
      if (query.length > 0) {
        reload(`./?q=${query}`)
      } else {
        reload('./')
      }
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
        searchInput.value = decodeURI(params.get('q')!)
        showSearch(decodeURI(params.get('q')!))
      }
      if (!params.has('a') && !params.has('q')) {
        searchResults.innerHTML = ''
      }
    }
    reload()
    window.onpopstate = (evt: PopStateEvent) => {
      reload()
    }
  })
