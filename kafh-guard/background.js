const DNS_SERVERS = {
    strong: { host: "high.kahfguard.com", port: 8080 },
    medium: { host: "medium.kahfguard.com", port: 8080 },
    weak: { host: "low.kahfguard.com", port: 8080 },
    noProtection: null
  };
  
  function setProxy(config) {
    if (config) {
      chrome.proxy.settings.set(
        {
          value: {
            mode: "fixed_servers",
            rules: {
              singleProxy: {
                host: config.host,
                port: config.port
              }
            }
          },
          scope: "regular"
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error setting proxy:", chrome.runtime.lastError);
          } else {
            console.log(`Proxy set to ${config.host}:${config.port}`);
          }
        }
      );
    } else {
      chrome.proxy.settings.set(
        {
          value: { mode: "direct" },
          scope: "regular"
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error disabling proxy:", chrome.runtime.lastError);
          } else {
            console.log("Proxy disabled");
          }
        }
      );
    }
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setProxy") {
      const dnsConfig = DNS_SERVERS[message.level];
      if (dnsConfig !== undefined) {
        setProxy(dnsConfig);
        sendResponse({ status: "success", level: message.level });
      } else {
        console.error("Invalid protection level:", message.level);
        sendResponse({ status: "error", message: "Invalid protection level" });
      }
    }
    return true;
  });
  