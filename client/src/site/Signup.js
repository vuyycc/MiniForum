import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router'
import {signup} from '../axios'
import '../css/login.css'

export default function Signup() {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [show, setShow] = useState(false);
    const [bg, setBg] = useState("notify1 active")
    const [textMess, setTextMess] = useState('');

    const signupBtn = async () => {
        let body = {
            email,
            password,
            address: "default",
            age: '0',
            name: email.split('@')[0],
            role: "user",
            avatar: 'uploads/user.png',
        }

        if(password ==="" || email === "" || rePassword === ""){
            handleAlert("Không được để trống")
        }else if(password[0] !== password[0].toUpperCase()){
            handleAlert("Chữ cái đầu phải viết hoa")
        }else if(password.length < 6 || password.length > 10){
            handleAlert("Mật khẩu phải lớn hơn 6 và nhỏ hơn 10")
        }else if (password === rePassword ) {
            await signup(body).then(res => {
                setBg("notify1 success")
                handleAlert("Đăng ký thành công !")
                setTimeout(function(){
                    history.push('/login')
                },1000)
            }).catch(err => alert(err))
        } else {
            handleAlert("Đăng ký không thành công !")
        }
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }
    const handleChangeRePass = (event) => {
        setRePassword(event.target.value)
    }

    const handleAlert = (name) => {
        setTextMess(name)
        setShow(true)
        setTimeout(function () {
            setShow(false)
        }, 2000)
    }


    return (
        <div id='signup'>
            <div class="section">
                <div class={show ? bg : "notify1"}><span id="notifyType">{textMess}</span></div>
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
                                    <div>
                                    <label>Confirm Password</label>
                                        <input class="input-password" type="password" name="b" value={rePassword} onChange={handleChangeRePass} required/>
                                            
                </div>
                                        <button id="submit" onClick={signupBtn}>Sign Up</button>
                                        <div class="register">
                                            <h3>Already have an account? <a href="../login/index.html">Login</a></h3>
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
                                    </ul>
                                </div>
                            </div>
        </div>
    )
}
