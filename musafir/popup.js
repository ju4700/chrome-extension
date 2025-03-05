let state = { isActive: false, endTime: null };

async function setTimer(durationMs) {
  let initialState;
  try {
    initialState = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        resolve(response || { isActive: false, endTime: null });
      });
    });
  } catch (e) {
    console.error('Failed to get initial state:', e);
    initialState = { isActive: false, endTime: null }; 
  }

  state.isActive = initialState.isActive;
  state.endTime = initialState.endTime;

  if (!state.isActive) {
    const endTime = Date.now() + durationMs;
    await chrome.storage.local.set({ isActive: true, endTime });
    state.isActive = true;
    state.endTime = endTime;
    updateUI(endTime);
    chrome.runtime.sendMessage({ action: 'startTimer', duration: durationMs }, (response) => {
      if (!response || !response.success) console.error('Activation failed:', response?.message);
    });
  } else {
    alert('Musafir is already active until ' + new Date(state.endTime).toLocaleString());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('quick').addEventListener('click', () => setTimer(3600000));
  document.getElementById('daily').addEventListener('click', () => setTimer(86400000));
  document.getElementById('week').addEventListener('click', () => setTimer(604800000));
  document.getElementById('month').addEventListener('click', () => setTimer(2592000000));
  document.getElementById('start').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('custom').value) * 3600000;
    if (hours && hours <= 2592000000) setTimer(hours);
  });

  function updateState() {
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
      if (response) {
        state.isActive = response.isActive || false;
        state.endTime = response.endTime || null;
        updateUI(state.endTime);
      } else {
        console.warn('No response from getState, using local state');
        updateUI(state.endTime); 
      }
    });
  }
  updateState(); 
  setInterval(updateState, 1000); 
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'updateState') {
      state.isActive = msg.isActive;
      state.endTime = msg.endTime;
      updateUI(state.endTime); 
    }
  });
});

function updateUI(endTime) {
  const status = document.getElementById('status');
  const controlPanel = document.getElementById('control-panel');
  if (endTime && Date.now() < endTime) {
    controlPanel.style.display = 'none';
    status.style.display = 'block';
    status.innerHTML = `Active until ${new Date(endTime).toLocaleString()}<br>Remaining: <span id="countdown"></span>`;
    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        updateUI(null);
        chrome.storage.local.get(['isActive', 'endTime'], (data) => {
          if (!data.isActive) status.innerHTML = 'Protection period complete.';
        });
      } else {
        document.getElementById('countdown').textContent = formatTime(remaining);
      }
    }, 1000);
  } else {
    controlPanel.style.display = 'block';
    status.style.display = 'none';
    status.innerHTML = '';
  }
  updateStats();
}

async function updateStats() {
  const { startTime, blockLog } = await chrome.storage.local.get(['startTime', 'blockLog']);
  const focusTime = startTime ? formatTime(Date.now() - startTime) : 'N/A';
  const blocks = (blockLog || []).length;
  document.getElementById('stats').innerHTML = `Focus: ${focusTime}<br>Blocks: ${blocks}`;
}

function formatTime(ms) {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${days}d ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}