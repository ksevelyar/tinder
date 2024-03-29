// ==UserScript==
// @name    dat_filter_tinder
// @author  ksevelyar
// @grant   none
// @match https://tinder.com/app/recs
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
    return desc.length < 30 && (desc.includes('@') || desc.includes('inst') || desc.includes('инст'))
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
      'чтобы я написала тебе первая', 'первая не пишу', 'дай мне знать'
    ].some(string => desc.includes(string))
    || desc.includes('парн') && desc.includes('перв')
  },
  corny(desc) {
    return [
      'зачем тебе умному', 'сапиосексуал', 'бог дал тебе', 'абсолютно понятен',
      'один здесь отдыхаешь', 'дочь маминой'
    ].some(string => desc.includes(string))
    || desc.includes('иллюзия') && desc.includes('выбор')
  },
  patriot(desc) { return desc.includes('🇷🇺') }
}

const filter = {
  delay() {
    return Math.ceil(Math.random() * 1000 + 500)
  },
  getByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  },
  async sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) },
  async fetchDescription() {
    const infoButton = filter.getByXpath('//*/div/div[1]/div/main/div[1]/div/div/div[1]/div[1]/div/div[3]/div[3]/button')
    infoButton.click()
    await filter.sleep(300)

    const description = document.querySelector('.BreakWord')

    return description?.innerText || ''
  },
  nope(reason, description) {
    const purpleOnBlack = 'background: #000; color: #7f00ff'
    console.log(`%c[NOPE: ${reason}]\n`, purpleOnBlack, description)

    const dislikeButton = document.querySelectorAll('.button')[0]
    if (!dislikeButton) { return console.log('🤖 Dislike button not found') }

    dislikeButton.click()
    setTimeout(filter.call, 600)
  },
  check(desc) {
    const desc_lowercase = desc.toLowerCase()
    return Object.keys(checks).find(check => checks[check](desc_lowercase))
  },
  async call() {
    const desc = await filter.fetchDescription()
    const dealbreaker = filter.check(desc)

    if (dealbreaker) { return filter.nope(dealbreaker, desc) }

    console.log(`🤖 Your turn human, swipe or improve me\n\n${desc}\n`)
  }
}

document.addEventListener('keyup', (event) => {
  document.documentElement.style.setProperty('--recs-card-height', '100vh')

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
  }
})
