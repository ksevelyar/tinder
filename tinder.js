// ==UserScript==
// @name    dat_filter_tinder
// @grant   none
// @include https://tinder.com/app/recs
// ==/UserScript==

const $ = selector => document.querySelector(selector)

const positiveChecks = {
  dev(desc) {
    return [
      'elixir', 'phoenix', 'javascript', 'vue', 'rust', 'sql',
      'git', 'github',
      'programmist', 'programmer', 'dev'
    ].some(substring => {
      desc.includes(substring)
    })
  },
  devops(desc) {
    return ['linux', 'nix', 'k8s', 'bsd'].some(substring => {
      desc.includes(substring)
    })
  },
  microcontrollers(desc) {
    return ['stm', 'esp', 'attiny', 'arm', 'arduino'].some(substring => {
      desc.includes(substring)
    })
  },
  science(desc) {
    return desc.includes('math') || desc.includes('chemistry')
  },
  feminism(desc) {
    return desc.includes('femin') || desc.includes('фемин')
  },
  atheism(desc) {
    return desc.includes('atheism')
  },
  chill(desc) {
    return ['420', '4:20', '🍄'].some(substring => {
      desc.includes(substring)
    })
  }
}

const negativeChecks = {
  magicalThinker(desc) { // https://en.wikipedia.org/wiki/Magical_thinking
    return [
      '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♐', '♑', '♒', '♓',
      'koзepoг',
      'вoдoлeй',
      'pыбы',
      'oвeн',
      'teлeц',
      'близнeцы',
      'pak',
      'лeв',
      'дeвa',
      'вecы',
      'ckopпиoн',
      'cтpeлeц',
      'православ'
    ].some(substring => {
      desc.includes(substring)
    })
  },
  emptyProfile(desc) {
    return desc.length < 5 ||
      desc.includes('kilometers away') ||
      desc.includes('lives in') ||
      desc.includes('inst', 'инст') && desc.length < 42
  },
  fraud(desc) {
    return desc.includes('не скупого') ||
      desc.includes('ищу папика') ||
      desc.includes('ищу щедрого') ||
      desc.includes('приветик') ||
      desc.includes('не жадного') ||
      desc.includes('билет в театр') ||
      desc.includes('здесь редко') ||
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
    return desc.includes('любимого') ||
      desc.includes('ухаживать') ||
      desc.includes('леди') ||
      desc.includes('мужа')
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
  fetchDescription() {
    const descriptionNode = filter.getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (descriptionNode) {return descriptionNode.innerText}
  },

  call() {
    const description = filter.fetchDescription()
    console.log(`\n\n${description}\n\n`)
    const desc = description.toLowerCase()

    Object.keys(positiveChecks).every(positiveCheck => {
      console.log('🕶️', positiveCheck)
      if (positiveChecks[positiveCheck](desc)) {
        actions.yes(positiveCheck, description)
        return false
      }
      return true
    })

    Object.keys(negativeChecks).every(negativeCheck => {
      console.log('💀', negativeCheck)
      if (negativeChecks[negativeCheck](desc)) {
        actions.nope(negativeCheck, description)
        return false
      }
      return true
    })
  }
}

window.addEventListener('load', () => setTimeout(filter.call, filter.delay(4000)), false)
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
  }
})
