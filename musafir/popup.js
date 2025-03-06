// State management
let state = { isActive: false, endTime: null };

// Set timer for activation
async function setTimer(durationMs) {
  console.log('setTimer called with duration:', durationMs);
  // Fetch the latest state before proceeding
  await new Promise((resolve) => {
    chrome.storage.local.get(['isActive', 'endTime'], (data) => {
      state.isActive = data.isActive || false;
      state.endTime = data.endTime || null;
      console.log('Current state before activation:', state);
      resolve();
    });
  });

  if (!state.isActive) {
    const endTime = Date.now() + durationMs;
    console.log('Setting new timer: endTime =', new Date(endTime).toLocaleString());
    await chrome.storage.local.set({ isActive: true, endTime });
    state.isActive = true;
    state.endTime = endTime;
    updateUI(endTime);
    chrome.runtime.sendMessage({ action: 'startTimer', duration: durationMs }, (response) => {
      console.log('Background response:', response);
      if (!response || !response.success) {
        console.error('Activation failed:', response?.message || 'No response from background');
      }
    });
  } else {
    console.log('Extension already active, alerting user.');
    alert('Musafir is already active until ' + new Date(state.endTime).toLocaleString());
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded');
  const quickButton = document.getElementById('quick');
  const dailyButton = document.getElementById('daily');
  const weekButton = document.getElementById('week');
  const monthButton = document.getElementById('month');
  const startButton = document.getElementById('start');

  if (!quickButton || !dailyButton || !weekButton || !monthButton || !startButton) {
    console.error('One or more buttons not found in popup.html');
    return;
  }

  quickButton.addEventListener('click', () => {
    console.log('1 Hour button clicked');
    setTimer(3600000); // 1 hour
  });
  dailyButton.addEventListener('click', () => {
    console.log('24 Hours button clicked');
    setTimer(86400000); // 24 hours
  });
  weekButton.addEventListener('click', () => {
    console.log('1 Week button clicked');
    setTimer(604800000); // 1 week
  });
  monthButton.addEventListener('click', () => {
    console.log('1 Month button clicked');
    setTimer(2592000000); // 1 month
  });
  startButton.addEventListener('click', () => {
    console.log('Custom Activate button clicked');
    const hours = parseInt(document.getElementById('custom').value) * 3600000;
    if (hours && hours <= 2592000000) {
      console.log('Custom duration:', hours);
      setTimer(hours);
    } else {
      console.error('Invalid custom duration:', hours);
      alert('Please enter a valid duration (1-720 hours).');
    }
  });

  // Initialize UI
  function updateState() {
    chrome.storage.local.get(['isActive', 'endTime'], (data) => {
      state.isActive = data.isActive || false;
      state.endTime = data.endTime || null;
      console.log('Updated state:', state);
      updateUI(state.endTime);
    });
  }
  updateState(); // Initial update
  setInterval(updateState, 1000); // Poll every second
});

// Update UI
function updateUI(endTime) {
  const status = document.getElementById('status');
  const controlPanel = document.getElementById('control-panel');
  if (!status || !controlPanel) {
    console.error('Status or control panel elements not found');
    return;
  }
  if (endTime && Date.now() < endTime) {
    console.log('Updating UI to active state');
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
    console.log('Updating UI to inactive state');
    controlPanel.style.display = 'block';
    status.style.display = 'none';
    status.innerHTML = '';
  }
  updateStats();
}

// Update statistics
async function updateStats() {
  const { startTime, blockLog } = await chrome.storage.local.get(['startTime', 'blockLog']);
  const focusTime = startTime ? formatTime(Date.now() - startTime) : 'N/A';
  const blocks = (blockLog || []).length;
  const stats = document.getElementById('stats');
  if (stats) {
    stats.innerHTML = `Focus: ${focusTime}<br>Blocks: ${blocks}`;
  } else {
    console.error('Stats element not found');
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