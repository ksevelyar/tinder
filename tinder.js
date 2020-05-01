// ==UserScript==
// @name         dat_filter_tinder
// @version      0.2
// @description  sito huito
// @author       ksevelyar
// @grant        none
// @include https://tinder.com/app/recs
// ==/UserScript==

let $ = selector => document.querySelector(selector)
let $all = selector => document.querySelectorAll(selector)

window.superlikes = true

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
    if (!dislikeButton) { return }

    console.log(`[${window.lastDelay}]`, `[NOPE: ${reason}]`, description)
    dislikeButton.click()
  },

  yes(description) {
    const superLikeButton = $('[aria-label="Super Like"]')
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) { return }

    console.log(`[${window.lastDelay}]`, '[YES]', description)
    actions._isSuperlikesAvailable() ? superLikeButton.click() : likeButton.click()
  },
  _isSuperlikesAvailable() {
    if (window.superlikes === false) return false

    if (page.contains('.button__text span', 'Get More Super Likes').length) {
      page.contains('button span', 'No Thanks')[0].click()
      window.superlikes = false
    }

    return window.superlikes
  },
  yep(description) {
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) { return }
    console.log(`[${window.lastDelay}]`, '[YEP]', description)
    likeButton.click()
  }
}

const liker = {
  hidePopups() {
    const NotInterestedButton = page.contains('button span', 'Not interested')[0]
    if (NotInterestedButton) { NotInterestedButton.click() }
  },

  dosPreventionDelay(minDelay = 1000) {
    window.lastDelay = Math.ceil(Math.random() * 1000 + minDelay)
    return window.lastDelay
  },

  callWithDelay() {
    //debugger
    liker.call()
    setTimeout(liker.callWithDelay, liker.dosPreventionDelay())
  },

  call() {
    liker.hidePopups()
    const descriptionNode = page.getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (!descriptionNode) { return }

    const description = descriptionNode.innerText
    const d = description.toLowerCase()

    if (
      d.includes("есть сын") ||
      d.includes("есть дочь") ||
      d.includes("есть дочка")
    ) { actions.nope('kids', description); return }

    if (
      d.includes("♈") ||
      d.includes("♉") ||
      d.includes("♊") ||
      d.includes("♋") ||
      d.includes("♌") ||
      d.includes("♍") ||
      d.includes("♎") ||
      d.includes("♐") ||
      d.includes("♑") ||
      d.includes("♒") ||
      d.includes("♓")
    ) { actions.nope('magical thinker', description); return }

    if (
      d.includes("trans ") ||
      d.includes("транс ")
    ) { actions.nope('trans', description); return }

    if (
      d.includes("не скупого") ||
      d.includes("ищу папика") ||
      d.includes("ищу щедрого") ||
      d.includes("не жадного")
    ) { actions.nope('Scrooge McDuck', description); return }

    if (
      d.includes("серьезные отношения") ||
      d.includes("серьёзные отношения") ||
      d.includes("serious relationship")
    ) { actions.nope('why so serious?', description); return }

    if (d.includes("kilometers away")) { actions.nope('empty profile', description); return }

    if (
      d.includes("программист") ||
      d.includes("programmer") ||
      d.includes("github") ||
      d.includes("linux")
    ) {
      actions.yes(description)
      return
    }

    actions.yep(description)
  }
}

window.addEventListener('load', () => setTimeout(liker.callWithDelay, liker.dosPreventionDelay(3000)), false)
