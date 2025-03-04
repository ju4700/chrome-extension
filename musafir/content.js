let isActive = false;
let whitelist = [];
let reported = [];

chrome.storage.local.get(['isActive', 'whitelist', 'reported'], (data) => {
  isActive = data.isActive || false;
  whitelist = data.whitelist || [];
  reported = data.reported || [];
  if (isActive) processMedia();
});

function processMedia() {
  const mediaTypes = ['img', 'video', 'iframe', 'object', 'embed', 'picture'];
  const haramKeywords = [
    'porn', 'xxx', 'sex', 'nude', 'erotic', 'adult', 'cam', 'escort', 'strip', 'fetish', 'porno', 'xvideos', 'pornhub', 'onlyfans', 'nsfw', 'hentai', 'webcam', 'livejasmin', 'chaturbate',
    'adultfriendfinder', 'playboy', 'bangbros', 'redtube', 'youporn', 'xhamster', 'xnxx', 'tnaflix', 'brazzers', 'realitykings', 'slut', 'orgy', 'threesome', 'lingerie', 'seduction', 'prostitute',
    'bet', 'casino', 'poker', 'gamble', 'lottery', 'bingo', 'slots', 'wager', 'odds', 'bet365', 'paddy', 'ladbrokes', 'roulette', 'blackjack', '888casino', 'betfair', 'williamhill', 'partypoker',
    'sportsbet', 'draftkings', 'fanduel', 'gamblingzone', 'jackpot', 'payout', 'dice', 'baccarat', 'keno', 'scratchcard', 'raffle', 'bookie',
    'beer', 'wine', 'vodka', 'whiskey', 'liquor', 'alcohol', 'drunk', 'bar', 'cocktail', 'gin', 'rum', 'tequila', 'brew', 'distillery', 'booze', 'moonshine', 'absinthe', 'sake', 'mead', 'ale',
    'stout', 'lager', 'brandy', 'porto', 'champagne', 'cider', 'schnapps', 'liquorstore', 'pub', 'tavern',
    'gore', 'blood', 'fight', 'kill', 'murder', 'violent', 'torture', 'brutal', 'death', 'assault', 'war', 'shoot', 'stab', 'execution', 'slaughter', 'massacre', 'carnage', 'beheading',
    'genocide', 'riot', 'brawl', 'combat', 'duel', 'slaughterhouse', 'horror', 'thriller', 'psycho', 'sniper'
  ];
  const elements = document.querySelectorAll(mediaTypes.join(','));

  for (let el of elements) {
    const src = el.src ? el.src.toLowerCase() : '';
    const alt = el.alt ? el.alt.toLowerCase() : '';
    const title = el.title ? el.title.toLowerCase() : '';
    const parentText = el.parentElement ? el.parentElement.textContent.toLowerCase() : '';
    if (whitelist.includes(src)) continue;
    if (reported.includes(src) || haramKeywords.some(k => src.includes(k) || alt.includes(k) || title.includes(k) || parentText.includes(k))) {
      applyBlur(el);
    }
  }

  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: 'showMediaMenu', src: el.src });
  });
}

const observer = new MutationObserver(throttle(processMedia, 200));
observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });

function applyBlur(element) {
  element.classList.add('musafir-blur');
  element.dataset.originalSrc = element.src || '';
}

function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'unblur' && msg.src) {
    const el = document.querySelector(`[data-original-src="${msg.src}"]`);
    if (el) el.classList.remove('musafir-blur');
  } else if (msg.action === 'report' && msg.src) {
    reported.push(msg.src);
    chrome.storage.local.set({ reported });
  }
});