var flashAndReload = function(noReload) {
  var bm = chrome.benchmarking,
    tabs = chrome.tabs,
    flashAndReloadComplete = function() {
      console.log("[flashAndReload]");
      localStorage.removeItem("overlay_dismissed");
    };

  if (!bm) {
    chrome.runtime.openOptionsPage();
    return;
  }

  bm.clearHostResolverCache();
  bm.closeConnections();

  tabs.query({ currentWindow: true, active: true }, function(tabArray) {
    if (tabArray[0].url.match(/^http/)) {
      // Drop the ELB cookie
      chrome.cookies.remove(
        {
          url: tabArray[0].url,
          name: "AWSELB"
        },
        function(deleted_cookie) {
          console.log("Deleted cookie", deleted_cookie);
          if (!noReload) {
            tabs.reload(tabArray[0].id, { bypassCache: true });
            flashAndReloadComplete();
          } else {
            flashAndReloadComplete();
          }
        }
      );
    }
  });
};

chrome.browserAction.onClicked.addListener(function() {
  flashAndReload();
});

chrome.commands.onCommand.addListener(function(cmd) {
  if (cmd === "flash-and-reload") {
    flashAndReload();
  }
});

var options = {
  interval: (localStorage.getItem("auto.refresh.interval") || 0) / 1
};

var autoReload = null;

function clearAutoReload() {
  clearInterval(autoReload);
  autoReload = null;
  console.log("[AutoReload] stop");
}

function setAutoReload(options) {
  if (options.interval > 0) {
    if (autoReload) {
      clearAutoReload();
    }
    autoReload = setInterval(() => {
      flashAndReload(true);
    }, options.interval * 1000);
    console.log("[AutoReload] start");
  } else if (autoReload) {
    clearAutoReload();
  }
}

setAutoReload(options);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (sender.tab)
  {
    // From content script
    localStorage.setItem("overlay_dismissed", 1);
  }
  else
  {
    // From options page
    setAutoReload(message);
  }
  sendResponse({
    success: true
  });
});

var page;

// https://github.com/PayscaleNateW/http-header-extension
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    page = {
      instanceName: "",
      phpVersion: "",
      proxyCache: ""
    };
    for (var i in details.responseHeaders) {
      if (details.responseHeaders[i].name == "X-Instance") {
        page.instanceName = details.responseHeaders[i].value;
      }
      if (
        details.responseHeaders[i].name == "X-PHP-Version" &&
        details.responseHeaders[i].value != "(null)"
      ) {
        page.phpVersion = details.responseHeaders[i].value;
      }
      if (details.responseHeaders[i].name == "X-Proxycache") {
        page.proxyCache = details.responseHeaders[i].value;
      }
    }
  },
  { urls: [], types: ["main_frame"] },
  ["blocking", "responseHeaders"]
);

// https://github.com/tinybigideas/WebsiteIP
chrome.webRequest.onCompleted.addListener(
  function(info) {
    var dismissed = (localStorage.getItem("overlay_dismissed") || 0) == 1;

    if (!dismissed) {
      chrome.tabs.query({ currentWindow: true, active: true }, function(
        tabArray
      ) {
        if (info.tabId == tabArray[0].id) {
          if (info.url.match(/^http/)) {
            page.ip = info.ip;
            console.log("executing updateDnsFlusherStatusUI", page);
            chrome.tabs.executeScript({
              code: "updateDnsFlusherStatusUI('" + JSON.stringify(page) + "');"
            });
          }
        }
      });
    }
  },
  {
    urls: [],
    types: ["main_frame"]
  },
  []
);

console.log("background.js loaded");
