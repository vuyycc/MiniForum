import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { getAllUser, deleteUser, getAllPost, deletePost } from '../axios'
import Footer from '../pages/footer'
import Header from '../pages/header'
import '../css/adminPage.css'

export default function AdminPage() {
    const [allUser, setAllUser] = useState([])
    const [postData, setPostData] = useState([])

    useEffect(() => {
        getAllUser().then(res => {
            setAllUser(res.data)
            console.log(res.data);
        }).catch((err) => {
            alert(err)
        })
    }, [])

    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)
        })
    }, [])

    const deleteUserBtn = (item,index) => {
        let id = item._id
        console.log(id);
        deleteUser(id).then(res => {
            console.log("Da xoa");
        })
        let newList = allUser
        newList.splice(index, 1)
        setAllUser([...newList])
    }

    const renderBox = (item, index) => {
        let countLike = 0;
        let countComment = 0;
        for(let i = 0; i < item.userPost.length;i++){
            if (item.userPost[i].like || item.userPost[i].comment){
                countLike += item.userPost[i].like.length
                countComment += item.userPost[i].comment.length
            }  
        }
        console.log(countLike);
        console.log(countComment);
        return(
            <div class="body">
                <div class="authors">
                    <div class="username"><a href="#">{item.name}</a></div>
                    <div>{item.role === 'admin'?"Admin":"Member"}</div>
                    <img src={'http://localhost:8797/' + item.avatar} height="100px" width="100px" />
                    <div>Posts: <u>{item.userPost.length}</u></div>
                    <br />
                    <hr />
                    <br />
                </div>

                <div class="content">
                    <span>Email: {item.email}</span>
                    <br /> <br />
                    <span>Age: {item.age}</span>
                    <br /> <br />
                    <span>Address: {item.address}</span>
                    <br /><br />
                    <hr />
                    <br />
                    <div class="like">
                        <div class="like-number"><i class="far fa-thumbs-up"></i> Likes: <u>{countLike}</u></div>
                        <br />
                        <div class="like-number"><i class="far fa-comment-alt"></i> Comments : <u>{countComment}</u></div>
                        {item.role == 'user'?(<><button onClick={()=>{deleteUserBtn(item, index)}}><i class="far fa-trash-alt"></i>  Delete</button></>):null}
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div class="container">
            <Header />
            <main>
                <div class="main-container">
                    <div class="space"></div>


                    <div class="topic-container">
                        <div class="head">
                            <div class="authors">Tài khoản ?</div>
                            <div class="content">Bài viết </div>
                        </div>
                    {allUser.map(renderBox)}
                        
                    </div>


                    <div class="comment-area hide" id="comment-area">
                        <textarea name="comment" id="" placeholder="Comment ..." />
                        <input type="submit" name="" id="" value="submit" />
                    </div>
                </div>
                
        </main>
                <Footer />



        </div>

            )
}