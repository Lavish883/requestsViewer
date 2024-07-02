console.log("Background script running");

var infoForExtension;
var openPageTimeout;

chrome.webRequest.onBeforeRequest.addListener( 
    function (details) {
        if (details.url.includes(".m3u8") || details.url.includes(".vtt")) {
            
            if (infoForExtension === undefined) {
                infoForExtension = {
                    url: "",
                    subtitles: []
                };

                openPageTimeout = setTimeout(() => {
                    chrome.tabs.create({ url: `test.html?url=${infoForExtension.url}` });
                }, 1500);
            }

            if (details.url.includes(".vtt")) {
                infoForExtension.subtitles.push(details.url);
            }

            if (details.url.includes("playlist.m3u8")) {
                infoForExtension.url = details.url;
            }
            
            //clearTimeout(openPageTimeout);
            //console.log(details.url);
            console.log(infoForExtension);
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);