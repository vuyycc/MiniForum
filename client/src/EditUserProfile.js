import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getUserById, updateUser } from './axios'

export default function EditUserProfile() {
    let history = useHistory()
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [currentUser, setCurrentUser] = useState({})
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState('')

    useEffect(() => {
        getUserById(getUserReducer.User._id).then(res => {
            setCurrentUser(res.data)
            setName(res.data.name)
            setAddress(res.data.address)
            setAge(res.data.age)
            //setPassword(res.data.password)
            //setAvatar(res.data.avatar)
        })
    }, [])
    const handleChangeName = (event) => {
        setName(event.target.value)
    }
    const handleChangeAddress = (event) => {
        setAddress(event.target.value)
    }
    const handleChangeAge = (event) => {
        setAge(event.target.value)
    }
    const handleChangePassword = (event) => {
        setPassword(event.target.value)
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
        })
    }

    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()
    }

    const goToMyProfile = () => {
        history.push('/userprofile')
    }

    return (
        <div>
            <div>
                <div>
                    <label>Name</label>
                    <input value={name} onChange={handleChangeName}></input>
                </div>
                <div>
                    <label>Address</label>
                    <input value={address} onChange={handleChangeAddress}></input>
                </div>
                <div>
                    <label>Age</label>
                    <input value={age} onChange={handleChangeAge} ></input>
                </div>
                <div>
                    <button onClick={updateBtn}>Update</button>
                </div>
            </div>
        </div>
    )
}
