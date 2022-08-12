//map from browser default language to support language
export const BROWSER_LANGUAGES = {
    'en-US': 'en',
    'en-GB': 'en',
    'zh-HK': 'zh-TW',
};

//Supported language id to native name
export const SUPPORTED_LANGUAGES = {
    'en': 'English',
    'zh-CN': '简体中文', 
    'zh-TW': '繁體中文',
    'ja': '日本語',
    'ko': '한국어',
    'hi': 'हिन्दी',
    'si': 'සිංහල',
    'my-MM': 'မြန်မာ',
    'th': 'ภาษาไทย',
    'km': 'កម្ពុជា',
    'mn' : 'Монгол',
    'vi' : 'Tiếng Việt',
    'fil' : 'Filipino',
    'bn' : 'বাংলা',
};

export const getBrowserLang = () => BROWSER_LANGUAGES[navigator.language] || navigator.language || 'en';
