import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router';
import { addComment, deleteComment, getPostById, getUserById, likePost, unLikePost, updateCommentInPost } from './axios';
import io from 'socket.io-client'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function PostPage() {
    const param = useParams()
    let history = useHistory()
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [user, setUser] = useState({})
    const [post, setPost] = useState({})
    const [idLiked, setIdLiked] = useState()
    const [idUnLiked, setIdUnLiked] = useState()
    const [postDele, setPostDele] = useState('alo')
    const [comment, setComment] = useState()
    const [newComment, setNewComment] = useState()
    const [delId, setDelId] = useState()
    useEffect(() => {
        getUserById(getUserReducer.User._id).then(res => {
            setUser(res.data)
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
            console.log(id);
            setIdLiked(id)
        })
        socket.on('unLikePost', (id) => {
            console.log(id);
            setIdUnLiked(id)
        })
        socket.on('addComment', data => {
            console.log(data);
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
        if (postDele == param.id) {
            history.push('/')
            alert('Bai viet da bi xoa')
        }
    }, [postDele])
    useEffect(() => {
        getPostById(param.id).then(res => {
            if(res.data.data.comment){
                setPost(res.data.data)
            }
            console.log(res.data.data); 
        })
    }, [idLiked, idUnLiked, newComment, delId])
    const handleChangeComment = (event) => {
        setComment(event.target.value)
    }
    const addCommentBtn = () => {
        let body = {
            content: comment,
            author: user._id
        }
        addComment(param.id, body).then(setComment(''))
        socket.emit('addComment', body)
    }
    const renderPost = (item) => {
        if (!item.imgVideo) {
            return null
        } else if (item.imgVideo?.split('.').pop() == 'png' || item.imgVideo?.split('.').pop() == 'jpg' || item.imgVideo?.split('.').pop() == 'jpeg') {
            return (
                <img src={'http://localhost:8797/' + item.imgVideo} height="100px" width="100px" />
            )
        } else {
            return (
                <p>The forum doesn't support file preview yet.Please click <a href={'http://localhost:8797/' + post?.imgVideo}>here.</a>File name:  {post?.imgVideo?.split('uploads').pop()}</p>
            )
        }

    }
    const checkLike = post?.like?.filter(item => item._id.includes(user._id)).length
    console.log(checkLike);
    const likeBtn = () => {
        let body = {
            _id: user._id
        }
        likePost(param.id, body).then(() => {
            socket.emit('likePost', body._id)
        }).catch((err) => { if (err) alert(err) })
    }
    const unlikeBtn = () => {
        let body = {
            _id: user._id
        }
        unLikePost(param.id, body).then(() => {
            socket.emit('unLike', body._id)
        }).catch((err) => { if (err) alert(err) })
    }

    const deleteCommentBtn = (item) => {
        deleteComment(item._id).then(() => {
            console.log('xoa');
        }).catch((err) => { if (err) alert(err) })
        socket.emit('delComment', item._id)
    }

    const renderComment = (item, index) => {
        return (
            <div className="user-comment">
                <p><img src={'http://localhost:8797/' + item.author?.avatar} height="50px" width="50px" /> {item.author?.name}</p>
                <p>{item.content}{getUserReducer.User._id == item.author?._id ? (<><button onClick={() => { deleteCommentBtn(item) }}>Delete</button></>) : null}</p>
            </div>
        )
    }

    const toPro = () => {
        history.push('/userprofile')
    }

    return (
        <div>
            <button >Dang xuat</button>
            <div>
                <div id="user-pro">
                    <div>{post?.author?.name}</div>
                    <p> <img src={'http://localhost:8797/' + post?.author?.avatar} height="100px" width="100px" />  </p>
                </div>
                <div id="infor-post">
                    <p>Title: {post?.title}</p>
                    <p>Des: {post?.described}</p>
                    {renderPost(post)}
                    <p>{post?.like?.length} <button onClick={checkLike ? unlikeBtn : likeBtn}>{checkLike ? 'UnLike' : 'Like'}</button></p>
                    <div>
                        <div>Comment</div>
                        {post?.comment?.map(renderComment)}
                    </div>
                </div>
            </div>

            <div id="to-comment">
                <div>
                    <label>Comment</label>
                    <input value={comment} onChange={handleChangeComment} />
                </div>
                <button disabled={!comment} onClick={addCommentBtn} >Submit</button>
            </div>
        </div>
    )
}
