import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {login} from '../axios'

export default function Login({ setToken }  ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginBtn = async () => {

        try {
            let body = {
                email,
                password
            }
            console.log(body)
            const result = await login(body)
            console.log(setToken)
            setToken(result.data.accessToken)
        } catch (error) {
            console.log('errr', error.toJSON())
            // alert(error.response.data.err)
        }

    }

    return (
        <div id='login'>
            <div>Login</div>
            <input value={email} placeholder="Email.." onChange={(e)=>setEmail(e.target.value)}></input>
            <input value={password} placeholder="Password" onChange={(e)=>setPassword(e.target.value)}></input>
            <button onClick={loginBtn}>Login</button>        
        </div>
    )
}
