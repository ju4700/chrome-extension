async function setTimer(durationMs) {
    const endTime = Date.now() + durationMs;
    const pin = prompt('Set a 6-digit PIN:');
    if (!pin || pin.length !== 6 || isNaN(pin)) {
      alert('PIN must be 6 digits.');
      return;
    }
    await chrome.storage.local.set({ isActive: true, endTime, pin, startTime: Date.now(), lockAttempts: 0 });
    updateUI(endTime);
    chrome.runtime.sendMessage({ action: 'startTimer' });
  }
  
  document.getElementById('quick').addEventListener('click', () => setTimer(3600000));
  document.getElementById('daily').addEventListener('click', () => setTimer(86400000));
  document.getElementById('week').addEventListener('click', () => setTimer(604800000));
  document.getElementById('month').addEventListener('click', () => setTimer(2592000000));
  document.getElementById('start').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('custom').value) * 3600000;
    if (hours && hours <= 2592000000) setTimer(hours);
  });
  
  document.getElementById('unlock').addEventListener('click', async () => {
    const pin = document.getElementById('pin').value;
    const data = await chrome.storage.local.get(['pin', 'endTime']);
    if (pin === data.pin) {
      chrome.runtime.sendMessage({ action: 'overrideAttempt' });
      chrome.tabs.create({ url: chrome.runtime.getURL('warning.html') });
    } else {
      alert('Incorrect PIN');
    }
  });
  
  function updateUI(endTime) {
    const status = document.getElementById('status');
    const modes = document.getElementById('modes');
    const override = document.getElementById('override');
    if (endTime && Date.now() < endTime) {
      modes.style.display = 'none';
      override.style.display = 'block';
      status.innerHTML = `Locked until ${new Date(endTime).toLocaleString()}<br>Remaining: <span id="countdown"></span>`;
      setInterval(() => {
        document.getElementById('countdown').textContent = formatTime(endTime - Date.now());
      }, 1000);
    }
    updateStats();
  }
  
  async function updateStats() {
    const { startTime, blockLog, lockAttempts } = await chrome.storage.local.get(['startTime', 'blockLog', 'lockAttempts']);
    const focusTime = startTime ? formatTime(Date.now() - startTime) : 'N/A';
    const blocks = (blockLog || []).length;
    document.getElementById('stats').innerHTML = `Focus Time: ${focusTime}<br>Blocks: ${blocks}<br>Attempts: ${lockAttempts || 0}`;
  }
  
  function formatTime(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${days}d ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  chrome.storage.local.get(['isActive', 'endTime'], (data) => {
    if (data.isActive && data.endTime > Date.now()) updateUI(data.endTime);
  });