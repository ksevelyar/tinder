// ==UserScript==
// @author  ksevelyar
// @name    dat_filter_tinder
// @grant   none
// @include https://tinder.com/app/recs
// ==/UserScript==

const checks = {
  magicalThinker(desc) {
    return [
      '♈', '♉', '♊', '♋', '♌', '♍', '♏️', '🦂', '♎', '♐', '♑', '♒', '♓',
      'козерог', 'водолей', 'овен', 'телец', 'дева', 'весы', 'скорпион', 'стрелец',
      'православ', 'christian',
      'astrolog', 'астролог', 'эзотерик'
    ].some(string => desc.includes(string))
  },
  tooSmartForAstrology(desc) {
    return ['istj', 'isfj', 'infj', 'intj',
      'istp', 'isfp', 'infp', 'intp',
      'estp', 'esfp', 'enfp', 'entp',
      'estj', 'esfj', 'enfj', 'entj'].some(string => desc.includes(string))
  },
  emptyProfile(desc) {
    return desc.length < 10 ||
      desc.includes('s away') || desc.includes('lives in') ||
      desc.length < 30 && (desc.includes('@') || desc.includes('inst') || desc.includes('инст'))
  },
  sexTrafficking(desc) {
    return [
      'не скупого', 'папик', 'ищу спонсора', 'интим',
      'не жадного', 'ищу щедрого', 'щедрый',
    ].some(string => desc.includes(string))
  },
  fraud(desc) {
    return [
      'вирт ', 'модель ню', 'приветик', 'в театр',
      'здесь редко', 'здесь не сижу', 'тут не сижу', 'тут бываю редко',
      'пишите в ', 'пиши в ', 'буду ждать тебя в', 'напиши мне в '
    ].some(string => desc.includes(string))
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
  differentGoals(desc) {
    return [
      'любимого', 'ухаживать', 'хочу влюбиться', 'половинку',
      'женат', 'жених', 'бачат', '🖇',
      '❌', '❗️', 'футбол', 'караоке'
    ].some(string => desc.includes(string))
  },
  heightFilter(desc) {
    const h17x = desc.match(/17(\d)/)
    const isHigherThan174 = (h17x && h17x[1] && h17x[1] > 4)

    return /18\d/.test(desc) || /19\d/.test(desc) || isHigherThan174
  },
  genderRoles(desc) {
    return desc.includes('мужчин') || desc.includes('женщин')
  },
  corny(desc) {
    return [
      'зачем тебе умному', 'сапиосексуал', 'бог дал тебе'
    ].some(string => desc.includes(string))
  },
  narcissism(desc) {
    return [
      'вредная', 'скучаю', 'душн', 'адекватн', 'на манеже', 'на базе',
      'леди', 'принц', 'забери меня',
    ].some(string => desc.includes(string))
  },
}

const filter = {
  delay(extraDelay = 0) {
    return Math.ceil(Math.random() * 1000 + 500 + extraDelay)
  },
  fetchDescription() {
    const descriptionVariant0 = "[aria-hidden='false'] .BreakWord"
    const descriptionNode = document.querySelector(descriptionVariant0)

    if (descriptionNode) {
      return descriptionNode.innerText
    }

    return ''
  },
  nope(reason, description) {
    console.log(`%c[NOPE: ${reason}]`, 'background: #000; color: #7f00ff', description)
    const dislikeButton = document.querySelectorAll('.button')[1]
    if (!dislikeButton) { return console.log('🤖 Dislike button not found') }

    dislikeButton.click()
    setTimeout(filter.call, 1000)
  },
  call() {
    const noThanks = Array.from(document.querySelectorAll('.button span')).find(
      button => button.innerText == 'NO THANKS'
    )
    if (noThanks) { window.location.reload() }

    const rawDescription = filter.fetchDescription()
    const desc = rawDescription.toLowerCase()

    const dealbreaker = Object.keys(checks).find(check => checks[check](desc))
    if (dealbreaker) { return filter.nope(dealbreaker, rawDescription) }

    console.log(`🤖 Your turn human, swipe or improve me\n\n${rawDescription}\n`)
    window.reloadTimer = setTimeout(window.location.reload.bind(window.location), 3 * 60000)
  }
}

window.addEventListener('load', () => {
  setTimeout(filter.call, filter.delay(3000))
}, false)

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
    clearTimeout(window.reloadTimer)
  }
})
