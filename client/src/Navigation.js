import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route, useHistory, useParams
} from "react-router-dom";
import Signup from './site/Signup';
import Main from './site/Main';
import Login from './site/Login';


const keyStorage = 'accessToken'
export default function Navigation() {
    const [token, setToken] = useState('')

    const loginSucess = (newToken) => {
        setToken(newToken)
        localStorage.setItem(keyStorage, newToken)
    }

    useEffect(() => {
        let token = localStorage.getItem(keyStorage)
        setToken(token)
    }, [])

    return (
        <Router>       
                <Route path="/signup" component={Signup} />
            {!token ? <Login exact setToken={loginSucess} /> : (
                <> <Route exact path="/" component={Main} /></>
            )}
        </Router>
    );
}

