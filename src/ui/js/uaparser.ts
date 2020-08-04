const regex_smarttv = /((?:oculus|samsung)browser)\/([\w\.]+)/i;
const regex_opera = /(opera).+version\/([\w\.]+)/i;
const regex_ie11 = /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i;

const regex_edge = /(edge|edgios|edgea|edga)\/((\d+)?[\w\.]+)/i; // Microsoft Edge
const regex_uwp = /(msapphost)\/([\w\.-]+)/i;
const regex_xbox = /(xbox)\/([\w\.-]+)/i;

const regex_chrome_etc = /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i;
const regex_chrome_mobile = /((?:android.+)crmo|crios)\/([\w\.]+)/i; // Chrome for Android/iOS

const regex_firefox = /(firefox)\/([\w\.-]+)$/i;

const regex_safari = /version\/([\w\.]+).+?(mobile\s?safari|safari)/i; // Safari & Safari Mobile

var STR_TYPE = 'string';

var util = {
    major: function (version) {
        return typeof (version) === STR_TYPE ? version.replace(/[^\d\.]/g, '').split('.')[0] : undefined;
    }
};

function UAParser() {
    var ua = (window as any).navigator.userAgent.toLowerCase();

    let name;
    let version;
    let data;

    let matches;
    // check the key work
    if (ua.indexOf('smart-tv') !== -1) {
        name = 'samsungbrowser';
        if (!!(matches = regex_smarttv.exec(ua))) {
            version = matches[2];
        } else {
            version = '1.0';
        }
    } else if (ua.indexOf('web0s') !== -1 || ua.indexOf('netcast') !== -1) {
        name = 'webos';
        if (ua.indexOf('chrome/53') !== -1) {
            version = '4.0';
        } else if (ua.indexOf('chrome/38') !== -1) {
            version = '3.0';
        } else if (ua.indexOf('safari/538') !== -1) {
            version = '2.0';
        } else {
            version = '1.0';
        }
    } else {
        // match browser name & version
        if (!!(matches = regex_opera.exec(ua))) {
            name = matches[1];
            version = matches[2];
        } else if (!!(matches = regex_ie11.exec(ua))) {
            name = 'ie';
            version = matches[2];
        } else if (!!(matches = regex_edge.exec(ua))) {
            name = 'edge';
            version = matches[2];
            data = {
                uwp: !!(matches = regex_uwp.exec(ua)),
                xbox: !!(matches = regex_xbox.exec(ua))
            };
        } else if (!!(matches = regex_chrome_etc.exec(ua))) {
            name = matches[1];
            version = matches[2];
        } else if (!!(matches = regex_chrome_mobile.exec(ua))) {
            name = 'chrome';
            version = matches[2];
        } else if (!!(matches = regex_firefox.exec(ua))) {
            name = matches[1];
            version = matches[2];
        } else if (!!(matches = regex_safari.exec(ua))) {
            name = matches[2];
            version = matches[1];
            data = {
                ios: false
            };

            if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
                data.ios = true;
            }
        } else {
            name = 'unknown';
            version = '1.0';
        }
    }

    let info: any = {};
    info.browser = name;
    info.version = util.major(version);
    info.data = data;
    if ((name === 'webos' && (window as any).location.hostname === '') || (window as any).tizen) {
      info.isWebApp = true;
    }else {
      info.isWebApp = false;
    }

    info.isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    info.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    return info;
};

export default UAParser;
