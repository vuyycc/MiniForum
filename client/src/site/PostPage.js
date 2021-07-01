import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router';
import {
    useParams,
    Link
} from "react-router-dom";
import { addComment, deleteComment, getPostById, getUserById, likePost, unLikePost, updateCommentInPost, getCommentByPage, deletePost } from '../axios';
import io from 'socket.io-client'
import Footer from '../pages/footer'
import Header from '../pages/header'
import '../css/postPage.css'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function PostPage() {

    const params = useParams()
    let history = useHistory()
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [user, setUser] = useState({})
    const [post, setPost] = useState({})
    const [idLiked, setIdLiked] = useState()
    const [idUnLiked, setIdUnLiked] = useState()
    const [postDele, setPostDele] = useState('alo')
    const [comment, setComment] = useState([])
    const [newComment, setNewComment] = useState()
    const [delId, setDelId] = useState()
    const [showCMT, setShowCMT] = useState(false)
    const [pages, setPages] = useState('')
    const [current, setCurrent] = useState('')
    const [listPages, setListPages] = useState([])
    console.log(getUserReducer.User);
    //Effect
    useEffect(() => {
        getUserById(getUserReducer.User._id).then(res => {
            setUser(res.data)
            console.log(res.data);
        })
    }, [])

    useEffect(() => {
        setIdUnLiked('')
        setIdLiked('')
        setNewComment('')
        setDelId('')
        console.log('done');
    }, [post])

    useEffect(() => {
        socket.on('like', (id) => {
            setIdLiked(id)
        })
        socket.on('unLikePost', (id) => {
            setIdUnLiked(id)
        })
        socket.on('addComment', data => {
            setNewComment(data)
        })
        socket.on('delComment', (id) => {
            setDelId(id)
        })
        socket.on('delete', (id) => {
            console.log(id);
            setPostDele(id)
        })
    }, [])

    useEffect(() => {
        if (postDele == params.id) {
            history.push('/main')
            alert('Bai viet da bi xoa')
        }
    }, [postDele])

    useEffect(() => {
        getPostById(params.id).then(res => {
            if (res.data.data.comment) {
                setPost(res.data.data)
                console.log(res.data.data);
                setPages(res.data.pages)
                setCurrent(res.data.current)
                let arrPages = []
                for (let i = 1; i <= 3 && i <= res.data.pages; i++) {
                    console.log(i);
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }
        })
    }, [idLiked, idUnLiked, newComment, delId])

    //handle
    const handleChangeComment = (event) => {
        setComment(event.target.value)
    }

    const deletePostBtn = () => {
        let id = params.id
        console.log(id);
        socket.emit('deletePost', id)
        deletePost(id).then(res => {
            //alert('Xóa bài viết thành công')
            history.push('/main')
        })
        
        //history.push('/main')
    }

    const addCommentBtn = () => {
        console.log(user._id)
        let body = {
            content: comment,
            author: user._id
        }
        addComment(params.id, body).then(setComment(''))
        socket.emit('addComment', body)
        setShowCMT(false)
    }

    const checkLike = post?.like?.filter(item => item._id.includes(user._id)).length
    console.log(checkLike);

    const likeBtn = () => {
        let body = {
            _id: user._id
        }
        likePost(params.id, body).then(() => {
            socket.emit('likePost', body._id)
        }).catch((err) => { if (err) alert(err) })
    }

    const showComment = () => {
        let a = showCMT ? false : true
        setShowCMT(a)
    }

    const unlikeBtn = () => {
        let body = {
            _id: user._id
        }
        unLikePost(params.id, body).then(() => {
            socket.emit('unLike', body._id)
        }).catch((err) => { if (err) alert(err) })
    }

    const deleteCommentBtn = (item) => {
        deleteComment(item._id).then(() => {
            console.log('xoa');
        }).catch((err) => { if (err) alert(err) })
        socket.emit('delComment', item._id)
    }


    //render

    const renderImg = (item) => {
        if(!item.imgVideo) {
            return null
        } else if (item.imgVideo?.split('.').pop() == 'png' || item.imgVideo?.split('.').pop() == 'jpg' || item.imgVideo?.split('.').pop() == 'jpeg'){
            return (
                <img src={'http://localhost:8797/' + item.imgVideo} height="200px" width="200px" />
            )
        }
    }

    const renderComment = (item, index) => {
        console.log(item);
        return (
            <div class="body">
                <div class="authors">
                    <div class="username-comment"><a href="#">{item.author?.name}</a></div>
                    <div>{item.author.role === 'user' ? "Member" : "Admin"}</div>
                    <img src={'http://localhost:8797/' + item.author?.avatar} alt="user avatar" />
                    <div>Posts: <u>{item.author?.userPost.length}</u></div>
                    <br />
                    <hr />
                    <br />
                </div>

                <div class="content">
                    Created {new Date(item.created).toDateString()} at {new Date(item.created).toLocaleTimeString()}
                    <br />
                    <hr/>
                    <div style={{ marginTop: "10px" }}>
                    {item.content}
                    </div>
                    <br />
                    <div class="like" style={{ marginTop: "30px" }}>
                        {/* <div class="like-number"><i class="far fa-thumbs-up"></i> Likes: <u>100</u></div> */}
                        {getUserReducer.User._id == item.author?._id || getUserReducer.User.role === 'admin' ?
                            (<><button onClick={() => { deleteCommentBtn(item) }}><i class="far fa-trash-alt"></i> Delete</button></>) : null}
                        {/* <button><i class="far fa-thumbs-up"></i>  Like</button> */}
                    </div>
                </div>
            </div>
        )
    }
    const renderCommentNull = () => {
        return (
            <div class="body" >          
                Bình luận gì cho tác giả vui đi :))
            </div>
        )
    }


    const renderPage = (item, index) => {

        return (
            <div class={current == item ? "pagination:number isPages" : "pagination:number"} onClick={() => {toPages(item) }}>
                {item}
            </div>)
    }

    const toPages = (name) => {
        getCommentByPage(params.id, name).then(res => {
            setPost(res.data.data)
            setCurrent(res.data.current)
            if (Number(name) == listPages[2] && Number(name) != res.data.pages) {
                let i = Number(name)
                let max = i + 2
                let arrPages = []
                for (i; i <= max && i <= res.data.pages; i++) {
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }
        })
    }

    const toPagesF = (name) => {
        getCommentByPage(params.id,name).then(res => {
            setPost(res.data.data)
            setCurrent(res.data.current)
            if (Number(name) == listPages[0] || Number(name) < listPages[0]) {
                let i = listPages[0] - 2
                let max = listPages[0]
                let arrPages = []
                for (i; i <= max && i <= res.data.pages; i++) {
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }
        })
    }


    return (
        <div class="container">
            <Header />
            <main>
                <div class="main-container-post">
                    <div class="space"></div>

                    <div class="navigate">
                        <span><a href="/main">TIE - Forums</a> &gt;&gt; <a href={post.space ? '/main/spaces/' + post.space[0]._id :''}>{post.space ? post.space[0].name : ""}</a> &gt;&gt; <a href="#">{post?.title}</a></span>
                    </div>

                    <div class="topic-container">
                        <div class="head">
                            <div class="authors">Tác giả ?</div>
                            <div class="content">Chủ đề: {post?.title}</div>
                        </div>

                        <div class="body">
                            <div class="authors">
                                <div class="username"><a href="#">{post?.author?.name}</a></div>
                        
                                <div>{post.author?.role == 'user' ? "Member" : "Admin"}</div>
                                <img src={'http://localhost:8797/' + post?.author?.avatar} alt="user avatar" />
                                <div>Posts: <u>{post?.author?.userPost.length}</u></div>
                               
                                <br />
                                <hr />
                                <br />
                            </div>

                            <div class="content">
                                {post?.described}
                                <br />
                                <br /><br />
                                {renderImg(post)}
                                <br />
                                <hr />
                                Created {new Date(post.created).toDateString()} at {new Date(post.created).toLocaleTimeString()} By {post.author?.name}

                                <div class="like" style={{marginTop: "10px"}}>
                                    <div class="like-number"><i class="far fa-thumbs-up"></i> Likes: <u>{post?.like?.length}</u></div>
                                    {getUserReducer.User._id == post.author?._id || getUserReducer.User.role === 'admin'?
                                        (<><button onClick={deletePostBtn}><i class="far fa-trash-alt"></i> Delete</button></>) : null}
                                    <button onClick={checkLike ? unlikeBtn : likeBtn} id={checkLike ? "cl-red" : ""}><i class={checkLike ? "far fa-thumbs-up cl-red" : "far fa-thumbs-up"}></i>  Like</button>
                                </div>
                                <div class="comment">
                                    <button style={showCMT ? { color: "red" } : { color: "white" }} onClick={showComment}><i class="far fa-comment-alt"></i> Comment</button>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div class={showCMT ? "comment-area v-block" : "comment-area hide v-non"} id="comment-area">
                        <textarea  value={comment} name="comment" id="" placeholder="Comment ..." onChange={handleChangeComment}/>
                        <input type="submit" name="" id="" value="submit" onClick={addCommentBtn}/>
                    </div>



                    <div class="comments-container">
                        <div class="head">
                            <div class="authors">Tác giả ?</div>
                            <div class="content">Comment: </div>
                        </div>

                        {post.comment?.length != 0 ? post.comment?.map(renderComment) : renderCommentNull()}

                    </div>

                    <div class={Number(pages) > 0 ? "pagination:container" : "disableOff"}>
                        <div class={current != 1 && current > 2 ? "pagination:number arrow" : "pagination:number arrow disableOff"} onClick={() => { toPagesF(Number(current) - 1) }}>
                            <svg width="18" height="18">
                                <use href="#left" />
                            </svg>
                            <span class="arrow:text">First</span>

                        </div>
                        <div class={current > 2 ? "pagination:number" : "pagination:number disableOff"}>
                            ...
                        </div>
                        {listPages.map(renderPage)}
                        <div class={current < pages - 2 ? "pagination:number" : "pagination:number disableOff"}>
                            ...
                        </div>
                        <div class={current != pages && pages > 3 ? "pagination:number arrow" : "pagination:number arrow disableOff"} onClick={() => { toPages(Number(current) + 1) }} >
                            <span class="arrow:text">Last</span>
                            <svg width="18" height="18">
                                <use href="#right" />
                            </svg>
                        </div>
                    </div>



                    <svg class="hide">
                        <symbol id="left" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></symbol>
                        <symbol id="right" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></symbol>
                    </svg>


                    <div class="comment-area hide" id="reply-area">
                        <textarea name="reply" id="" placeholder="reply ..." />
                        <input type="submit" name="" id="" value="submit" />
                    </div>

                </div>
            </main>
            <Footer />



        </div>

    )
}