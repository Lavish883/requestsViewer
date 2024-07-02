console.log("Background script running");

var infoForExtension;
var openPageTimeout;

function setTimeoutForPage(time = 500) {
    if (openPageTimeout !== undefined) {
        clearTimeout(openPageTimeout);
    }

    openPageTimeout = setTimeout(() => {
        chrome.tabs.create({ url: `test.html?url=${infoForExtension.url}&subtitles=${JSON.stringify(infoForExtension.subtitles)}` });
        openPageTimeout = undefined;
        infoForExtension = undefined;
        console.log('cleared');
    }, time);
}

chrome.webRequest.onBeforeRequest.addListener( 
    function (details) {
        if ((details.url.includes(".m3u8") || details.url.includes(".vtt")) && !details.url.includes("chrome-extension") && !details.initiator.includes("chrome-extension")) {
            
            if (infoForExtension === undefined) {
                infoForExtension = {
                    url: "",
                    subtitles: []
                };
            }

            if (details.url.includes(".vtt")) {
                infoForExtension.subtitles.push(details.url);
            }

            if (details.url.includes("playlist.m3u8")) {
                infoForExtension.url = details.url;
            }

            setTimeoutForPage();
            console.log(details);
            //console.log(infoForExtension);
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);