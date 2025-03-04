let state = {
    isActive: false,
    endTime: null,
    pin: null,
    lockAttempts: 0,
    profiles: {
      strict: { categories: ['adult', 'gambling', 'alcohol', 'violence'], custom: [], regex: ['.*\\.porn.*', '.*\\.xxx.*', '.*\\.sex.*', '.*\\.cam.*'] },
      moderate: { categories: ['adult', 'gambling'], custom: [], regex: [] },
      custom: { categories: [], custom: [], regex: [] }
    },
    activeProfile: 'strict',
    haramKeywords: {
      adult: [
        'porn', 'xxx', 'sex', 'nude', 'erotic', 'adult', 'cam', 'escort', 'strip', 'fetish', 'porno', 'xvideos', 'pornhub', 'onlyfans', 'nsfw', 'hentai', 'webcam', 'livejasmin', 'chaturbate',
        'adultfriendfinder', 'playboy', 'bangbros', 'redtube', 'youporn', 'xhamster', 'xnxx', 'tnaflix', 'brazzers', 'realitykings', 'slut', 'orgy', 'threesome', 'lingerie', 'seduction', 'prostitute'
      ],
      gambling: [
        'bet', 'casino', 'poker', 'gamble', 'lottery', 'bingo', 'slots', 'wager', 'odds', 'bet365', 'paddy', 'ladbrokes', 'roulette', 'blackjack', '888casino', 'betfair', 'williamhill', 'partypoker',
        'sportsbet', 'draftkings', 'fan duel', 'gamblingzone', 'jackpot', 'payout', 'dice', 'baccarat', 'keno', 'scratchcard', 'raffle', 'bookie'
      ],
      alcohol: [
        'beer', 'wine', 'vodka', 'whiskey', 'liquor', 'alcohol', 'drunk', 'bar', 'cocktail', 'gin', 'rum', 'tequila', 'brew', 'distillery', 'booze', 'moonshine', 'absinthe', 'sake', 'mead', 'ale',
        'stout', 'lager', 'brandy', 'porto', 'champagne', 'cider', 'schnapps', 'liquorstore', 'pub', 'tavern'
      ],
      violence: [
        'gore', 'blood', 'fight', 'kill', 'murder', 'violent', 'torture', 'brutal', 'death', 'assault', 'war', 'shoot', 'stab', 'execution', 'slaughter', 'massacre', 'carnage', 'beheading',
        'genocide', 'riot', 'brawl', 'combat', 'duel', 'slaughterhouse', 'horror', 'thriller', 'psycho', 'sniper'
      ]
    }
  };
  
  // Initialize
  async function initialize() {
    const data = await chrome.storage.local.get(['isActive', 'endTime', 'pin', 'lockAttempts', 'activeProfile', 'customProfiles']);
    state.isActive = data.isActive || false;
    state.endTime = data.endTime || null;
    state.pin = data.pin || null;
    state.lockAttempts = data.lockAttempts || 0;
    state.activeProfile = data.activeProfile || 'strict';
    if (data.customProfiles) state.profiles.custom = data.customProfiles;
    enforceTimer();
    updateDeclarativeRules();
  }
  initialize();
  
  // Dynamic blocking with webNavigation
  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (!state.isActive) return;
    const url = new URL(details.url);
    const profile = state.profiles[state.activeProfile];
    const keywords = profile.categories.flatMap(cat => state.haramKeywords[cat] || []).concat(profile.custom || []);
    const regexPatterns = profile.regex.map(pattern => new RegExp(pattern));
    const isHaram = keywords.some(k => url.hostname.includes(k) || url.pathname.includes(k)) || regexPatterns.some(r => r.test(url.href));
    if (isHaram) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
      logAttempt(details.url);
    }
  }, { url: [{ urlMatches: '<all_urls>' }] });
  
  // Update declarative rules dynamically
  async function updateDeclarativeRules() {
    const profile = state.profiles[state.activeProfile];
    const keywords = profile.categories.flatMap(cat => state.haramKeywords[cat] || []).concat(profile.custom || []);
    const rules = keywords.map((keyword, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
      condition: { urlFilter: `*${keyword}*`, resourceTypes: ['main_frame'] }
    }));
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1),
      addRules: rules.slice(0, 1000)
    });
  }
  
  // Context menu
  chrome.contextMenus.create({ id: 'blockSite', title: 'Block Site', contexts: ['page'] });
  chrome.contextMenus.onClicked.addListener((info) => {
    const url = new URL(info.pageUrl).hostname;
    state.profiles[state.activeProfile].custom.push(url);
    chrome.storage.local.set({ customProfiles: state.profiles[state.activeProfile] });
    updateDeclarativeRules();
  });
  
  // Tamper resistance
  chrome.alarms.create('checkState', { periodInMinutes: 0.25 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkState' && state.isActive && state.endTime > Date.now()) {
      chrome.runtime.reload();
      chrome.tabs.query({}, (tabs) => tabs.forEach(tab => chrome.tabs.reload(tab.id)));
    }
  });
  chrome.management.onDisabled.addListener(() => {
    if (state.isActive && state.endTime > Date.now()) {
      notify('Alert', 'Musafir cannot be disabled during lock.');
    }
  });
  
  // Logging
  function logAttempt(url) {
    chrome.storage.local.get('blockLog', (data) => {
      const log = data.blockLog || [];
      log.push({ url, time: new Date().toISOString() });
      chrome.storage.local.set({ blockLog });
      notify('Blocked', `${url} intercepted.`);
    });
  }
  
  // Timer enforcement (no badge)
  function enforceTimer() {
    if (!state.isActive || !state.endTime) return;
    const now = Date.now();
    if (now >= state.endTime) {
      state.isActive = false;
      state.endTime = null;
      state.lockAttempts = 0;
      chrome.storage.local.set({ isActive: false, endTime: null, lockAttempts: 0 });
      notify('Unlocked', 'Focus period complete.');
    } else {
      setTimeout(enforceTimer, 250);
    }
  }
  
  function formatTime(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${days}d ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function notify(title, message) {
    chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title, message });
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'startTimer') {
      state.isActive = true;
      enforceTimer();
      updateDeclarativeRules();
    } else if (msg.action === 'overrideAttempt') {
      state.lockAttempts++;
      chrome.storage.local.set({ lockAttempts: state.lockAttempts });
      if (state.lockAttempts >= 2) {
        state.endTime += 7200000;
        chrome.storage.local.set({ endTime: state.endTime });
        notify('Penalty', 'Lock extended by 2 hours.');
      }
    } else if (msg.action === 'unlockRequest') {
      setTimeout(() => {
        state.isActive = false;
        state.endTime = null;
        state.lockAttempts = 0;
        chrome.storage.local.set({ isActive: false, endTime: null, lockAttempts: 0 });
        sendResponse({ success: true });
      }, 3600000); // 1-hour delay
      return true; // Keep message channel open for async response
    }
  });