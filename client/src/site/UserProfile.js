import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom'
import { getUserById, updateImgUser, updatePassword , updateUser} from '../axios';
import Header from '../pages/header'
import Footer from '../pages/footer'
import '../css/useProfile.css'
//import '../css/imgBtn.css'

export default function UserProfile() {
    const param = useParams()
    const history = useHistory()
    const [img, setImg] = useState('')
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [currentUser, setCurrentUser] = useState({})
    const [type, setType] = useState('hidden')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const [hidden, setHidden] = useState(true)
    const [checkEdit, setCheckEdit] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [age, setAge] = useState('')
    const [showPas, setShowPas] = useState(false)
    useEffect(() => {

        param.id ? getUserById(param.id).then(res => {
            setCurrentUser(res.data)
        }) : getUserById(getUserReducer.User._id).then(res => {
            setCurrentUser(res.data)
        })
    }, [])
    console.log(currentUser);
    const editBtn = () => {
        history.push('/editUser')
    }
    const handleChangeImg = (event) => {
        setImg(event.target.files[0])
    }
    const handleChangeCurrentPassword = (event) => {
        setCurrentPassword(event.target.value)
    }
    const handleChangeNewPassword = (event) => {
        setNewPassword(event.target.value)
    }
    const handleChangeReNewPassword = (event) => {
        setReNewPassword(event.target.value)
    }
    const editImgBtn = () => {
        if (!img) {
            alert('You must input Img')
        } else {
            const formData = new FormData();
            formData.append('avatar', img, img.name)
            updateImgUser(formData).then(res => {
                window.location.reload()
            })
        }
    }
    const showEditPassword = () => {
        setType('password')
        setHidden(false)
    }
    const editPassword = () => {

        if (newPassword === reNewPassword && newPassword !== ''&& newPassword.length > 5 && newPassword.length < 10) {
            let body = {
                currentPassword,
                newPassword
            }
            updatePassword(body).then(res => {
                alert('Đổi pass thành công')
                setCurrentPassword('')
                setNewPassword('')
                setReNewPassword('')
                setShowPas(false)
            }).catch((err) => {
                if (err)
                    alert(err);

            })
        } else (
            alert('Mời bạn nhập lại')
        )
    }

    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }

    const renderPost = (item, index) => {
        console.log(item);
        return (
            <p className="box-post-2" key={index}>
                <Link to={'/post/' + item._id}>
                    {item.author ? item.author.name : 'User đã bị xóa'}
                    <div>Title: {item.title}</div>
                    <div>Des: {item.described}</div>
                    <div>{item.like?.length} Like</div>
                    <div>{item.comment?.length} Comment</div>
                </Link>
            </p>
        )
    }

    const handleChangeName = (event) => {
        setName(event.target.value)
    }
    const handleChangeAddress = (event) => {
        setAddress(event.target.value)
    }
    const handleChangeAge = (event) => {
        setAge(event.target.value)
    }

    const updateBtn = () => {
        let body = {
            _id: currentUser._id,
            name,
            address,
            age,
            //password
            //avatar
        }
        updateUser(body).then(res => {
            history.push('/userprofile')
            window.location.reload()
        })
    }


    const showEdit = () => {
        let a = checkEdit ? false : true
        console.log(a);
        setCheckEdit(a)
    }

    const showEditPass = () => {
        let a = showPas ? false : true
        console.log(a);
        setShowPas(a)
    }


    const renderLikeCmt = (item) => {
        let countLike = 0;
        let countComment = 0;
        for(let i = 0; i < item?.length; i++){
            if (item[i].like || item[i].comment) {
                countLike += item[i].like.length
                countComment += item[i].comment.length
            }
        }
        return (
            <p>{countLike} - {countComment}</p>
        )
    }

    return (
        <div class="container">
            <Header/>

                    <main>
                        <div class="main-container">
                            <div class="wrapper">
                                <div class="left">
                            <img src={'http://localhost:8797/' + currentUser?.avatar}
                                        alt="user" width="100"/>
                                        <h4>{currentUser?.name}</h4>
                                        <p>UI Developer</p>
                    </div>
                                    <div class="right">
                                        <div class="info">
                                            <h3>Personal Information</h3>
                                            <div class="info_data">
                                                <div class="data">
                                                    <h4>Email</h4>
                                                    <p>{currentUser?.email}</p>
                                                </div>
                                                <div class="data">
                                                    <h4>Address</h4>
                                                    <p>{currentUser?.address}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="projects">
                                            <h3>Member - TIE</h3>
                                            <div class="projects_data">
                                                <div class="data">
                                                    <h4>LIKE - COMMENT:</h4>
                                                    <p>{renderLikeCmt(currentUser?.userPost)}</p>
                                                </div>
                                                <div class="data">
                                                    <h4>Posts Number:</h4>
                                                    <a href="#"><p>{currentUser?.userPost?.length}</p></a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="social_media">
                                            <ul>
                                                <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                                                <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                                                <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                                            </ul>

                                            <div class="edit">
                                                <button onClick={showEdit} >Edit profile</button>
                                                {/* <br/><br/>
                                                <button onClick={showEditPass} >Edit password</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="animation-area-2">
                                    <ul class="box-area">
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </div>

                    <div class={showPas ? "edit-profile c-block" : 'edit-profile c-none'} id="edit-area">
                        <div class="username-edit">
                            <h3>Current Password:</h3>
                            <input type="text" name="" id="" value={currentPassword} placeholder="Current Password ..." onChange={handleChangeCurrentPassword} />
                        </div>
                        <div class="email-edit">
                            <h3>New Password:</h3>
                            <input type="text" name="" id="" value={newPassword} placeholder="New password ..." onChange={handleChangeNewPassword} />
                        </div>
                        <div class="phone-edit">
                            <h3>Re New Password:</h3>
                            <input type="text" name="" id="" value={reNewPassword} placeholder="New re password ..." onChange={handleChangeReNewPassword} />
                        </div>
                        <div class="edit-submit">
                            <input type="button" name="" id="" value="submit" onClick={editPassword} />
                        </div>
                    </div>

                    <div class={checkEdit ? "edit-profile c-block" : 'edit-profile c-none'} id="edit-area">
                                    <div class="username-edit">
                                        <h3>Username:</h3>
                                        <input type="text" name="" id="" placeholder="New username ..." onChange={handleChangeName} />
                    </div>
                                        {/* <div class="job-edit">
                                            <h3>Job/Position:</h3>
                                            <input type="text" name="" id="" placeholder="New job/position ..."/>
                    </div> */}
                                            <div class="email-edit">
                                                <h3>Address:</h3>
                                                <input type="text" name="" id="" placeholder="New address ..." onChange={handleChangeAddress}/>
                    </div>
                                                <div class="phone-edit">
                                                    <h3>Age:</h3>
                                                    <input type="text" name="" id="" placeholder="New age ..." onChange={handleChangeAge}/>
                    </div>
                                                    <div class="edit-submit">
                                                        <input type="button" name="" id="" value="submit" onClick={updateBtn}/>
                    </div>
                                                    </div>
                                                </div>
        </main>

                                           <Footer />



    </div>

    )
}
