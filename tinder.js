// ==UserScript==
// @name    dat_filter_tinder
// @grant   none
// @include https://tinder.com/app/recs
// ==/UserScript==

const $ = selector => document.querySelector(selector)

const positiveChecks = {
  dev(desc) {
    return [
      'elixir', 'phoenix', 'javascript', ' vue ', 'rust', 'sql',
      ' git', 'programm', ' dev'
    ].some(substring => desc.includes(substring))
  },
  devops(desc) {
    return ['linux', 'nix', 'k8s', 'bsd'].some(substring => {
      desc.includes(substring)
    })
  },
  microcontrollers(desc) {
    return ['stm32', 'esp32', 'attiny', 'arduino'].some(substring => desc.includes(substring))
  },
  science(desc) {
    return [
      'math', 'chemistry',
      'матем', 'хими'
    ].some(substring => desc.includes(substring))
  },
  feminism(desc) {
    return desc.includes('femin') || desc.includes('фемин')
  },
  atheism(desc) {
    return desc.includes('atheism')
  },
  chill(desc) {
    return ['420', '4:20', '🍄'].some(substring => desc.includes(substring))
  },
  books(desc) {
    return ['blindsight', 'sapolsky'].some(substring => desc.includes(substring))
  }
}

const negativeChecks = {
  magicalThinker(desc) { // https://en.wikipedia.org/wiki/Magical_thinking
    return [
      '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♐', '♑', '♒', '♓',
      'кoзepoг',
      'вoдoлeй',
      'pыбы',
      'oвeн',
      'тeлeц',
      'близнeцы',
      'paк',
      'лeв',
      'дeвa',
      'вecы',
      'cкopпиoн',
      'cтpeлeц',
      'православ', 'christian',
      'астролог', 'эзотерик'
    ].some(substring => desc.includes(substring))
  },
  emptyProfile(desc) {
    return desc.includes('kilometers away') || desc.includes('lives in')
  },
  fraud(desc) {
    return desc.includes('не скупого') ||
      desc.includes('папик') ||
      desc.includes('вирт ') ||
      desc.includes('ищу спонсора') ||
      desc.includes('модель ню') ||
      desc.includes('ищу щедрого') ||
      desc.includes('щедрый') ||
      desc.includes('приветик') ||
      desc.includes('не жадного') ||
      desc.includes('билет в театр') ||
      desc.includes('здесь редко') ||
      desc.includes('здесь не сижу') ||
      desc.includes('тут не сижу') ||
      desc.includes('тут бываю редко')
  },
  kids(desc) {
    return desc.includes('есть сын') ||
      desc.includes('есть дочь') ||
      desc.includes('есть дочка') ||
      desc.includes('есть ребенок') ||
      desc.includes('мама сына')
  },
  'whySoSerious?'(desc) {
    return desc.includes('серь') && desc.includes('отнош') ||
      desc.includes('ищу отношения') ||
      desc.includes('serious relationship')
  },
  genderRoles(desc) {
    return desc.includes('мужчин') || desc.includes('женщин')
  },
  differentGoals(desc) {
    return [
      'любимого', 'ухаживать', 'хочу влюбиться', 'половинку',
      'мужа', 'женат', 'жених',
      'леди'
    ].some(substring => desc.includes(substring))
  }
}

const actions = {
  nope(reason, description) {
    const dislikeButton = $('[aria-label="Nope"]')
    if (!dislikeButton) {
      return
    }

    console.log(`[NOPE: ${reason}]`, description)
    dislikeButton.click()
    setTimeout(filter.call, 1000)
  },
  yes(reason, description) {
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) {
      return
    }

    console.log(`[YES: ${reason}]`, description)
    likeButton.click()
    setTimeout(filter.call, 1000)
  }
}

const filter = {
  delay(extraDelay = 0) {
    return Math.ceil(Math.random() * 1000 + 500 + extraDelay)
  },

  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  },
  appendDescription() {
    const existedDescNode = document.querySelector('#description')
    if (existedDescNode) {return existedDescNode}

    const descNode = document.createElement('div')
    descNode.id = 'description'
    descNode.style.position = 'absolute'
    descNode.style.background = '#fff'
    descNode.style.left = '10px'
    descNode.style.top = '500px'
    descNode.style.width = '320px'
    document.body.appendChild(descNode)

    return descNode
  },
  fetchDescription() {
    const descriptionNode = filter.getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[3]/div/div[2]/div/div[2]')

    if (descriptionNode) {
      const description = descriptionNode.innerText
      window.d = description

      filter.appendDescription()
      document.querySelector('#description').innerText = description

      return description
    }
  },

  call() {
    const rawDescription = filter.fetchDescription() || ''

    const desc = rawDescription.toLowerCase()

    const nothingNegative = Object.keys(positiveChecks).every(positiveCheck => {
      if (positiveChecks[positiveCheck](desc)) {
        actions.yes(positiveCheck, rawDescription)
        return false
      }
      return true
    })
    if (!nothingNegative) {return }

    const nothingPositive = Object.keys(negativeChecks).every(negativeCheck => {
      if (negativeChecks[negativeCheck](desc)) {
        actions.nope(negativeCheck, rawDescription)
        return false
      }
      return true
    })
    if (!nothingPositive) {return }

    console.log('?', `\n\n${rawDescription}\n\n`)
    window.reloadTimer = setTimeout(() => {
      console.log('🤖 Your turn human')
      location.reload()
    }, filter.delay(120000))
  }
}

window.addEventListener('load', () => {
  setTimeout(filter.call, filter.delay(5000))

  $('.recsCardboard').style.maxWidth = '640px'
  $('.recsCardboard').style.height = '900px'
}, false)

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
    clearTimeout(window.reloadTimer)
  }
})

