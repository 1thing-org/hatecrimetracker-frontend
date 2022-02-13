import { FacebookShareButton, FacebookIcon,  LinkedinShareButton,LinkedinIcon ,TwitterShareButton, TwitterIcon } from "react-share";

const SocialMediaSharing = ({size, bgStyle, iconFillColor}) => {
    return <>
            <TwitterShareButton
                title={"Even though the anti-Asian hate is not under the spotlight in today’s news, the violence and hate is still happening on a daily basis. This website collects and visualizes all anit-Asian hate incidents reported by the media. Due to lack of media coverage and under reports, data on the website can only represent a small portion of the big picture."}
                url={"https://hatecrimetracker.1thing.org/"}
                hashtags={["1thing"]}>
            <TwitterIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </TwitterShareButton>
            &nbsp;
            <LinkedinShareButton
                // title={"Hate crime tracker"} //(string): Title of the shared page
                summary={"Even though the anti-Asian hate is not under the spotlight in today’s news, the violence and hate is still happening on a daily basis. This website collects and visualizes all anit-Asian hate incidents reported by the media. Due to lack of media coverage and under reports, data on the website can only represent a small portion of the big picture."} //(string): Description of the shared page
                //source={"Page source"} //(string): Source of the content (e.g. your website or application name)
                url={"https://hatecrimetracker.1thing.org/"}
                hashtags={["1thing"]}
            >
            <LinkedinIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </LinkedinShareButton>
            {/* &nbsp;
            <FacebookShareButton
                url={"https://hatecrimetracker.1thing.org/"}
                quote={"Hate crime tracker"}
                hashtag={"1thing"}
                description={"This is the hate crime tracker page"}>
                <FacebookIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </FacebookShareButton> */}
        </>
}


const SocialMediaLink = ({size, bgStyle, iconFillColor}) => {
    return <>
            <button className={"button-no-background"} onClick={() => window.open("https://twitter.com/1Thing_Org")}>
            <TwitterIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </button>
            &nbsp;
            <button className={"button-no-background"} onClick={() => window.open("https://www.linkedin.com/company/1-thing-org")}>
            <LinkedinIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </button>
            {/* &nbsp; */}
            {/* <button className={"button-no-background"} onClick={() => window.open("")}>
                <FacebookIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </button> */}
        </>
}


const SocialMedia = ({size, bgStyle, iconFillColor, isShare}) => {

    
    return  (isShare ? 
        <SocialMediaSharing size={size} bgStyle={bgStyle} iconFillColor={iconFillColor} /> : 
        <SocialMediaLink size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>)
    
}


export default SocialMedia