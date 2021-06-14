import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {signup} from '../axios'

export default function Signup() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const submitBtn = async () => {
        try {
            let body = {
                email,
                name,
                password
            }

            console.log(body);
            const result = await signup(body);
        } catch (error) {
            console.log('err', error.toJSON());
        }
    }

    return (
        <div id='signup'>
            <div>Signup</div>
            <input value={email} placeholder='email' onChange={(e)=>setEmail(e.target.value)}></input>
            <input value={name} placeholder='name' onChange={(e)=>setName(e.target.value)}></input>
            <input value={password} placeholder='password' onChange={(e)=>setPassword(e.target.value)}></input>
            <button onClick={submitBtn}>Signup</button>
        </div>
    )
}
