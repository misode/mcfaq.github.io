import { Questions } from './Questions'
import { Answer } from './Answer'

const contentDiv = document.getElementById('content')!
const searchBar = document.getElementById('search-bar')!
const searchInput = (document.getElementById('search-input') as HTMLInputElement)
const searchSubmit = document.getElementById('search-submit')!
const searchResults = document.getElementById('search-results')!

fetch('./database/questions.json')
  .then(r => r.json())
  .then(r => {
    const questions = new Questions(r.questions)

    const showAnswer = (title: string) => {
      contentDiv.setAttribute('data-mode', 'answer')
      const result = questions.from(title)
      if (result === undefined) {
        searchResults.innerHTML = `<p>Question not found...</p>`
      } else {
        searchResults.innerHTML = ''
        new Answer(result).format().then(r => {
          searchResults.innerHTML = r
        })
      }
    }

    const showSearch = (query: string) => {
      contentDiv.setAttribute('data-mode', 'search')
      const results = questions.search(query)
      searchResults.innerHTML = ''
      Promise.all(results.map(questions.formatResult)).then(r => {
        searchResults.innerHTML = r.join('')
        document.querySelectorAll('.question-title').forEach(el => {
          el.addEventListener('click', evt => {
            reload(`./?a=${el.getAttribute('data-answer')}`)
          })
        })
      })
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

    const reload = (target?: string) => {
      if (target) {
        history.pushState(undefined, 'Change Page', target)
      }
      const params = new URLSearchParams(location.search)
      if (params.has('a')) {
        showAnswer(decodeURI(params.get('a')!))
      }
      if (params.has('q')) {
        console.log("aaaa")
        searchInput.value = decodeURI(params.get('q')!)
        showSearch(decodeURI(params.get('q')!))
      }
    }
    reload()
    window.onpopstate = (evt: PopStateEvent) => {
      reload()
    }
  })
