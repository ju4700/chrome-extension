// State management
let state = {
  isActive: false,
  endTime: null,
  profiles: {
    strict: { categories: ['adult'], custom: [], regex: ['.*\\.porn.*', '.*\\.xxx.*', '.*\\.adult.*', '.*\\.camshow.*'] },
    moderate: { categories: ['adult'], custom: [], regex: [] },
    custom: { categories: ['adult'], custom: [], regex: [] }
  },
  activeProfile: 'strict',
  haramKeywords: {
    adult: [
      'porn', 'xxx', 'porno', 'xvideos', 'pornhub', 'onlyfans', 'nsfw', 'hentai', 'chaturbate', 'adultfriendfinder', 'playboy', 'bangbros', 'redtube', 'youporn', 'xhamster', 'xnxx', 'tnaflix',
      'brazzers', 'realitykings', 'orgy', 'threesome', 'prostitute', 'escortservice', 'stripclub', 'fetishsite', 'livejasmin', 'webcamsex', 'adultfilm', 'x-rated', 'explicitvideo', 'uncensoredporn',
      'hardcoreporn', 'softcoreporn', 'adultactress', 'adultactor', 'pornstar', 'adultstudio', 'adultproduction', 'adultchannel', 'adultstream', 'adultforum', 'adultcommunity', 'adultnetwork',
      'toplessvideo', 'nudevideo', 'sexvideo', 'eroticvideo', 'adultlive', 'adultshow', 'adultmodel', 'adultphoto', 'adultimage', 'adultclip', 'adultscene', 'adultwebsite', 'adultlink', 'adultpage',
      'adultgallery', 'adultpic', 'camgirl', 'camshow', 'livecamsex', 'privatecam', 'sexchat', 'cybersexchat', 'adultchatroom', 'sextingapp', 'adultgame', 'eroticgame', 'seductionvideo',
      'intimatemovie', 'lustfilm', 'arousalvideo', 'orgasmvideo', 'ejaculationvideo', 'condomvideo', 'dildovideo', 'vibratorvideo', 'bondagevideo', 'bdsmvideo', 'dominationvideo', 'submissionvideo',
      'spankingvideo', 'voyeurvideo', 'exhibitionvideo', 'cuckoldvideo', 'milfvideo', 'teenporn', 'amateurporn', 'professionalporn', 'stripteasevideo', 'lapdancevideo', 'massagevideo', 'sensualvideo',
      'adultcontent', 'adultentertainment', 'adultindustry', 'adultservices', 'adultmedia', 'adultchannel', 'adultstream', 'adultforum', 'adultcommunity', 'adultnetwork', 'topless', 'nude', 'exposed',
      'genitalia', 'copulation', 'intercourse', 'fellatio', 'cunnilingus', 'pornography', 'adultphoto', 'adultimage', 'adultclip', 'adultscene', 'adultshow', 'adultlive', 'adultmodel', 'adultstar'
    ]
  }
};

// Initialize state
async function initialize() {
  const data = await chrome.storage.local.get(['isActive', 'endTime', 'activeProfile', 'customProfiles']);
  state.isActive = data.isActive || false;
  state.endTime = data.endTime || null;
  state.activeProfile = data.activeProfile || 'strict';
  if (data.customProfiles) state.profiles.custom = data.customProfiles;

  // Reset expired timer
  const now = Date.now();
  if (state.isActive && state.endTime && state.endTime < now) {
    state.isActive = false;
    state.endTime = null;
    await chrome.storage.local.set({ isActive: false, endTime: null });
    console.log('Reset expired timer state at:', new Date().toLocaleString());
  } else if (state.isActive && state.endTime > now) {
    enforceTimer();
  }
  await updateDeclarativeRules();
}

// Blocking logic
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (!state.isActive) return;
  try {
    const url = new URL(details.url);
    const profile = state.profiles[state.activeProfile];
    const keywords = state.haramKeywords.adult.concat(profile.custom || []);
    const regexPatterns = profile.regex.map(pattern => new RegExp(pattern));
    const isHaram = keywords.some(k => url.hostname.includes(k) || url.pathname.includes(k)) || regexPatterns.some(r => r.test(url.href));
    if (isHaram) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
      logAttempt(details.url);
    }
  } catch (e) {
    console.error('Navigation error:', e);
  }
}, { url: [{ urlMatches: '<all_urls>' }] });

// Update declarative rules
async function updateDeclarativeRules() {
  const profile = state.profiles[state.activeProfile];
  const keywords = state.haramKeywords.adult.concat(profile.custom || []);
  const rules = keywords.map((keyword, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
    condition: { urlFilter: `*${keyword}*`, resourceTypes: ['main_frame'] }
  }));
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1),
      addRules: rules.slice(0, 1000)
    });
  } catch (e) {
    console.error('Rule update error:', e);
  }
}

// Context menu
if (chrome.contextMenus) {
  chrome.contextMenus.create({ id: 'blockSite', title: 'Block Site', contexts: ['page'] }, () => {
    if (chrome.runtime.lastError) console.error('Context menu error:', chrome.runtime.lastError.message);
  });
  chrome.contextMenus.onClicked.addListener((info) => {
    const url = new URL(info.pageUrl).hostname;
    if (!state.profiles[state.activeProfile].custom.includes(url)) {
      state.profiles[state.activeProfile].custom.push(url);
      chrome.storage.local.set({ customProfiles: state.profiles[state.activeProfile] });
      updateDeclarativeRules();
      notify('Blocked', `${url} added to custom blocks.`);
    }
  });
}

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
    notify('Alert', 'Musafir is active and cannot be disabled until ' + new Date(state.endTime).toLocaleString());
    chrome.management.setEnabled(chrome.runtime.id, true);
  }
});

// Logging
function logAttempt(url) {
  chrome.storage.local.get('blockLog', (data) => {
    const log = data.blockLog || [];
    log.push({ url, time: new Date().toISOString() });
    chrome.storage.local.set({ blockLog: log });
    notify('Blocked', `${url} intercepted.`);
  });
}

// Timer enforcement
function enforceTimer() {
  if (!state.isActive || !state.endTime) return;
  const now = Date.now();
  if (now >= state.endTime) {
    state.isActive = false;
    state.endTime = null;
    chrome.storage.local.set({ isActive: false, endTime: null });
    notify('Unlocked', 'Protection period complete.');
  } else {
    setTimeout(enforceTimer, 1000);
  }
}

// Format time
function formatTime(ms) {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${days}d ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Notifications
function notify(title, message) {
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    });
  }
}

// Message listener for activation
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Received message:', msg);
  if (msg.action === 'startTimer') {
    if (!state.isActive) {
      console.log('Starting timer with duration:', msg.duration);
      state.isActive = true;
      state.endTime = Date.now() + msg.duration;
      chrome.storage.local.set({ isActive: true, endTime: state.endTime });
      enforceTimer();
      updateDeclarativeRules().then(() => {
        console.log('Timer started, state:', state);
        sendResponse({ success: true });
      });
    } else {
      console.log('Timer already active, rejecting request');
      sendResponse({ success: false, message: 'Already active until ' + new Date(state.endTime).toLocaleString() });
    }
  }
  return true;
});

// Initialize on startup
chrome.runtime.onInstalled.addListener(() => {
  initialize();
});
chrome.runtime.onStartup.addListener(() => {
  initialize();
});