// ==UserScript==
// @name         dat_filter_okc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       ksevelyar
// @grant        none
// @include https://www.okcupid.com/doubletake
// ==/UserScript==

let $ = selector => document.querySelector(selector)

const actions = {
 nope(reason, description) {
    const dislikeButton = $('.doubletake-pass-button')
    if (!dislikeButton) {return }

    console.log('[nope] ', reason, description)
    dislikeButton.click()

    setTimeout(filter.call, 2000)
  },
  yep(description) {
    const likeButton = $('.likes-pill-button-inner')
    if (!likeButton) {return }

    console.log('[yes]', description)
    likeButton.click()

    setTimeout(filter.call, 2000)
  }
}

const filter = {
  delay() {
    return Math.ceil(Math.random() * 1000 + 4000)
  },

  call() {
    if (!$('.cardsummary-reflux-match-pct')) { return }
    if ($('.dynamic-likes-cap-modal')) { return }
    if ($('.likes-pill-button.disabled')) { return }

    const matchPercentage = Number($('.cardsummary-reflux-match-pct').innerText.replace('%', ''))
    if (!matchPercentage) {return }
    console.log('%', matchPercentage)

    if (matchPercentage < 60) {
      actions.nope('fat chance', matchPercentage)
      return
    }

    const kidsNode = $('.matchprofile-details-section--family')
    if (kidsNode) {
      const kids = kidsNode.innerText
      if (
        kids.includes('Doesn’t have kids but might want them') ||
        kids.includes('Doesn’t have kids but wants them')
      ) {
        actions.nope('kids', kids)
        return
      }
    }

    const backgroundNode = $('.matchprofile-details-section--background')
    if (backgroundNode) {
      const background = backgroundNode.innerText
      if (
        background.includes('Christian') ||
        background.includes('Muslim')
      ) {
        actions.nope('magical thinker', background)
        return
      }
    }

    const lifestyleNode = $('.matchprofile-details-section--lifestyle')
    if (lifestyleNode) {
      const lifestyle = lifestyleNode.innerText
      if (
        lifestyle.includes('Never smokes marijuana')
      ) {
        actions.nope('!420', lifestyle)
        return
      }
    }

    const descNode = $('.qmessays-essay')
    if (descNode) {
      const desc = descNode.innerText.replace('My self-summary', '')
      if (
        desc.length < 10
      ) {
        actions.nope('blank profile', desc)
      }
    }
  }
}

window.addEventListener('load', () => setTimeout(filter.call, 5000), false)
document.addEventListener('keyup', (event) => {
  if (event.key === "1" || event.key === "2") {
    setTimeout(filter.call, 1500)
  }
})
