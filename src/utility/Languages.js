//map from browser default language to support language
export const BROWSER_LANGUAGES = {
    'en-US': 'en',
    'en-GB': 'en',
    'zh-CN': 'zh-CN', 
    'zh-TW': 'zh-TW',
    'zh-HK': 'zh-TW',
    'ja': 'ja',
    'ko': 'ko',
    'hi': 'hi'
};

//Supported language id to native name
export const SUPPORTED_LANGUAGES = {
    'en': 'English',
    'zh-CN': '简体中文', 
    'zh-TW': '繁體中文',
    'ja': '日本語',
    'ko': '한국어',
    'hi': 'हिन्दी'
};

export const getBrowserLang = () => BROWSER_LANGUAGES[navigator.language] || 'en';
