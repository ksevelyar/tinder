// ==UserScript==
// @name         dat_filter_tinder
// @version      0.1
// @description  sito huito
// @author       ksevelyar
// @grant        none
// @include https://tinder.com/app/recs
// ==/UserScript==

function contains(selector, text) {
  const elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, element => RegExp(text).test(element.textContent));
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

class Liker {
  constructor() {
    this.superlikes = true;
  }

  humanDelay() {
    this.latency = Math.ceil(Math.random() * 1000 + 1000);
    window.lastDelay = this.latency;
    return this.latency;
  }

  superlikesMode() {
    if (this.superlikes === false) return false;

    if (contains('.button__text span', 'Get More Super Likes').length) {
      contains('button span', 'No Thanks')[0].click();
      this.superlikes = false;
    }

    return this.superlikes;
  }

  eyeCandy() {
    const NotInterestedButton = contains('button span', 'Not interested')[0];
    if (NotInterestedButton) { NotInterestedButton.click(); }

    //const infoButton = document.querySelector('.recCard__openProfile');
    //if (infoButton) { infoButton.click(); }
  }
    
  nope(reason, meatbagDelay, description) {
    const dislikeButton = document.querySelector('[aria-label="Nope"]')   
    if (!dislikeButton) { return; }
      
    console.log(`[${meatbagDelay}]`, `[NOPE: ${reason}]`, description);
    dislikeButton.click();
  }
  yes(description) {}
  yep(description) {
    const likeButton = document.querySelector('[aria-label="Like"]') || document.querySelector('[aria-label="Лайк"]')
    if (!likeButton) { return; }
  }

  like() {
    const likeButton = document.querySelector('[aria-label="Like"]') || document.querySelector('[aria-label="Лайк"]')
    if (!likeButton) { return; }

    const superLikeButton = document.querySelector('[aria-label="Super Like"]');

    const descriptionNode = getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (!descriptionNode) { return }

    const description = descriptionNode.innerText.toLowerCase()
    const d = description.toLowerCase()

    if (d.includes("есть сын") || d.includes("есть дочь")) { this.nope('kids', window.lastDelay, description); return };
    if (d.includes("серьезные отношения") || d.includes("серьёзные отношения")) { this.nope('why so serious?', window.lastDelay, description); return };
    if (d.includes("kilometers away")) { this.nope('empty profile', window.lastDelay, description); return };

    if (
      d.includes("программист") ||
      d.includes("programmer") ||
      d.includes("github") ||
      d.includes("linux")
    ) {
      console.log(`[${window.lastDelay}]`, '[YES]', description);
      this.superlikesMode() ? superLikeButton.click() : likeButton.click();
      return
    };

    console.log(`[${window.lastDelay}]`, '[YEP]', description);
    likeButton.click();
  }

  call() {
    this.like();
    this.eyeCandy();
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
