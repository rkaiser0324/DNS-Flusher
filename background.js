var flashAndReload = function(noReload) {
  var bm = chrome.benchmarking,
    tabs = chrome.tabs,
    flashAndReloadComplete = function() {
      console.log("[flashAndReload]");
    };

  if (!bm) {
    tabs.create({ url: "https://goo.gl/vSh9im" });
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

          var url = new URL(tabArray[0].url);
          chrome.cookies.getAll({
            domain: url.host
          }, function(cookieArray) {
            console.log(cookieArray);
          });

          // https://github.com/jamesdbloom/delete-all-cookies doesn't look like it uses callbacks properly
          // This sets a timeout before reload:  https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/cookies/manager.js?autodive=0%2F

          // chrome.cookies.remove(
          //   {
          //     url: tabArray[0].url,
          //     name: "AWSELB"
          //   },
          //   function(deleted_cookie) {
          //     console.log("Deleted cookie", deleted_cookie);
          //     if (!noReload) {
          //       tabs.reload(tabArray[0].id, { bypassCache: true });
          //       flashAndReloadComplete();
          //     } else {
          //       flashAndReloadComplete();
          //     }
          //   }
          // );

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
  setAutoReload(message);
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
    chrome.tabs.query({ currentWindow: true, active: true }, function(
      tabArray
    ) {
      if (info.tabId == tabArray[0].id) {
        if (info.url.match(/^http/)) {
          page.ip = info.ip;
          //console.log('executing updateDnsFlusherStatusUI', page);
          chrome.tabs.executeScript({
            code: "updateDnsFlusherStatusUI('" + JSON.stringify(page) + "');"
          });
        }
      }
    });
  },
  {
    urls: [],
    types: ["main_frame"]
  },
  []
);

console.log("background.js loaded");
