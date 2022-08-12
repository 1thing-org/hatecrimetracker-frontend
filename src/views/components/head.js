import React from 'react'
import MetaTags from 'react-meta-tags'
const site_desc="Even though the anti-Asian hate is not under the spotlight in today’s news, the violence and hate is still happening on a daily basis. hatecrimetracker.1thing.org collects and visualizes all anti-Asian hate incidents reported by the media.";
const site_title="Anti-Asian Hate Crime Tracker";
const site_url="https://hatecrimetracker.1thing.org";
const Head = () => {
    return (
        <div className='wrapper'>
            <MetaTags>
                {/* <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <title>{site_title}</title>
                <meta name='type' property='og:type' content='website' />
                <meta name='title' property='og:title' content={site_title} />
                <meta name='site_name' property='og:site_name' content={site_title} />
                <meta name='keywords' content={site_title} />
                <meta name='url' property='og:url' content={site_url} />
                <meta name="image" property='og:image' content={site_url+'/images/hatecrimetracker_image.png'}/>
                <meta name="description" property='og:description' content={site_desc}/>
                
                <meta name="twitter:card" content="Anti-Asian Hate Crime Trend"/>
                <meta name="twitter:site" content={site_url}/>
                <meta name="twitter:creator" content="@1Thing_Org"/>
                <meta name="twitter:title" content={site_title}/>
                <meta name="twitter:description" content={site_desc}/>
                <meta name="twitter:image" content={site_url+"/images/hatecrimetracker_twitter.png"}/> */}
            </MetaTags>
        </div>
    )
}

export default Head
