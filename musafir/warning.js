document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById('confirmUnlock');
    confirmButton.addEventListener('click', () => {
      // Notify background script to handle the unlock with delay
      chrome.runtime.sendMessage({ action: 'unlockRequest' }, (response) => {
        if (response && response.success) {
          document.querySelector('.warning-container').innerHTML = '<p>Unlocking in 1 hour...</p>';
        } else {
          alert('Unlock failed. Please try again.');
        }
      });
    });
  });