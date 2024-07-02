var urlQuery = new URLSearchParams(window.location.search);
var vidURL = urlQuery.get('url');

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
            control: true,

            // Show quality in setting
            setting: true,

            // Get the resolution text from level
            getResolution: (level) => level.height + 'P',

            // I18n
            title: 'Quality',
            auto: 'Auto',
        }),

        artplayerPluginMultipleSubtitles({
            subtitles: [
                {
                    name: 'English',
                    url: 'https://cc.2cdns.com/8b/dd/8bdd25784240a2bdcf83c84ab9d739ac/eng-2.vtt'
                }
            ]
        })
    ],
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
});