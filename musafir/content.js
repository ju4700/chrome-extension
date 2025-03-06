// Check if the page is a Chrome internal page
if (window.location.protocol === 'chrome:') {
  console.log('Content script disabled on Chrome internal page:', window.location.href);
  return;
}

let isActive = false;

chrome.storage.local.get(['isActive'], (data) => {
  isActive = data.isActive || false;
  if (isActive && document.body) processMedia();
});

// Process media elements
function processMedia() {
  if (!document.body) {
    console.warn('Document body not available, skipping media processing.');
    return;
  }
  const mediaTypes = ['img', 'video', 'iframe', 'object', 'embed', 'picture'];
  const haramKeywords = [
    'porn', 'xxx', 'porno', 'xvideos', 'pornhub', 'onlyfans', 'nsfw', 'hentai', 'chaturbate', 'adultfriendfinder', 'playboy', 'bangbros', 'redtube', 'youporn', 'xhamster', 'xnxx', 'tnaflix',
    'brazzers', 'realitykings', 'orgy', 'threesome', 'prostitute', 'escortservice', 'stripclub', 'fetishsite', 'livejasmin', 'webcamsex', 'adultfilm', 'x-rated', 'explicitvideo', 'uncensoredporn',
    'hardcoreporn', 'softcoreporn', 'adultactress', 'adultactor', 'pornstar', 'adultstudio', 'adultproduction', 'adultchannel', 'adultstream', 'adultforum', 'adultcommunity', 'adultnetwork',
    'toplessvideo', 'nudevideo', 'sexvideo', 'eroticvideo', 'adultlive', 'adultshow', 'adultmodel', 'adultphoto', 'adultimage', 'adultclip', 'adultscene', 'adultwebsite', 'adultlink', 'adultpage',
    'adultgallery', 'adultpic', 'camgirl', 'camshow', 'livecamsex', 'privatecam', 'sexchat', 'cybersexchat', 'adultchatroom', 'sextingapp', 'adultgame', 'eroticgame', 'seductionvideo',
    'intimatemovie', 'lustfilm', 'arousalvideo', 'orgasmvideo', 'ejaculationvideo', 'condomvideo', 'dildovideo', 'vibratorvideo', 'bondagevideo', 'bdsmvideo', 'dominationvideo', 'submissionvideo',
    'spankingvideo', 'voyeurvideo', 'exhibitionvideo', 'cuckoldvideo', 'milfvideo', 'teenporn', 'amateurporn', 'professionalporn', 'stripteasevideo', 'lapdancevideo', 'massagevideo', 'sensualvideo',
    'adultcontent', 'adultentertainment', 'adultindustry', 'adultservices', 'adultmedia', 'adultchannel', 'adultstream', 'adultforum', 'adultcommunity', 'adultnetwork', 'topless', 'nude', 'exposed',
    'genitalia', 'copulation', 'intercourse', 'fellatio', 'cunnilingus', 'pornography', 'adultphoto', 'adultimage', 'adultclip', 'adultscene', 'adultshow', 'adultlive', 'adultmodel', 'adultstar'
  ];

  const elements = document.querySelectorAll(mediaTypes.join(','));
  for (let el of elements) {
    const src = el.src ? el.src.toLowerCase() : '';
    const alt = el.alt ? el.alt.toLowerCase() : '';
    const title = el.title ? el.title.toLowerCase() : '';
    const parentText = el.parentElement ? el.parentElement.textContent.toLowerCase() : '';
    if (isActive && haramKeywords.some(k => src.includes(k) || alt.includes(k) || title.includes(k) || parentText.includes(k))) {
      applyBlur(el);
    }
  }
}

// Observe document changes
const observer = new MutationObserver((mutations) => {
  if (document.body) {
    chrome.storage.local.get(['isActive'], (data) => {
      isActive = data.isActive || false;
      if (isActive) processMedia();
    });
  } else {
    console.warn('Document body not available during mutation, skipping.');
  }
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
} else {
  console.warn('Document body not available, delaying observer initialization.');
  const checkBody = setInterval(() => {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      clearInterval(checkBody);
      console.log('Observer initialized after DOM load');
    }
  }, 100); // Check every 100ms
}

function applyBlur(element) {
  if (!element.classList.contains('musafir-blur')) {
    element.classList.add('musafir-blur');
    element.dataset.originalSrc = element.src || '';
    element.style.filter = 'blur(20px)';
    element.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.textContent = 'Blocked by Musafir';
    element.parentNode.insertBefore(overlay, element.nextSibling);
  }
}