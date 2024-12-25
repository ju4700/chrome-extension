function setProxyLevel(level) {
    chrome.runtime.sendMessage({ action: "setProxy", level }, (response) => {
      if (response.status === "success") {
        alert(`${level.toUpperCase()} protection enabled`);
      } else {
        alert(`Error: ${response.message}`);
      }
    });
  }
  
  document.getElementById("strong").addEventListener("click", () => setProxyLevel("strong"));
  document.getElementById("medium").addEventListener("click", () => setProxyLevel("medium"));
  document.getElementById("weak").addEventListener("click", () => setProxyLevel("weak"));
  document.getElementById("noProtection").addEventListener("click", () => setProxyLevel("noProtection"));
  