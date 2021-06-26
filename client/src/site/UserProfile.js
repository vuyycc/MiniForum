import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom'
import { getUserById, updateImgUser, updatePassword } from '../axios';

import '../css/imgBtn.css'
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
    useEffect(() => {

        param.id ? getUserById(param.id).then(res => {
            setCurrentUser(res.data)
        }) : getUserById(getUserReducer.User._id).then(res => {
            setCurrentUser(res.data)
        })
    }, [])
    console.log(currentUser.userPost);
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

        if (newPassword === reNewPassword && newPassword !== '') {
            let body = {
                currentPassword,
                newPassword
            }
            updatePassword(body).then(res => {
                alert('Doi pass thanh cong')
                setCurrentPassword('')
                setNewPassword('')
                setReNewPassword('')
                setHidden(true)
                setType('hidden')
            }).catch((err) => {
                if (err)
                    alert(err);

            })
        } else (
            alert('Moi ban nhap lai')
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
    return (
        <div>
            <div><button onClick={logoutBtn}>Dang xuat</button></div>
            <div id="userProfile">
                <div>Name: {currentUser.name}</div>
                <div>Email: {currentUser.email}</div>
                <div>Address: {currentUser.address}</div>
                <div>Age: {currentUser.age}</div>
                <div id="password">
                    <div>Password:*******</div>
                    {param.id ? null : (<button onClick={showEditPassword}>Change Password</button>)}
                    <div id="change-pass">
                        <input type={type} value={currentPassword} onChange={handleChangeCurrentPassword} placeholder="Current Password" ></input>
                        <input type={type} value={newPassword} onChange={handleChangeNewPassword} placeholder="New Password"></input>
                        <input type={type} value={reNewPassword} onChange={handleChangeReNewPassword} placeholder="Re New Password"></input>
                        <button hidden={hidden} onClick={editPassword} >Submit</button>
                    </div>
                </div>
                <div>
                    <li>Avatar</li>
                    <img src={'http://localhost:8797/' + currentUser.avatar} height="300px" width="300px"></img>
                    <div>
                        {param.id ? null :
                            (<>
                                {/* <label for='file-upload'>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuZK3D1EibbMjkeDUE2lJ4WTc_2eNrW25B4g&usqp=CAU" height='30px' width='30px' />
                        </label> */}
                                <input id="file-upload" onChange={handleChangeImg} type='file'></input></>)}
                        {param.id ? null : (<button onClick={editImgBtn}>Edit Img</button>)}
                    </div>
                </div>
                {param.id ? null : (<div><button onClick={editBtn}>Edit</button></div>)}
            </div>
            
            <div>
                {currentUser.userPost ? currentUser.userPost.map(renderPost) : null}
            </div>
        </div>
    )
}
