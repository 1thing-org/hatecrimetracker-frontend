import React from 'react'
import MetaTags from 'react-meta-tags'

const Head = () => {
    return (
        <div className='wrapper'>
            <MetaTags>
                <meta charset='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <title>Anti-Asian Hate Crime Tracker</title>
                <meta name='type' property='og:type' content='website' />
                <meta name='title' property='og:title' content='Anti-Asian Hate Crime Tracker' />
                <meta name='site_name' property='og:site_name' content='Anti-Asian Hate Crime Tracker' />
                <meta name='keywords' content='Anti-Asian Hate Crime Tracker' />
                <meta name='url' property='og:url' content='https://hatecrimetracker.1thing.org' />
                <meta
                    name='description'
                    property='og:description'
                    content='We are unified in their opposition to racism. During the COVID-19 epidemic, there has been an increase in anti-Asian American We can put an end to it if we work together.'
                />
            </MetaTags>
        </div>
    )
}

export default Head
