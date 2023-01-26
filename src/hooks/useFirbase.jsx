import axios from "axios";
import React, { Component, createContext } from "react";
import { auth } from "../firebase";
import useJwt from '../utility/auth/jwt/useJwt'
import appConfig from "../configs/appConfig";
export const UserContext = createContext({ user: null });
class UserProvider extends Component {
    state = {
        user: null
    };
    
    async componentDidMount() {
        auth.onAuthStateChanged(async userAuth => {

            if (userAuth) {
                let user = null
                const { email, displayName, photoURL } = userAuth;
                const { jwt } = useJwt({})
                userAuth.getIdToken().then( (token) => {
                    jwt.setToken(token);
                    user = { email, displayName, photoURL };
                    axios.get(appConfig.api_endpoint + "/isadmin",
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "false",
                            "strict-origin-when-cross-origin": "false"
                        }
                    }).then(response => {
                        if (response.data.is_admin) {
                            user.isadmin = true;
                        }
                        this.setState({ user });
                    }).catch(e => {
                        console.log("Error checking if current user is admin:" + e);
                    });
                })                
            }
            else {
                this.setState({ user : null });
            }
        });


    }
    // constructor(props, context) {
    //     super(props, context);
    //     componentDidMount = async () => {
    //         alert("componentDidMount")
    //         auth.onAuthStateChanged(async userAuth => {
    //             //   const user = await generateUserDocument(userAuth);
    //             alert("onAuthStateChanged")
    //             user = null
    //             if (userAuth) {
    //                 const { email, displayName, photoURL } = userAuth;
    //                 user = { email, displayName, photoURL };
    //             }
    //             this.setState({ user });
    //         });
    //     };
    // }

    render() {
        const { user } = this.state;

        return (
            <UserContext.Provider value={user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }

}

export default UserProvider;