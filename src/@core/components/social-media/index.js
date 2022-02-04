import { FacebookShareButton, FacebookIcon,  LinkedinShareButton,LinkedinIcon ,TwitterShareButton, TwitterIcon } from "react-share";

const SocialMedia = ({size, bgStyle, iconFillColor}) => {

    
    return (
        <>
            <TwitterShareButton
                title={"Hate crime tracker"}
                url={"https://hatecrimetracker.1thing.org/"}
                hashtags={["onething"]}>
            <TwitterIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </TwitterShareButton>
            &nbsp;
            <LinkedinShareButton
                title={"Hate crime tracker"} //(string): Title of the shared page
                summary={"This is the hate crime tracker page"} //(string): Description of the shared page
                source={"Page source"} //(string): Source of the content (e.g. your website or application name)
                url={"https://hatecrimetracker.1thing.org/"}
                hashtags={["onething"]}
            >
            <LinkedinIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </LinkedinShareButton>
            &nbsp;
            <FacebookShareButton
                url={"https://hatecrimetracker.1thing.org/"}
                quote={"Hate crime tracker"}
                hashtag={"#onething"}
                description={"This is the hate crime tracker page"}>
                <FacebookIcon round size={size} bgStyle={bgStyle} iconFillColor={iconFillColor}/>
            </FacebookShareButton>
        </>
    )
}


export default SocialMedia