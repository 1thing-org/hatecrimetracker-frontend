import { useEffect } from 'react'

// Native replacement for react-meta-tags, which uses the React-18-deprecated
// ReactDOM.render API and throws `Failed to execute 'removeChild' on 'Node'`
// during commit when it has children to render.

const SITE_DESC = "Even though the anti-Asian hate is not under the spotlight in today’s news, the violence and hate is still happening on a daily basis. hatecrimetracker.1thing.org collects and visualizes all anti-Asian hate incidents reported by the media.";
const SITE_TITLE = "Anti-Asian Hate Crime Tracker";
const SITE_URL = "https://hatecrimetracker.1thing.org";

const META_TAGS = [
    { attrs: { charset: 'UTF-8' } },
    { attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
    { attrs: { name: 'type', property: 'og:type', content: 'website' } },
    { attrs: { name: 'title', property: 'og:title', content: SITE_TITLE } },
    { attrs: { name: 'site_name', property: 'og:site_name', content: SITE_TITLE } },
    { attrs: { name: 'keywords', content: SITE_TITLE } },
    { attrs: { name: 'url', property: 'og:url', content: SITE_URL } },
    { attrs: { name: 'image', property: 'og:image', content: SITE_URL + '/images/hatecrimetracker_image.png' } },
    { attrs: { name: 'description', property: 'og:description', content: SITE_DESC } },
    { attrs: { name: 'twitter:card', content: 'Anti-Asian Hate Crime Trend' } },
    { attrs: { name: 'twitter:site', content: SITE_URL } },
    { attrs: { name: 'twitter:creator', content: '@1Thing_Org' } },
    { attrs: { name: 'twitter:title', content: SITE_TITLE } },
    { attrs: { name: 'twitter:description', content: SITE_DESC } },
    { attrs: { name: 'twitter:image', content: SITE_URL + '/images/hatecrimetracker_twitter.png' } },
];

const Head = () => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = SITE_TITLE;

        const elements = META_TAGS.map(({ attrs }) => {
            const el = document.createElement('meta');
            Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
            document.head.appendChild(el);
            return el;
        });

        return () => {
            document.title = previousTitle;
            elements.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
        };
    }, []);

    return null;
};

export default Head;
