import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router'
import {login} from '../axios'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

export default function Login({ setToken }  ) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let history = useHistory()
    const [show, setShow] = useState(false);
    const [textMess, setTextMess] = useState('');
    const [bg, setBg] = useState("notify active")
    const loginBtn = async () => {
        if(email == "" || password == ""){
            handleAlert("Không được để trống")
        }
        else if (password[0] !== password[0].toUpperCase()) {
            handleAlert("Ký tự đầu phải viết hoa");
        } else if (password.length < 6 || password.length > 10) {
            handleAlert("Mật khẩu không được lớn hơn 10 nhỏ hơn 6")
        } else {
            try {
                let body = {
                    email,
                    password
                }
                const result = await login(body)
                console.log(result);
                setBg("notify success")              
                handleAlert("Đăng nhập thành công !")
                setTimeout(() => {
                    setToken(result.data.accessToken)
                    history.push('/main')
                },500)
            } catch (error) {
                handleAlert("Đăng nhập không thành công !")
            }
        }
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)  
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const goToSignUp = () => {
        history.push('/signup')
    }
    const handleSubmit = (event) => {
        event.preventDefault()
    }
    
    const handleAlert = (name) => {
        setTextMess(name)
        setShow(true)
        setTimeout(function() {
            setShow(false)
        },2000)
    }

    return (
        <div id='login'>
            <div class="section">
                <div class={show ? bg : "notify"}><span id="notifyType">{textMess}</span></div>
                <div class="box">
                    <div class="img-container">
                        <a href="/"><img src="/assets/images/Logo.png" alt="TIE-Logo"/></a>
            </div>
                        <h2>Sign in</h2>
                        <div  id="myForm">
                            <div>
                            <label>Email</label>
                                <input class="input-username" type="email" name="a" value={email} onChange={handleChangeEmail} required/>
                                    
                </div>
                                <div>
                                <label>Password</label>
                                    <input class="input-password" type="password" name="b" value={password} onChange={handleChangePass} required/>
                                        
                </div>
                                    <button id="submit" onClick={loginBtn}>Log in</button>
                                    <div class="register">
                                        <h3>Don't have an account? <a href="/signup">Sign Up</a></h3>
                                    </div>
            </div>
                            </div>
                            <div class="animation-area">
                                <ul class="box-area">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>

                        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                                </ul>
                            </div>
    </div>
        </div>
    )
}

