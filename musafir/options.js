// Save settings
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save').addEventListener('click', () => {
    const profile = document.getElementById('profile').value;
    const customList = document.getElementById('customList').value.split('\n').filter(Boolean);
    const customRegex = document.getElementById('customRegex').value.split('\n').filter(Boolean);
    chrome.storage.local.set({
      activeProfile: profile,
      customProfiles: { custom: { categories: ['adult'], custom: customList, regex: customRegex } }
    }, () => {
      chrome.runtime.sendMessage({ action: 'updateRules' }, (response) => {
        if (response && response.success) {
          alert('Settings saved and rules updated.');
        } else {
          alert('Settings saved, but rule update failed. Please retry.');
        }
      });
    });
  });

  // Clear statistics
  document.getElementById('clearStats').addEventListener('click', () => {
    chrome.storage.local.set({ blockLog: [] }, () => {
      document.getElementById('blockLog').value = '';
      alert('Statistics cleared.');
    });
  });

  // Load settings
  chrome.storage.local.get(['activeProfile', 'customProfiles', 'blockLog'], (data) => {
    document.getElementById('profile').value = data.activeProfile || 'strict';
    document.getElementById('customList').value = (data.customProfiles?.custom?.custom || []).join('\n');
    document.getElementById('customRegex').value = (data.customProfiles?.custom?.regex || []).join('\n');
    document.getElementById('blockLog').value = (data.blockLog || []).map(entry => `${entry.time}: ${entry.url}`).join('\n');
  });
});