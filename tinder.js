// ==UserScript==
// @name         dat_filter_tinder
// @version      0.3
// @description  sito huito
// @author       ksevelyar
// @grant        none
// @include https://tinder.com/app/recs
// ==/UserScript==

let $ = selector => document.querySelector(selector)
let $all = selector => document.querySelectorAll(selector)

const page = {
  contains(selector, text) {
    const elements = $all(selector)
    return Array.prototype.filter.call(elements, element => RegExp(text).test(element.textContent))
  },
  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  }
}

const actions = {
  nope(reason, description) {
    const dislikeButton = $('[aria-label="Nope"]')
    if (!dislikeButton) {return }

    console.log(`[NOPE: ${reason}]`, description)
    dislikeButton.click()
    setTimeout(filter.call, 1000)
  },

  yes(description) {
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) {return }

    console.log('[YES]', description)
    likeButton.click()
    setTimeout(filter.call, 1000)
  }
}

const filter = {
  delay() {
    return Math.ceil(Math.random() * 1000 + 4000)
  },

  hidePopups() {
    const NotInterestedButton = page.contains('button span', 'Not interested')[0]
    if (NotInterestedButton) {NotInterestedButton.click()}
  },

  call() {
    filter.hidePopups()
    const descriptionNode = page.getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (!descriptionNode) {return }

    const description = descriptionNode.innerText
    console.log(`\n${description}\n`)
    const d = description.toLowerCase()
    window.d = d

    if (
      d.length < 5 ||
      d.includes("kilometers away") ||
      d.includes("lives in") ||
      d.includes("inst", "инст") && d.length < 42
    ) {
      actions.nope('empty profile', description)
      return
    }

    if (
      d.includes('взяла билет в театр')
    ) {actions.nope('fraud', description); return }

    if (
      d.includes("есть сын") ||
      d.includes("есть дочь") ||
      d.includes("есть дочка") ||
      d.includes("есть ребенок") ||
      d.includes("мама сына")
    ) {actions.nope('kids', description); return }

    if (
      d.includes("♈", "♉", "♊", "♋", "♌", "♍", "♎", "♐", "♑", "♒", "♓") ||
      d.includes("Koзepoг",
        "Вoдoлeй",
        "Pыбы",
        "Oвeн",
        "Teлeц",
        "Близнeцы",
        "Pak",
        "Лeв",
        "Дeвa",
        "Вecы",
        "Ckopпиoн",
        "Cтpeлeц"
      ) ||
      d.includes("православ")

    ) {
      actions.nope('magical thinker', description)
      return
    }

    if (
      d.includes("не скупого") ||
      d.includes("ищу папика") ||
      d.includes("ищу щедрого") ||
      d.includes("приветик") ||
      d.includes("не жадного")
    ) {actions.nope('🦆', description); return }

    if (
      d.includes("серь") && d.includes("отнош") ||
      d.includes("ищу отношения") ||
      d.includes("serious relationship")
    ) {actions.nope('why so serious?', description); return }

    if (
      d.includes("мужчина") ||
      d.includes("женщина")
    ) {actions.nope('gender roles', description); return }

    if (
      d.includes("мужа")
    ) {actions.nope('💨', description); return }

    if (
      d.includes("любимого") ||
      d.includes("ухаживать") ||
      d.includes("здесь редко") ||
      d.includes("леди")
    ) {actions.nope('paralympic games', description); return }

    if (
      d.includes("программист") ||
      d.includes("programmer") ||
      d.includes("github") ||
      d.includes("linux") ||
      d.includes("420", "4:20")
    ) {
      actions.yes(description)
    }
  }
}

window.addEventListener('load', () => setTimeout(filter.call, 5000), false)
document.addEventListener('keyup', (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    setTimeout(filter.call, 700)
  }
})
