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
      'православ', 'christian', 'astrolog', 'астролог', 'эзотерик'
    ].some(string => desc.includes(string))
  },
  tooSmartForAstrology(desc) {
    return [
      'istj', 'isfj', 'infj', 'intj', 'istp', 'isfp', 'infp', 'intp',
      'estp', 'esfp', 'enfp', 'entp', 'estj', 'esfj', 'enfj', 'entj'
    ].some(string => desc.includes(string))
  },
  emptyProfile(desc) {
    return desc.length < 10 ||
      desc.includes('s away') || desc.includes('lives in') ||
      desc.length < 30 && (desc.includes('@') || desc.includes('inst') || desc.includes('инст'))
  },
  sexTrafficking(desc) {
    return [
      'не скупого', 'папик', 'ищу спонсора', 'интим', 'не жадного', 'ищу щедрого', 'щедрый'
    ].some(string => desc.includes(string))
  },
  fraud(desc) {
    return [
      'вирт ', 'модель ню', 'приветик', 'в театр', 'здесь редко', 'здесь не сижу', 'тут не сижу',
      'тут бываю редко', 'пишите в ', 'пиши в ', 'буду ждать тебя в', 'напиши мне в ',
      'подари', 'скинь'
    ].some(string => desc.includes(string))
  },
  kids(desc) {
    return ['есть сын', 'есть доч', 'есть реб', 'мама сын'].some(string => desc.includes(string))
  },
  'whySoSerious?'(desc) {
    return desc.includes('серь') && desc.includes('отнош') ||
      desc.includes('ищу отношения') ||
      desc.includes('serious relationship')
  },
  differentGoals(desc) {
    return [
      'любимого', 'ухаживать', 'хочу влюбиться', 'половинку', 'женат', 'жених', 'замуж', 'бачат',
      '🖇', '❌', '❗️', 'футбол', 'караоке', 'понравлюсь твоей маме', 'кальян'
    ].some(string => desc.includes(string))
  },
  heightFilter(desc) {
    const h17x = desc.match(/17(\d)/)
    const isHigherThan174 = (h17x && h17x[1] && h17x[1] > 4)

    return /18\d/.test(desc) || /19\d/.test(desc) || isHigherThan174
  },
  genderRoles(desc) {
    return [
      'мужчин', 'женщин', 'чтобы я написала тебе первая', 'первая не пишу', 'дай мне знать'
    ].some(string => desc.includes(string))
    || desc.includes('парн') && desc.includes('перв')
  },
  corny(desc) {
    return [
      'зачем тебе умному', 'сапиосексуал', 'бог дал тебе', 'абсолютно понятен',
      'иллюзия большого выбора', 'один здесь отдыхаешь', 'дочь маминой',
      'люблю путешеств', 'выстав'
    ].some(string => desc.includes(string))
  },
  narcissism(desc) {
    return [
      'вредн', 'скучаю', 'душн', 'адекватн', 'на манеже', 'на базе', 'леди', 'принц', 'забери меня'
    ].some(string => desc.includes(string))
  },
  patriot(desc) { return desc.includes('🇷🇺') }
}

const filter = {
  delay() {
    return Math.ceil(Math.random() * 1000 + 500)
  },
  fetchDescription() {
    const descriptionSelector = "[aria-hidden='false'] .BreakWord"
    const descriptionNode = document.querySelector(descriptionSelector)

    if (descriptionNode) { return descriptionNode.innerText }
    return ''
  },
  nope(reason, description) {
    const purpleOnBlack = 'background: #000; color: #7f00ff'
    console.log(`%c[NOPE: ${reason}]\n`, purpleOnBlack, description)

    const dislikeButton = document.querySelectorAll('.button')[1]
    if (!dislikeButton) { return console.log('🤖 Dislike button not found') }

    dislikeButton.click()
    setTimeout(filter.call, 900)
  },
  closePopup() {
    const noThanks = Array.from(document.querySelectorAll('.button span')).find(
      button => button.innerText == 'NO THANKS'
    )
    if (noThanks) { return window.location.reload() }
  },
  call() {
    filter.closePopup()

    const desc = filter.fetchDescription()
    const dealbreaker = Object.keys(checks).find(check => checks[check](desc.toLowerCase()))
    if (dealbreaker) { return filter.nope(dealbreaker, desc) }

    console.log(`🤖 Your turn human, swipe or improve me\n\n${desc}\n`)
    window.reloadTimer = setTimeout(window.location.reload.bind(window.location), 3 * 60000)
  }
}

window.addEventListener('load', () => { setTimeout(filter.call, filter.delay() + 5000 ) }, false)

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
    clearTimeout(window.reloadTimer)
  }
})
