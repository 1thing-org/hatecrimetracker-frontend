import axios from "axios";
import React, { Component, createContext } from "react";
import { auth } from "../firebase";
import useJwt from '@src/auth/jwt/useJwt'

export const UserContext = createContext({ user: null });
const API_URL = "http://127.0.0.1:8081"
class UserProvider extends Component {
    state = {
        user: null
    };

    async componentDidMount() {
        auth.onAuthStateChanged(async userAuth => {

            //const user = await generateUserDocument(userAuth);
            if (userAuth) {
                let user = null
                const { email, displayName, photoURL } = userAuth;
                const token = userAuth.getIdToken().then( (token) => {
                    useJwt.setToken(token);
                    user = { email, displayName, photoURL };
                    axios.get(API_URL + "/isadmin",
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
                    })
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