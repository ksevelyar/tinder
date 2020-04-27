// ==UserScript==
// @name         dat_filter_okc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       ksevelyar
// @grant        none
// @include https://www.okcupid.com/doubletake
// ==/UserScript==

let $ = selector => document.querySelector(selector)
let $all = selector => document.querySelectorAll(selector)

class Liker {
  humanDelay() {
    this.latency = Math.ceil(Math.random() * 1000 + 1000);
    window.lastDelay = this.latency;
    return this.latency;
  }

  nope(reason, meatbagDelay, description) {
    const dislikeButton = $('.doubletake-pass-button')
    if (!dislikeButton) { return; }

    console.log(`[${meatbagDelay}]`, `[NOPE: ${reason}]`, description);
    dislikeButton.click();
  }
  yep(meatbagDelay, description) {
    const likeButton = $('.likes-pill-button-inner')
    if (!likeButton) { return; }

    console.log(`[${meatbagDelay}]`, `[YEP]`, description);
    likeButton.click();
  }


  like() {
    if ( $('.dynamic-likes-cap-modal') ) { return; }
    if ( $('.likes-pill-button.disabled') ) { return }

    if (!$('.cardsummary-reflux-match-pct')) { return }

    const matchPercentage = Number($('.cardsummary-reflux-match-pct').innerText.replace('%', ''))
    if (!matchPercentage) { return }

    if (matchPercentage < 80) { this.nope('fat chance', window.lastDelay, matchPercentage); return };

    const kidsNode = $('.matchprofile-details-section--family');
    if (kidsNode) {
      const kids = kidsNode.innerText
      if ( 
        kids.includes('Doesn’t have kids but might want them') 
      ) {
        this.nope('kids', window.lastDelay, kids); return
      };
    }

    const backgroundNode = $('.matchprofile-details-section--background');
    if (backgroundNode) {
      const background = backgroundNode.innerText
      if ( 
        background.includes('Christian') ||
        background.includes('Muslim') 
      ) {
        this.nope('magical thinker', window.lastDelay, background); return
      };
    }

    const lifestyleNode = $('.matchprofile-details-section--lifestyle');
    if (lifestyleNode) {
      const lifestyle = lifestyleNode.innerText
      if ( 
        lifestyle.includes('Never smokes marijuana')
      ) {
        this.nope('!420', window.lastDelay, lifestyle); return
      };
    }

    this.yep(window.lastDelay, matchPercentage)
  }

  call() {
    this.like();
  }
}

window.addEventListener('load', () => {
  const liker = new Liker();

  const likeWithDelay = function () {
    liker.call();
    setTimeout(likeWithDelay, liker.humanDelay());
  };
  setTimeout(likeWithDelay, liker.humanDelay());
}, false);
