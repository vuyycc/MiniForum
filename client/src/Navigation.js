 import React, { useEffect, useState, Suspense, lazy } from 'react'

import {
    BrowserRouter as Router,
    Route, useHistory, useParams
} from "react-router-dom";

import { Switch } from 'react-router';
import jwtDecode from 'jwt-decode';
import LoginScreen from './site/Login'
//import SignupScreen from './SignupScreen';
import SignupScreen from './site/Signup';
import Home from './pages/Home'

//import UserProfile from './UserProfile';
import { useDispatch } from 'react-redux';

import { GET_USER } from './actions/types';

const Main = lazy(() => import('./Main'))
const Spaces = lazy(() => import('./site/Spaces'))
const UserProfile = lazy(() => import('./site/UserProfile'))
const EditUserProfile = lazy(() => import('./EditUserProfile'))
//const Post = lazy(() => import('./Post'))
//const PostPage = lazy(() => import('./PostPage'))
const PostPage = lazy(()=> import('./site/PostPage'))
//const AdminPage = lazy(() => import('./AdminPage'))
const AdminPage = lazy(()=> import('./site/adminPage'))
const keyStorage = 'accessToken'

export default function Navigation() {
    const dispatch = useDispatch()
    const [token, setToken] = useState('')

    const loginSucess = (token) => {
        setToken(token)
        localStorage.setItem(keyStorage, token)
        console.log(token);


    }
    useEffect(() => {
        let token = localStorage.getItem(keyStorage)
        setToken(token)
    }, [])

    if (token) {
        var crurrentUser = jwtDecode(token);
        dispatch({ type: GET_USER, payload: crurrentUser })
        console.log(crurrentUser.role);
    }

    return (
        <div>
            <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/signup" component={SignupScreen}/>
                {!token ?
                    <LoginScreen setToken={loginSucess} />:
                    (<><Suspense fallback={<div>Loading...</div>}>
                        {crurrentUser.role === 'admin' ? (<Route exact path='/admin' component={AdminPage} />) : null}
                        <Route exact path="/main" component={Main} />
                            <Route exact path="/main/:id" component={Main} />
                            <Route exact path="/main/pages/:id" component={Main} />
                            <Suspense fallback={<div>Loading...</div>}>
                            <Route exact path="/main/spaces/:id" component={Spaces} />
                                <Route exact path="/main/spaces/:id/:page" component={Spaces} />
                                <Route exact path="/userprofile" component={UserProfile} /></Suspense>
                        <Route exact path="/userprofile/:id" component={UserProfile} />
                        <Route exact path="/post/:id" component={PostPage} />
                        <Route exact path='/editUSer' component={EditUserProfile} />
                    </Suspense></>)}
                </Switch>
            </Router>
        </div>
    )
}
