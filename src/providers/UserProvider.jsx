import React, { Component, createContext } from "react";
import { auth } from "../firebase";


export const UserContext = createContext({ user: null });

class UserProvider extends Component {
    state = {
        user: null
    };

    componentDidMount() {
        auth.onAuthStateChanged(async userAuth => {

            //const user = await generateUserDocument(userAuth);
            let user = null
            if (userAuth) {
                const { email, displayName, photoURL } = userAuth;
                user = { email, displayName, photoURL };
            }
            this.setState({ user });
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