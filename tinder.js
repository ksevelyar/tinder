// ==UserScript==
// @name         dat_filter_tinder
// @version      0.1
// @description  sito huito
// @author       ksevelyar
// @grant        none
// @include https://tinder.com/app/recs
// ==/UserScript==

let $ = selector => document.querySelector(selector)
let $all = selector => document.querySelectorAll(selector)

function contains(selector, text) {
  const elements = $all(selector);
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

  isSuperlikesAvailable() {
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

    //const infoButton = $('.recCard__openProfile');
    //if (infoButton) { infoButton.click(); }
  }

  nope(reason, meatbagDelay, description) {
    const dislikeButton = $('[aria-label="Nope"]')
    if (!dislikeButton) { return; }

    console.log(`[${meatbagDelay}]`, `[NOPE: ${reason}]`, description);
    dislikeButton.click();
  }
  yes(meatbagDelay, description) {
    const superLikeButton = $('[aria-label="Super Like"]');
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) { return; }

    console.log(`[${window.lastDelay}]`, '[YES]', description);
    this.isSuperlikesAvailable() ? superLikeButton.click() : likeButton.click();
  }
  yep(meatbagDelay, description) {
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) { return; }
    console.log(`[${window.lastDelay}]`, '[YEP]', description);
    likeButton.click();
  }

  like() {
    const descriptionNode = getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (!descriptionNode) { return }

    const description = descriptionNode.innerText
    const d = description.toLowerCase()

    if (
      d.includes("есть сын") ||
      d.includes("есть дочь") ||
      d.includes("есть дочка")
    ) { this.nope('kids', window.lastDelay, description); return };

    if (
      d.includes("trans ") ||
      d.includes("транс ")
    ) { this.nope('trans', window.lastDelay, description); return };

    if (
      d.includes("не скупого") ||
      d.includes("ищу папика") ||
      d.includes("не жадного")
    ) { this.nope('Scrooge McDuck', window.lastDelay, description); return };

    if (
      d.includes("серьезные отношения") ||
      d.includes("серьёзные отношения") ||
      d.includes("serious relationship")
    ) { this.nope('why so serious?', window.lastDelay, description); return };

    if (d.includes("kilometers away")) { this.nope('empty profile', window.lastDelay, description); return };

    if (
      d.includes("программист") ||
      d.includes("programmer") ||
      d.includes("github") ||
      d.includes("linux")
    ) {
      this.yes(window.lastDelay, description)
      return
    };

    this.yep(window.lastDelay, description)
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
