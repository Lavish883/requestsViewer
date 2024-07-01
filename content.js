chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      console.log(details.url);
      return {cancel: false};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
  );