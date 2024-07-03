var urlQuery = new URLSearchParams(window.location.search);
var vidURL = urlQuery.get('url');

var subtitles = JSON.parse(urlQuery.get('subtitles'));
var actualSubArry = [];
var subOptionsArry = [{
    html: 'Display',
    tooltip: 'Show',
    switch: false,
    onSwitch: function (item) {
        item.tooltip = item.switch ? 'Hide' : 'Show';
        art.subtitle.show = !item.switch;
        return !item.switch;
    },
}];

// "https://cc.2cdns.com/13/ec/13eca2fcf87bedc8c2034803e92e4835/kor-21.vtt"
// make it so only kor part is that part of the url

subtitles = subtitles.map(subLink => {
    var sub = subLink.split('/');
    var subName = sub[sub.length - 1].split('-')[0];
    
    actualSubArry.push({
        name: subName,
        url: subLink
    });

    subOptionsArry.push({
        html: subName,
        name: subName
    });
});

console.log(actualSubArry);

var art = new Artplayer({
    container: '.artplayer-app',
    url: vidURL,
    setting: true,
    pip: true,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    airplay: true,
    theme: '#f20732',
    miniProgressBar: true,
    plugins: [
        artplayerPluginHlsQuality({
            // Show quality in control
            //control: true,

            // Show quality in setting
            setting: true,

            // Get the resolution text from level
            getResolution: (level) => level.height + 'P',

            // I18n
            title: 'Quality',
            auto: 'Auto',
        }),
    ],
    subtitle: { 
    },
    customType: {
        m3u8: function playM3u8(video, url, art) {
            if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.on('destroy', () => hls.destroy());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Unsupported playback format: m3u8';
            }
        }
    },
    settings: [
        {
            width: 200,
            html: 'Subtitles',
            tooltip: 'Off',
            icon: '<img width="22" heigth="22" src="/icons/subtitle.svg">',
            selector: subOptionsArry,
            onSelect: function (item) {
                art.subtitle.switch(actualSubArry.find(sub => sub.name === item.name).url);
                art.setting.option[4].tooltip = item.html;
                art.setting.option[4].selector[0].switch = true;
            },
        },
    ]
});