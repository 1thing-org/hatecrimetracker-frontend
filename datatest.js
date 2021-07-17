serverURL = "http://a1207f00909c64052834777791969b7b-585460300.us-east-2.elb.amazonaws.com:8088";
token = ""

function GetAuth(){
    return token;
}
function getNews(page, cindex) {
    console.log("getNews with page: ", page, " cindex: ", cindex)
    // stop loading any data on page end
    if (page == "eof") {
        return new Promise((resolve, reject) => {
            resolve([])
        });
    }
    // return data
    return GetAuth().then(token => {
        console.log("page token sending: ", page)
        var requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": token,
                "page": page,
            },
            redirect: 'follow'
        };
        console.debug("getNews request: ", requestOptions)
        if (cindex == 0) {
            return fetch(serverURL + "/app/news/headline", requestOptions)
        }
        return fetch(serverURL + "/app/news/category/" + categories[cindex], requestOptions)
    })
        .then(res => {
            console.debug("fetch news result: ", JSON.stringify(res))
            // save page states
            // make sure pageToken is always set from the server even when page to the end should return empty token
            if (res.headers.has("page")) {
                // copy on write, good for ready heavy
                let ptArr = this.state.pageToken
                ptArr[cindex] = res.headers.get("page")
                this.setState({ pageToken: ptArr })
            }
            return res.json()
        }).catch(error => {
            console.error(error)
            this.setState({ refreshing: false })
        });
}
login = async () => {
    const { username, password } = ("admin", "admin"); //this.state
    let url = serverURL + "/auth/login?username=" + username + "&password=" + password
    try {
        const response = await fetch(url, { method: 'POST' })
        if (response.status === 200) {
            const userData = await response.json()
            try {
                token = response.headers.map.authorization;
                await AsyncStorage.setItem('userToken', response.headers.map.authorization);
                await AsyncStorage.setItem('userObject', JSON.stringify(userData));
                await AsyncStorage.setItem('userID', userData.ID)
            } catch (err) {
                console.error("login store user error ", err)
            }
            console.log("userID: ", await AsyncStorage.getItem("userID"))
            this.props.navigation.navigate('App', { userID: userData.ID });
        } else {
            Alert.alert("Login failed: invalid username or password");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}


login().then( ()=> {
    return getNews("",0);
})
.then( news => console.log("news:" + news))
;